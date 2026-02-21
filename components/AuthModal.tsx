
import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, Info, Terminal } from 'lucide-react';
import { useAuth } from './AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const success = await login(email, password);
        if (success) onClose();
        else alert("Login Failed: Please check your credentials or wait for admin approval.");
    } catch (err) {
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminQuickLogin = async () => {
    setLoading(true);
    try {
        const success = await login('admin@sandhya.com', 'admin');
        if (success) onClose();
    } catch (err) {
      alert("Admin Login Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-900 rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck size={20} />
               </div>
               <div>
                  <h2 className="text-xl font-black text-gray-900 leading-none">Portal Access</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Select your access level</p>
               </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username or Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium text-sm"
                  placeholder="Username or Email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 active:scale-95 disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In as Agent'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
                onClick={handleAdminQuickLogin}
                className="w-full bg-blue-900/5 hover:bg-blue-900/10 text-blue-900 border border-blue-900/20 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95"
            >
                <Terminal size={18} /> Enter as Master Admin
            </button>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center mt-4">
               Authorized master credentials will be pre-filled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
