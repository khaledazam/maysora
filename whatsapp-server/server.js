import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());

// Multi-Session Storage & State
const sessions = {
  session1: {
    id: 'session1',
    label: 'الخط الأول (المشرف العام - بشمهندس أحمد رمضان)',
    defaultPhone: '01011860173',
    defaultName: 'بشمهندس أحمد رمضان',
    authDir: path.join(__dirname, 'auth_session_1'),
    sock: null,
    currentQR: null,
    rawQRString: null,
    isConnected: false,
    userPhone: null,
    userName: 'بشمهندس أحمد رمضان',
    isConnecting: false,
  },
  session2: {
    id: 'session2',
    label: 'الخط الثاني (خدمة العملاء / المبيعات VIP)',
    defaultPhone: '',
    defaultName: 'خدمة عملاء ميسورا',
    authDir: path.join(__dirname, 'auth_session_2'),
    sock: null,
    currentQR: null,
    rawQRString: null,
    isConnected: false,
    userPhone: null,
    userName: 'خدمة عملاء ميسورا',
    isConnecting: false,
  }
};

let activeSessionId = 'session1';

async function startSession(sessionId) {
  const sess = sessions[sessionId];
  if (!sess) return;
  if (sess.isConnecting) return;
  sess.isConnecting = true;

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sess.authDir);
    const { version } = await fetchLatestBaileysVersion();

    sess.sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      browser: [`MAYSORA ${sess.id === 'session1' ? 'Executive Line 1' : 'Support Line 2'}`, 'Chrome', '120.0.0']
    });

    sess.sock.ev.on('creds.update', saveCreds);

    sess.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        sess.rawQRString = qr;
        try {
          sess.currentQR = await QRCode.toDataURL(qr, {
            margin: 2,
            scale: 8,
            color: {
              dark: sess.id === 'session1' ? '#0A0A0A' : '#0B192C',
              light: '#FFFFFF'
            }
          });
          sess.isConnected = false;
          console.log(`[MAYSORA Gateway] Live QR ready for ${sess.label}`);
        } catch (err) {
          console.error(`[MAYSORA Gateway] Error generating QR for ${sess.id}:`, err);
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        console.log(`[MAYSORA Gateway] ${sess.label} closed (code: ${statusCode}). Reconnecting: ${shouldReconnect}`);

        sess.isConnected = false;
        sess.currentQR = null;
        sess.rawQRString = null;
        sess.isConnecting = false;

        if (statusCode === DisconnectReason.loggedOut) {
          console.log(`[MAYSORA Gateway] ${sess.label} logged out. Resetting auth directory...`);
          try {
            fs.rmSync(sess.authDir, { recursive: true, force: true });
          } catch (e) {}
          setTimeout(() => startSession(sessionId), 2000);
        } else if (shouldReconnect) {
          setTimeout(() => startSession(sessionId), 3000);
        }
      } else if (connection === 'open') {
        sess.isConnected = true;
        sess.currentQR = null;
        sess.rawQRString = null;
        sess.isConnecting = false;

        const rawId = sess.sock.user?.id || '';
        const cleanNumber = rawId.split(':')[0] || rawId.split('@')[0];
        sess.userPhone = cleanNumber;
        sess.userName = sess.sock.user?.name || sess.defaultName;

        console.log(`[MAYSORA Gateway] ${sess.label} CONNECTED! Phone: +${sess.userPhone} (${sess.userName})`);
      }
    });

    sess.isConnecting = false;
  } catch (error) {
    console.error(`[MAYSORA Gateway] Failed to start ${sess.label}:`, error);
    sess.isConnecting = false;
    setTimeout(() => startSession(sessionId), 5000);
  }
}

// REST API Endpoints

// 1. Get Live Dual-Session Status
app.get('/api/status', (req, res) => {
  const sess1 = sessions.session1;
  const sess2 = sessions.session2;

  res.json({
    activeSessionId,
    sessions: {
      session1: {
        id: 'session1',
        label: sess1.label,
        connected: sess1.isConnected,
        phone: sess1.userPhone || sess1.defaultPhone,
        name: sess1.userName,
        hasQR: !!sess1.currentQR
      },
      session2: {
        id: 'session2',
        label: sess2.label,
        connected: sess2.isConnected,
        phone: sess2.userPhone || sess2.defaultPhone,
        name: sess2.userName,
        hasQR: !!sess2.currentQR
      }
    }
  });
});

// 2. Get Live QR Code for a Specific or Active Session
app.get('/api/qr', (req, res) => {
  const reqSessionId = req.query.session || activeSessionId;
  const sess = sessions[reqSessionId] || sessions[activeSessionId];

  res.json({
    sessionId: sess.id,
    activeSessionId,
    label: sess.label,
    connected: sess.isConnected,
    phone: sess.userPhone || sess.defaultPhone,
    name: sess.userName,
    qr: sess.currentQR,
    rawQR: sess.rawQRString,
    otherSession: {
      id: sess.id === 'session1' ? 'session2' : 'session1',
      connected: sessions[sess.id === 'session1' ? 'session2' : 'session1'].isConnected,
      phone: sessions[sess.id === 'session1' ? 'session2' : 'session1'].userPhone
    }
  });
});

// 3. Switch Active Sending Session
app.post('/api/switch', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId && sessions[sessionId]) {
    activeSessionId = sessionId;
    console.log(`[MAYSORA Gateway] Active sending line switched to: ${sessions[sessionId].label}`);
    return res.json({
      success: true,
      activeSessionId,
      activeSessionLabel: sessions[sessionId].label
    });
  }
  return res.status(400).json({ success: false, error: 'Invalid sessionId. Use session1 or session2.' });
});

// 4. Send Message from a specific session or current active session
app.post('/api/send', async (req, res) => {
  const targetSessionId = req.body.sessionId || activeSessionId;
  const sess = sessions[targetSessionId] || sessions[activeSessionId];

  if (!sess.isConnected || !sess.sock) {
    // Check if other session is connected as fallback
    const fallbackId = sess.id === 'session1' ? 'session2' : 'session1';
    const fallbackSess = sessions[fallbackId];

    if (req.body.allowFallback && fallbackSess.isConnected && fallbackSess.sock) {
      console.log(`[MAYSORA Gateway] ${sess.label} disconnected. Falling back to ${fallbackSess.label}...`);
      return doSendMessage(fallbackSess, req.body.to, req.body.message, res);
    }

    return res.status(400).json({
      success: false,
      error: `الخط المحدد (${sess.label}) غير متصل بالواتساب حالياً. يرجى مسح رمز الـ QR أو التبديل للخط الآخر.`
    });
  }

  return doSendMessage(sess, req.body.to, req.body.message, res);
});

async function doSendMessage(sess, to, message, res) {
  if (!to || !message) {
    return res.status(400).json({ success: false, error: 'Recipient phone number and message are required.' });
  }

  try {
    let cleanPhone = to.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '2' + cleanPhone;
    }
    const jid = `${cleanPhone}@s.whatsapp.net`;

    await sess.sock.sendMessage(jid, { text: message });
    console.log(`[MAYSORA Gateway] Sent message via [${sess.label}] to ${jid}`);
    return res.json({
      success: true,
      sentVia: sess.id,
      sentViaLabel: sess.label,
      fromPhone: sess.userPhone,
      to: cleanPhone,
      message
    });
  } catch (err) {
    console.error(`[MAYSORA Gateway] Error sending message via ${sess.id}:`, err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// 5. Disconnect / Logout a specific session
app.post('/api/logout', async (req, res) => {
  const targetSessionId = req.body.sessionId || activeSessionId;
  const sess = sessions[targetSessionId] || sessions[activeSessionId];

  try {
    if (sess.sock) {
      await sess.sock.logout();
    }
  } catch (e) {
    console.error(`Logout error for ${sess.id}:`, e);
  }

  try {
    fs.rmSync(sess.authDir, { recursive: true, force: true });
  } catch (e) {}

  sess.isConnected = false;
  sess.userPhone = null;
  sess.currentQR = null;
  sess.rawQRString = null;

  setTimeout(() => startSession(sess.id), 2000);
  return res.json({
    success: true,
    message: `تم إلغاء اقتران ${sess.label} بنجاح. جاري توليد رمز QR جديد...`
  });
});

// Start Express server & both WhatsApp sessions
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  MAYSORA VIP Multi-Account WhatsApp Gateway (v2.0)`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Session 1: Line 1 (المشرف العام)`);
  console.log(`  Session 2: Line 2 (خدمة العملاء / المبيعات)`);
  console.log(`====================================================`);
  
  // Start Line 1 and Line 2 concurrently
  startSession('session1');
  startSession('session2');
});
