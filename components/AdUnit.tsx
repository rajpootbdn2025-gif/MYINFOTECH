
import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';

interface AdUnitProps {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: boolean;
}

export const AdUnit: React.FC<AdUnitProps> = ({ slotId, format = 'auto', className = '', label = true }) => {
  const { siteSettings } = useAuth();

  useEffect(() => {
    if (siteSettings.adsEnabled && typeof window !== 'undefined') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [siteSettings.adsEnabled]);

  if (!siteSettings.adsEnabled) return null;

  return (
    <div className={`no-print ${className}`}>
      {label && (
        <div className="text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center mb-1">
          Advertisement
        </div>
      )}
      <div className="bg-gray-50/50 rounded-xl overflow-hidden min-h-[100px] flex items-center justify-center border border-gray-100">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '100px' }}
          data-ad-client={siteSettings.adClientCode}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
