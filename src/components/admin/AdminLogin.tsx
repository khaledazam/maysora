import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../../services/authService';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(username, password, rememberMe);
      setIsLoading(false);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || 'بيانات الدخول غير صحيحة');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#D4AF37] selection:text-[#0D0D0D]">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#8C7335]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back button */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
        <button
          onClick={onBackToSite}
          type="button"
          className="inline-flex items-center gap-2 text-sm text-[#C0B7A6] hover:text-[#D4AF37] transition-colors"
        >
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          <span>العودة إلى موقع ميسورة</span>
        </button>

        <span className="text-xs px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          بوابة الإدارة المشفرة
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#8C7335]/10 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4 text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#F8F5F0] mb-2 font-serif tracking-wide">
            تسجيل دخول المشرفين
          </h1>
          <p className="text-xs text-[#C0B7A6]">
            مكتب ميسورة لخدمات الحج والعمرة الفاخرة والاستشارات المالية
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-200 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-[#E2DACB] mb-2">
              اسم المستخدم أو البريد الإداري
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin أو vip@maysoragroup.com"
                className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F8F5F0] placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-all pl-11 rtl:pr-4 rtl:pl-11"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-[#E2DACB]">
                كلمة المرور
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1C1C1C] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F8F5F0] placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-all pl-11 rtl:pr-4 rtl:pl-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#D4AF37] transition-colors"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs text-[#C0B7A6]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-[#1C1C1C] text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0 w-4 h-4 cursor-pointer"
              />
              <span>تذكر هذا الجهاز</span>
            </label>
            <span className="text-[#C0B7A6]/70">تشفير 256-bit SSL</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8528] text-[#0D0D0D] font-bold text-sm shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>دخول لوحة التحكم</span>
              </>
            )}
          </button>
        </form>

        {/* Credentials Hint */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-1.5">
          <p className="text-[11px] text-[#C0B7A6]/80 leading-relaxed">
            حساب الإدارة العليا (Super Admin):
            <br />
            المستخدم: <strong className="text-[#D4AF37]">khaled@admin.com</strong> &nbsp;|&nbsp; كلمة المرور: <strong className="text-[#D4AF37]">102003000@</strong>
          </p>
          <p className="text-[10px] text-neutral-400">
            يمكن للموظفين الدخول بحساباتهم المخصصة حسب الصلاحيات الممنوحة لهم.
          </p>
        </div>
      </div>
    </div>
  );
};
