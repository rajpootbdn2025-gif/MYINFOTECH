
import React from 'react';
import { ChevronRight, Search, Sparkles } from 'lucide-react';
import { useAuth } from './AuthContext';
import { AdUnit } from './AdUnit';

export const Hero: React.FC = () => {
  const { siteSettings } = useAuth();

  return (
    <div className="bg-orange-50 w-full pb-8 overflow-hidden">
      {/* Dynamic News Ticker */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white py-2 shadow-md relative z-10">
        <div className="max-w-7xl mx-auto flex items-center overflow-hidden">
            <div className="bg-white text-green-700 text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter mr-4 whitespace-nowrap shadow-sm border border-green-800">LATEST</div>
            <div className="animate-marquee whitespace-nowrap inline-block text-sm font-medium">
                <span className="mx-4">{siteSettings.announcement}</span>
            </div>
            {/* Duplicate for seamless effect */}
            <div className="animate-marquee whitespace-nowrap inline-block text-sm font-medium" aria-hidden="true">
                <span className="mx-4">{siteSettings.announcement}</span>
            </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-orange-200 text-orange-600 text-xs font-bold mb-8 shadow-sm animate-bounce">
            <Sparkles size={14} />
            SANDHYA INFOTECH PORTAL
        </div>

        <h1 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tight mb-6 leading-[1.1]">
          <span className="text-orange-600 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
            {siteSettings.heroTitle}
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-12 font-medium">
          {siteSettings.heroSubtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mb-12">
            <a href="#services" className="flex-1 bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                Explore Services <ChevronRight size={20} />
            </a>
            <a href="#status" className="flex-1 bg-white text-blue-900 border-2 border-blue-900 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                Track Application
            </a>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Popular:</span>
            {['Aadhaar', 'PAN 2.0', 'Caste Cert', 'Ration Print', 'Kisan Card'].map(tag => (
                <button key={tag} className="text-xs font-bold bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm">
                    {tag}
                </button>
            ))}
        </div>

        {/* Hero Ad Slot */}
        <div className="w-full max-w-5xl px-4">
            <AdUnit slotId="hero-banner-ad" className="w-full" />
        </div>
      </div>
    </div>
  );
};
