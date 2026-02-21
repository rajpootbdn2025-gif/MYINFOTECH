import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube, Linkedin, ShieldCheck } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#0f172a] text-slate-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-orange-500/10">
                    S
                </div>
                <div>
                    <h3 className="text-xl font-black text-white tracking-tighter leading-none">SANDHYA INFOTECH</h3>
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">E-District Partner</p>
                </div>
            </div>
            <p className="text-sm leading-relaxed font-medium">
              A pioneer in digital governance and citizen empowerment. We provide a bridge between government services and citizens through technology-driven solutions.
            </p>
            <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, idx) => (
                    <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                        <Icon size={18} />
                    </a>
                ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">Contact Information</h4>
            <ul className="space-y-6">
                <li className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-orange-500 flex-shrink-0">
                        <Mail size={18} />
                    </div>
                    <span className="text-sm font-medium">help@sandhyainfotech.com</span>
                </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">Quick Navigation</h4>
            <ul className="space-y-4">
                {['About Our Center', 'Government Portals', 'Service Charges', 'Privacy Policy', 'Terms of Service', 'Support Desk'].map(link => (
                    <li key={link}>
                        <a href="#" className="text-sm font-medium hover:text-orange-500 transition-colors flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                            {link}
                        </a>
                    </li>
                ))}
            </ul>
          </div>

          {/* Hours & Security */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">Working Hours</h4>
            <div className="bg-slate-800/50 p-6 rounded-[2rem] border border-slate-800">
                <ul className="space-y-4">
                    <li className="flex items-center justify-between text-sm">
                        <span className="font-bold text-slate-300">Mon - Sat</span>
                        <span className="font-medium">9:00 - 20:00</span>
                    </li>
                    <li className="flex items-center justify-between text-sm">
                        <span className="font-bold text-slate-300">Sunday</span>
                        <span className="font-medium text-orange-500">10:00 - 14:00</span>
                    </li>
                </ul>
                <div className="mt-8 pt-8 border-t border-slate-700">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-green-500" size={24} />
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Secure Portal</p>
                            <p className="text-[9px] text-slate-500">256-bit SSL Encrypted</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                &copy; {new Date().getFullYear()} Sandhya Infotech Digital India Initiative. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1200px-Digital_India_logo.svg.png" alt="Digital India" className="h-8 opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                <img src="https://upload.wikimedia.org/wikipedia/hi/thumb/5/5a/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png" alt="Aadhaar" className="h-8 opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            </div>
        </div>
      </div>
    </footer>
  );
};