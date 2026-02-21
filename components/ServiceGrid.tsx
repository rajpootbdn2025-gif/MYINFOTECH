
import React, { useState, useMemo } from 'react';
import { ServiceCategory, ServiceItem } from '../constants';
import { X, Search, ArrowRight, Filter, Lock, CreditCard, Wallet, AlertCircle, ExternalLink, Globe, Fingerprint, CreditCard as CardIcon, Globe as GlobeIcon, Landmark, Plane, FileText, ShieldCheck, Zap, Smartphone, Briefcase, Users, Home, Truck, GraduationCap, ReceiptIndianRupee, FilePenLine, FileCheck, FileBadge, UserCheck, Building2, Scale, CarFront, HeartPulse, HardDriveDownload, Banknote, Stamp, Printer, FileType, MapPin, ClipboardCheck, Stethoscope, TrainFront, ShieldPlus, Ticket, UserSearch, Sprout } from 'lucide-react';
import { UniversalForm } from './UniversalForm';
import { useAuth } from './AuthContext';
import { AdUnit } from './AdUnit';

// Helper to render icons based on their "iconName" property if the component is missing
const IconRenderer = ({ name, className }: { name: string; className: string }) => {
  const icons: Record<string, any> = {
    Fingerprint, CreditCard: CardIcon, Globe: GlobeIcon, Landmark, Plane, 
    FileText, ShieldCheck, Zap, Smartphone, Briefcase,
    Users, Home, Truck, GraduationCap, ReceiptIndianRupee,
    FilePenLine, FileCheck, FileBadge, UserCheck, Building2,
    Scale, CarFront, HeartPulse, HardDriveDownload, Banknote,
    Stamp, Printer, FileType, Search, MapPin, ClipboardCheck,
    Stethoscope, TrainFront, ShieldPlus, Ticket, UserSearch, Sprout
  };
  
  const IconComponent = icons[name] || GlobeIcon;
  return <IconComponent className={className} />;
};

interface ServiceGridProps {
    onOpenAuth: () => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<ServiceCategory>(ServiceCategory.G2C);
  const [paymentService, setPaymentService] = useState<ServiceItem | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, updateWallet, services } = useAuth();

  const filteredServices = useMemo(() => {
    return services
        .filter(s => s.category === activeTab)
        .filter(s => 
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
  }, [activeTab, searchQuery, services]);

  const handleServiceClick = (service: ServiceItem) => {
    if (!user) {
        onOpenAuth();
        return;
    }
    
    if (service.isRedirect && service.fee === 0) {
      window.open(service.redirectUrl, '_blank');
      return;
    }

    setPaymentService(service);
  };

  const confirmPaymentAndProceed = () => {
    if (!paymentService) return;
    
    const success = updateWallet(-paymentService.fee);
    if (success) {
        setSelectedServiceId(paymentService.id);
        setPaymentService(null);
    } else {
        alert("Wallet Error: Insufficient balance. Please recharge your wallet via the Admin.");
    }
  };

  const closeModal = () => {
    setSelectedServiceId(null);
  };

  const selectedService = services.find(s => s.id === selectedServiceId);

  return (
    <div id="services" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Official Service Portal</h2>
            <p className="text-lg text-gray-600">
                Access authorized government and business services. All applications are directly linked to official portals.
            </p>
          </div>
          
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
            <input 
                type="text" 
                placeholder="Search for any service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-start border-b border-gray-100 mb-10 overflow-x-auto scrollbar-hide">
            <div className="flex gap-8">
                {[ServiceCategory.G2C, ServiceCategory.B2C, ServiceCategory.PRINT].map(cat => (
                  <button
                      key={cat}
                      onClick={() => setActiveTab(cat)}
                      className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                          activeTab === cat 
                          ? 'border-orange-600 text-orange-600' 
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                  >
                      {cat}
                  </button>
                ))}
            </div>
        </div>

        {/* Grid with Ad Placement */}
        {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service, index) => (
                <React.Fragment key={service.id}>
                    {/* Insert Ad every 8 items */}
                    {index > 0 && index % 8 === 0 && (
                        <div className="col-span-full py-4">
                            <AdUnit slotId="service-grid-ad" />
                        </div>
                    )}
                    <div 
                        onClick={() => handleServiceClick(service)}
                        className="group relative bg-white border border-gray-100 rounded-[2rem] p-8 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-2 ring-1 ring-gray-100 flex flex-col h-full"
                    >
                        <div className="absolute top-6 right-6">
                            {user ? (
                                <div className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm ring-1 ${service.fee === 0 ? 'bg-green-50 text-green-700 ring-green-200' : 'bg-orange-50 text-orange-700 ring-orange-200'}`}>
                                    {service.fee === 0 ? 'FREE (REDIRECT)' : `₹${service.fee}`}
                                </div>
                            ) : (
                                <div className="bg-gray-100 text-gray-400 p-2 rounded-xl">
                                    <Lock size={14} />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-6 group-hover:bg-orange-50 group-hover:scale-110 transition-all duration-500 shadow-inner">
                            {service.icon ? service.icon : <IconRenderer name={service.name.includes('Aadhaar') ? 'Fingerprint' : service.name.includes('PAN') ? 'CreditCard' : 'Globe'} className="w-8 h-8 text-orange-600" />}
                        </div>
                        
                        <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors tracking-tight leading-tight">
                            {service.name}
                        </h3>
                        
                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                            {service.description}
                        </p>

                        <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-gray-400 group-hover:text-orange-600 transition-colors uppercase tracking-widest">
                            {user ? (
                              service.fee === 0 ? <><Globe size={14} /> Open Official Portal</> : <><CreditCard size={14} /> Apply via Portal</>
                            ) : 'Login Required'} 
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </React.Fragment>
            ))}
            </div>
        ) : (
            <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-sm mb-4">
                    <Filter className="text-gray-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">No services match your query</h3>
                <p className="text-gray-500 mt-2">Try different keywords or filters.</p>
                <button onClick={() => setSearchQuery('')} className="mt-6 text-orange-600 font-bold hover:underline">Clear Filters</button>
            </div>
        )}
      </div>

      {/* Payment Confirmation Modal */}
      {paymentService && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setPaymentService(null)} />
              <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-10 text-center">
                      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-900 mx-auto mb-8 shadow-inner">
                          <CreditCard size={40} />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">Portal Payment</h3>
                      <p className="text-gray-500 text-sm mb-8 leading-relaxed">You are requesting access to <span className="font-black text-gray-900">"{paymentService.name}"</span>.</p>
                      
                      <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
                          <div className="flex justify-between items-center mb-4">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Fee</span>
                              <span className="text-xl font-black text-blue-900">₹{paymentService.fee}</span>
                          </div>
                          <div className="h-[1px] bg-gray-200 w-full mb-4 opacity-50"></div>
                          <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Wallet</span>
                              <span className={`text-sm font-black ${(user?.walletBalance || 0) < paymentService.fee ? 'text-red-600' : 'text-green-600'}`}>
                                  ₹{user?.walletBalance?.toLocaleString()}
                              </span>
                          </div>
                      </div>

                      <div className="flex flex-col gap-3">
                          <button 
                            disabled={(user?.walletBalance || 0) < paymentService.fee}
                            onClick={confirmPaymentAndProceed}
                            className="w-full bg-blue-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                          >
                              <Wallet size={16} /> Pay & Open Application
                          </button>
                          <button 
                            onClick={() => setPaymentService(null)}
                            className="w-full bg-white text-gray-400 py-3 rounded-2xl font-bold text-xs hover:text-gray-600 transition-all"
                          >
                              Cancel
                          </button>
                      </div>

                      {(user?.walletBalance || 0) < paymentService.fee && (
                          <div className="mt-6 flex items-center gap-2 text-red-600 justify-center">
                              <AlertCircle size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Recharge Required</span>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Application Form Modal */}
      {selectedServiceId && selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
              onClick={closeModal}
            />
            <div className="relative w-full max-w-5xl h-[92vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/20">
                <UniversalForm service={selectedService} onClose={closeModal} />
            </div>
        </div>
      )}
    </div>
  );
};
