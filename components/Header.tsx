
import React, { useState } from 'react';
import { Menu, X, Globe, Phone, Download, Activity, LogIn, LogOut, Wallet, User as UserIcon, ShieldAlert, ShieldCheck, Printer, Settings, ChevronDown, Search } from 'lucide-react';
import { useAuth } from './AuthContext';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showCustomerInput, setShowCustomerInput] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const { user, logout, applications } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'SERVICE', href: '#services', icon: <Globe size={18} /> },
    { name: 'PRINT', href: '#services', icon: <Printer size={18} /> },
    { name: 'DOWNLOAD', href: '#downloads', icon: <Download size={18} /> },
    { name: 'STATUS', href: '#status', icon: <Activity size={18} /> },
    { name: 'CONTACT', href: '#contact', icon: <Phone size={18} /> },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  const handleCustomerCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const app = applications.find(a => a.id === customerId);
    if (app) {
      alert(`Application Found!\nService: ${app.serviceName}\nStatus: ${app.status.toUpperCase()}\nDate: ${new Date(app.timestamp).toLocaleDateString()}`);
    } else {
      alert("Application ID not found. Please check and try again.");
    }
    setCustomerId('');
    setShowCustomerInput(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">SANDHYA</span>
              <span className="text-[10px] text-orange-600 font-black tracking-widest uppercase mt-1">Infotech Portal</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex space-x-6 items-center">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="flex items-center gap-2 text-gray-500 hover:text-orange-600 px-2 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition-all"
              >
                {item.name}
              </a>
            ))}
            
            <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

            {/* Customer Section */}
            <div className="relative">
              <button 
                onClick={() => setShowCustomerInput(!showCustomerInput)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all bg-blue-50 border border-blue-100"
              >
                <Search size={14} /> Customer
              </button>
              {showCustomerInput && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-in fade-in slide-in-from-top-2">
                  <form onSubmit={handleCustomerCheck} className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Track Application</p>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter Application ID"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all">Check Status</button>
                  </form>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'agent' && (
                   <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 shadow-sm">
                      <Wallet size={16} className="text-orange-600" />
                      <span className="text-sm font-black text-orange-700">₹{user.walletBalance.toLocaleString()}</span>
                   </div>
                )}
                
                {user.role === 'admin' && (
                  <button 
                    onClick={onOpenAdmin}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition shadow-lg shadow-blue-900/20 active:scale-95"
                  >
                    <ShieldAlert size={14} className="animate-pulse" /> Admin Panel
                  </button>
                )}

                <div className="flex items-center gap-3 px-2 border-l border-gray-100 pl-4">
                   <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 border border-gray-200">
                      {user.role === 'admin' ? <ShieldCheck size={18} className="text-blue-900" /> : <UserIcon size={18} />}
                   </div>
                   <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-gray-900 leading-none">{user.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{user.agentId}</span>
                   </div>
                </div>

                <button 
                  onClick={logout}
                  className="p-2 text-gray-300 hover:text-red-500 transition-all hover:scale-110"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={onOpenAuth}
                  className="bg-blue-900 text-white px-6 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-xl shadow-blue-900/20 flex items-center gap-2"
                >
                  <Settings size={16} /> Admin Login
                </button>
                <button 
                  onClick={onOpenAuth}
                  className="bg-orange-600 text-white px-6 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition shadow-xl shadow-orange-600/20 flex items-center gap-2"
                >
                  <LogIn size={18} /> Agent Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 bg-gray-50 rounded-xl"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-2xl animate-in slide-in-from-top-5">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {user && (
              <div className="px-4 py-5 mb-4 border-b border-gray-100 bg-slate-50 rounded-3xl flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm">
                   {user.role === 'admin' ? <ShieldCheck size={24} className="text-blue-900" /> : <UserIcon size={24} />}
                 </div>
                 <div>
                    <p className="text-sm font-black text-gray-900">{user.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.role === 'admin' ? 'Master Admin' : 'Portal Agent'}</p>
                 </div>
                 {user.role === 'agent' && (
                    <div className="ml-auto bg-white px-4 py-2 rounded-xl shadow-sm text-center">
                      <p className="text-[8px] font-black text-gray-300 uppercase">Wallet</p>
                      <p className="text-sm font-black text-orange-600">₹{user.walletBalance}</p>
                    </div>
                 )}
              </div>
            )}
            
            {user?.role === 'admin' && (
              <button 
                onClick={() => { onOpenAdmin(); setIsOpen(false); }}
                className="w-full text-left flex items-center gap-4 text-blue-900 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest bg-blue-50 transition-all border border-blue-100"
              >
                <div className="p-2 bg-white rounded-xl"><ShieldAlert size={20} /></div>
                Open Admin Panel
              </button>
            )}

            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-4 text-gray-700 hover:text-orange-600 block px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-orange-50 transition-all"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white">{item.icon}</div>
                {item.name}
              </a>
            ))}

            <div className="px-4 py-4 space-y-4">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3">Customer Tracking</p>
                <form onSubmit={handleCustomerCheck} className="flex gap-2">
                  <input 
                    type="text" 
                    required
                    placeholder="Application ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white border border-blue-200 rounded-xl text-xs font-bold outline-none"
                  />
                  <button type="submit" className="bg-blue-900 text-white p-2 rounded-xl"><Search size={18}/></button>
                </form>
              </div>
            </div>

            {user ? (
               <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full text-left flex items-center gap-4 text-red-600 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-red-50 transition-all"
              >
               <div className="p-2 bg-red-50 rounded-xl"><LogOut size={20} /></div>
               Logout Session
             </button>
            ) : (
              <div className="space-y-2 px-4">
                <button 
                  onClick={() => { setIsOpen(false); onOpenAuth(); }}
                  className="w-full text-left flex items-center gap-4 text-blue-900 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest bg-blue-50 transition-all border border-blue-100"
                >
                  <div className="p-2 bg-white rounded-xl"><ShieldCheck size={20} /></div>
                  Admin Access
                </button>
                <button 
                  onClick={() => { setIsOpen(false); onOpenAuth(); }}
                  className="w-full text-left flex items-center gap-4 text-orange-600 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest bg-orange-50 transition-all border border-orange-100"
                >
                  <div className="p-2 bg-white rounded-xl"><UserIcon size={20} /></div>
                  Agent Access
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
