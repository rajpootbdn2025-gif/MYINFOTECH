
import React, { useState, useEffect } from 'react';
import { Printer, ShieldCheck, FileText, User, Users, ArrowRight, Wallet, CheckCircle, Smartphone, Download, Check, ShieldAlert, Upload, X, Phone, Mail, UserPlus, Trash2, Edit3, QrCode, Sparkles, Loader2, ScanLine, Landmark, ChevronRight, Sprout } from 'lucide-react';
import { ServiceItem, UploadType, FormField } from '../constants';
import { useAuth } from './AuthContext';
import { GoogleGenAI } from '@google/genai';

interface Member {
  id: string;
  name: string;
  nameHindi?: string;
  dob: string;
  gender: string;
  memberId: string;
  relation: string;
  uid: string;
}

interface UniversalFormProps {
  service: ServiceItem;
  onClose: () => void;
}

export const UniversalForm: React.FC<UniversalFormProps> = ({ service, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [translatingFields, setTranslatingFields] = useState<Record<string, boolean>>({});
  const [uploads, setUploads] = useState<Record<string, File | null>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signPreview, setSignPreview] = useState<string | null>(null);
  const [appId, setAppId] = useState('');
  const [appDate, setAppDate] = useState('');
  const [txnId, setTxnId] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [isLiveEditing, setIsLiveEditing] = useState(false);
  const { user, addApplication } = useAuth();

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const transliterateToHindi = async (fieldId: string, text: string, isMember: boolean = false, memberId?: string) => {
    if (!text.trim()) return;
    
    const key = isMember ? `member_${memberId}` : fieldId;
    setTranslatingFields(prev => ({ ...prev, [key]: true }));

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Transliterate the following Indian name or address from English to Hindi script. Only return the Hindi script string, nothing else: "${text}"`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      
      const hindiText = response.text?.trim() || '';
      
      if (isMember && memberId) {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, nameHindi: hindiText } : m));
      } else {
        setFormData(prev => ({ ...prev, [`${fieldId}_hindi`]: hindiText }));
      }
    } catch (error) {
      console.error("Transliteration Error:", error);
    } finally {
      setTranslatingFields(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleInputChange = (id: string, value: string, field?: FormField) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleBlur = (field: FormField) => {
    if (field.translateToHindi && formData[field.id]) {
      transliterateToHindi(field.id, formData[field.id]);
    }
  };

  const addMember = () => {
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      nameHindi: '',
      dob: '',
      gender: 'Male',
      memberId: formData.rationNumber ? `${formData.rationNumber}${Math.floor(10 + Math.random() * 89)}` : '',
      relation: '',
      uid: 'Yes'
    };
    setMembers(prev => [...prev, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const updateMember = (id: string, field: keyof Member, value: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleMemberBlur = (member: Member) => {
    if (member.name && !member.nameHindi) {
        transliterateToHindi('name', member.name, true, member.id);
    }
  };

  const handleFileUpload = (type: UploadType, file: File | null) => {
    setUploads(prev => ({ ...prev, [type]: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          if (type === 'Photo') setPhotoPreview(reader.result as string);
          if (type === 'Signature') setSignPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        if (type === 'Photo') setPhotoPreview(null);
        if (type === 'Signature') setSignPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (service.requiredUploads) {
      const missing = service.requiredUploads.filter(u => !uploads[u]);
      if (missing.length > 0) {
        alert(`Required Documents Missing: ${missing.join(', ')}`);
        return;
      }
    }

    setLoading(true);
    
    // Simulate data fetching for Advance Print
    if (service.id === 'kishan-card-advance') {
        setTimeout(() => {
            setFormData(prev => ({
                ...prev,
                fullName: 'RAMESH KUMAR',
                fullName_hindi: 'रमेश कुमार',
                guardianName: 'SHANTI LAL',
                guardianName_hindi: 'शांति लाल',
                dob: '1985-05-15',
                kisanId: 'PMK-' + Math.floor(10000000 + Math.random() * 90000000),
                address: 'VILLAGE - RAMPUR, POST - KALYANPUR, DISTRICT - LUCKNOW, UP - 226001',
                address_hindi: 'ग्राम - रामपुर, पोस्ट - कल्याणपुर, जिला - लखनऊ, उत्तर प्रदेश - 226001'
            }));
            
            const prefix = service.name.substring(0, 2).toUpperCase();
            const randomId = `${prefix}-${new Date().getFullYear()}-${Math.floor(1000000 + Math.random() * 9000000)}`;
            setAppId(randomId);
            setAppDate(new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }));
            setTxnId(`TXN${Math.floor(Math.random() * 1000000000)}`);
            
            addApplication({
                serviceId: service.id,
                serviceName: service.name,
                agentId: user.id,
                agentName: user.name,
                formData: {
                  ...formData,
                  ...Object.keys(uploads).reduce((acc, key) => ({ ...acc, [key]: 'FILE_UPLOADED' }), {})
                },
                fee: service.fee
            });

            setStep('success');
            setLoading(false);
        }, 3000);
        return;
    }

    setTimeout(() => {
        const prefix = service.name.substring(0, 2).toUpperCase();
        const randomId = `${prefix}-${new Date().getFullYear()}-${Math.floor(1000000 + Math.random() * 9000000)}`;
        setAppId(randomId);
        setAppDate(new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }));
        setTxnId(`TXN${Math.floor(Math.random() * 1000000000)}`);
        
        const membersListString = members.map(m => `${m.name}|${m.nameHindi || ''}|${m.memberId}|${m.relation}|${m.uid}|${m.gender}`).join('\n');

        addApplication({
            serviceId: service.id,
            serviceName: service.name,
            agentId: user.id,
            agentName: user.name,
            formData: {
              ...formData,
              membersList: membersListString,
              ...Object.keys(uploads).reduce((acc, key) => ({ ...acc, [key]: 'FILE_UPLOADED' }), {})
            },
            fee: service.fee
        });

        setStep('success');
        setLoading(false);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (step === 'success') {
    const isRationPrint = service.id === 'ration-print';
    const isFarmerPrint = service.id === 'farmer-print' || service.id === 'kishan-card-print' || service.id === 'kishan-card-advance';
    const isPan2Print = service.id === 'pan-2-print';

    return (
      <div className="bg-slate-200 w-full h-full overflow-y-auto p-4 md:p-12">
        <div className="max-w-5xl mx-auto pb-20">
            
            <div className="mb-8 flex flex-col sm:flex-row justify-center gap-5 print:hidden">
                <button onClick={handlePrint} className="flex-1 bg-blue-900 text-white px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-blue-800 transition shadow-2xl active:scale-95">
                    <Printer size={20} /> Print Document
                </button>
                <button onClick={() => setIsLiveEditing(!isLiveEditing)} className={`flex-1 px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition shadow-xl active:scale-95 ${isLiveEditing ? 'bg-orange-600 text-white' : 'bg-white text-gray-900 border-2 border-gray-200'}`}>
                    <Edit3 size={20} /> {isLiveEditing ? 'Finish Editing' : 'Live Edit Preview'}
                </button>
                <button onClick={onClose} className="flex-1 px-10 py-6 bg-white border-2 border-gray-200 rounded-[2rem] font-black uppercase tracking-widest text-xs text-gray-400 hover:bg-gray-50 transition flex items-center justify-center gap-2 active:scale-95">
                    <Check size={18} /> Done
                </button>
            </div>

            <div id="print-area" className="print:m-0 flex flex-col items-center">
              {isPan2Print ? (
                /* --- MODERN PAN CARD 2.0 TEMPLATE --- */
                <div className="flex flex-col md:flex-row gap-12 items-start justify-center print:flex-row print:gap-14 print:mt-20">
                  <div className="w-[450px] h-[285px] bg-[#f8faff] border border-gray-300 shadow-2xl overflow-hidden relative flex flex-col shrink-0 rounded-2xl">
                    <div className="h-14 bg-gradient-to-r from-blue-900 to-blue-800 flex items-center justify-between px-6 text-white">
                       <div className="flex items-center gap-3">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Seal_of_Uttar_Pradesh.svg" className="h-10 invert brightness-0" alt="seal" />
                          <div className="flex flex-col"><p className="text-[11px] font-black uppercase leading-none">Income Tax Dept</p></div>
                       </div>
                       <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">PAN Card 2.0</p>
                    </div>
                    <div className="p-6 flex-1 flex flex-col relative">
                       <div className="flex gap-6">
                          <div className="space-y-4">
                             <div className="w-24 h-28 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                                {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <div className="text-[8px] text-gray-300 font-black">Photo</div>}
                             </div>
                             <div className="w-24 h-8 bg-blue-50/50 border border-blue-100 rounded-md overflow-hidden flex items-center justify-center">
                                {signPreview ? <img src={signPreview} className="w-full h-full object-contain px-1" /> : <div className="text-[7px] text-gray-300 font-black">Sign</div>}
                             </div>
                          </div>
                          <div className="flex-1 space-y-3.5 text-left uppercase">
                             <div><span className="text-[8px] font-black text-blue-900/40 block">Name / नाम:</span>
                                <p className="text-[13px] font-black text-gray-900">{formData.fullName_hindi && <span className="block text-blue-800">{formData.fullName_hindi}</span>}{formData.fullName}</p>
                             </div>
                             <div><span className="text-[8px] font-black text-blue-900/40 block">Father's Name:</span>
                                <p className="text-[13px] font-black text-gray-900">{formData.guardianName_hindi && <span className="block text-blue-800">{formData.guardianName_hindi}</span>}{formData.guardianName}</p>
                             </div>
                             <div className="flex justify-between border-t pt-2">
                                <div><span className="text-[8px] font-black text-blue-900/40 block">DOB:</span><p className="text-[11px] font-black text-gray-900">{formData.dob}</p></div>
                                <div className="text-right"><span className="text-[8px] font-black text-blue-900/40 block">Gender:</span><p className="text-[11px] font-black text-gray-900">MALE</p></div>
                             </div>
                          </div>
                       </div>
                       <div className="mt-auto flex items-end justify-between pt-3">
                          <div className="flex flex-col"><span className="text-[9px] font-black text-blue-900/40 block">PAN</span><p className="text-[26px] font-black text-blue-900 tracking-[0.15em] leading-none">{formData.panNumber}</p></div>
                          <div className="w-14 h-14 bg-white border border-gray-200 p-1 rounded-xl shadow-sm"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=PAN:${formData.panNumber}`} className="w-full opacity-90" /></div>
                       </div>
                    </div>
                  </div>
                </div>
              ) : isRationPrint ? (
                /* --- ULTRA HD RATION CARD TEMPLATE --- */
                <div className="flex flex-col gap-12 items-center print:mt-10">
                  <div className="flex flex-col md:flex-row gap-10 print:flex-row print:justify-center">
                    {/* FRONT SIDE */}
                    <div className={`w-[480px] h-[310px] bg-white border border-gray-300 shadow-2xl relative flex flex-col shrink-0 overflow-hidden rounded-lg`}>
                      {/* Security Pattern Background */}
                      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 10px)' }}></div>
                      
                      {/* Watermark Logo */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Seal_of_Uttar_Pradesh.svg" className="w-60" alt="watermark" />
                      </div>
                      
                      {/* Header - DYNAMIC COLOR BASED ON SCHEME */}
                      <div className={`h-16 ${formData.schemeName === 'AAY' ? 'bg-[#d946ef]' : 'bg-[#9c8471]'} flex items-center justify-between px-4 border-b-2 border-gray-500 relative z-10 transition-colors`}>
                        <div className="flex items-center gap-3">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Seal_of_Uttar_Pradesh.svg" className="h-12" alt="seal" />
                          <div className="flex flex-col">
                            <p className="text-[12px] font-black text-white leading-none">Food and Civil Supplies Department</p>
                            <p className="text-[10px] font-bold text-white/80 uppercase tracking-tighter">Government of Uttar Pradesh</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] font-black text-white leading-none">डिजिटल राशन कार्ड</p>
                            <p className="text-[7px] font-bold text-white/70 uppercase tracking-widest mt-0.5">Digital Ration Card</p>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col relative z-10">
                        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                           <div>
                             <h4 className="text-maroon-900 font-black text-xl uppercase tracking-tighter">Ration Card</h4>
                             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Digital Acknowledgement Slip</p>
                           </div>
                           <div className="text-right">
                             <p className="text-[9px] font-black text-gray-500 uppercase">Scheme / प्रकार</p>
                             <p className={`text-[14px] font-black ${formData.schemeName === 'AAY' ? 'text-pink-600' : 'text-red-800'}`}>{formData.schemeName || 'PHH'}</p>
                           </div>
                        </div>

                        <div className="flex gap-6">
                           <div className="w-28 h-32 border-2 border-gray-200 bg-white p-1 rounded shadow-sm flex items-center justify-center overflow-hidden">
                              {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <div className="text-[10px] text-gray-200 font-black">PHOTO</div>}
                           </div>
                           <div className="flex-1 space-y-2.5">
                              <div className="flex flex-col">
                                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Head of Family / परिवार का मुखिया:</span>
                                 <p className="text-[14px] font-black text-gray-900 leading-tight uppercase">
                                   {formData.headOfFamily_hindi && <span className="block text-blue-900 font-bold mb-0.5">{formData.headOfFamily_hindi}</span>}
                                   {isLiveEditing ? <input className="bg-yellow-50 outline-none w-full" value={formData.headOfFamily} onChange={e => handleInputChange('headOfFamily', e.target.value)} /> : formData.headOfFamily}
                                 </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">FPS Shop No:</span>
                                    <p className="text-[11px] font-black text-gray-700 uppercase">
                                        {isLiveEditing ? <input className="bg-yellow-50 outline-none w-full" value={formData.fpsNo} onChange={e => handleInputChange('fpsNo', e.target.value)} /> : (formData.fpsNo || '---')}
                                    </p>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Units / यूनिट:</span>
                                    <p className="text-[11px] font-black text-gray-700">{members.length || 1}</p>
                                </div>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Address / पता:</span>
                                 <p className="text-[10px] font-bold text-gray-600 leading-snug uppercase">
                                   {formData.address_hindi && <span className="block text-blue-900 font-bold">{formData.address_hindi}</span>}
                                   {isLiveEditing ? <textarea className="bg-yellow-50 outline-none w-full h-10" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} /> : formData.address}
                                 </p>
                              </div>
                           </div>
                        </div>

                        <div className="mt-auto flex items-end justify-between pt-3 border-t border-gray-200">
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-blue-900/40 uppercase tracking-widest leading-none mb-1">Ration Card No. / राशन कार्ड संख्या</span>
                              <p className="text-2xl font-black text-blue-900 tracking-[0.15em] leading-none">
                                {isLiveEditing ? <input className="bg-yellow-50 outline-none w-48 text-2xl" value={formData.rationNumber} onChange={e => handleInputChange('rationNumber', e.target.value)} /> : formData.rationNumber}
                              </p>
                           </div>
                           <div className="flex flex-col items-center">
                                <div className="w-14 h-14 bg-white border border-gray-200 p-1 flex items-center justify-center rounded-lg shadow-sm">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=RATION:${formData.rationNumber}|NAME:${formData.headOfFamily}`} className="w-full opacity-80" />
                                </div>
                                <span className="text-[6px] font-bold text-gray-400 mt-1">Verification QR</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* BACK SIDE (MEMBER LIST) */}
                    <div className="w-[480px] h-[310px] bg-white border border-gray-300 shadow-2xl relative flex flex-col shrink-0 overflow-hidden rounded-lg">
                      <div className={`h-16 ${formData.schemeName === 'AAY' ? 'bg-[#d946ef]' : 'bg-[#9c8471]'} flex items-center justify-center border-b-2 border-gray-500 relative z-10 px-6 transition-colors`}>
                        <p className="text-[14px] font-black text-white uppercase tracking-tight">Family Members Detail / परिवार के सदस्यों का विवरण</p>
                      </div>
                      
                      <div className="p-4 flex-1 overflow-hidden relative z-10">
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-[10px] border-collapse">
                            <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase">
                                <tr>
                                <th className="px-3 py-2 border-r border-gray-200">S.N</th>
                                <th className="px-3 py-2 border-r border-gray-200">Member Name</th>
                                <th className="px-3 py-2 border-r border-gray-200">Gender</th>
                                <th className="px-3 py-2 border-r border-gray-200">Relation</th>
                                <th className="px-3 py-2">UID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {members.length > 0 ? members.map((m, idx) => (
                                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-3 py-2 font-bold text-gray-400 border-r border-gray-100">{idx+1}</td>
                                    <td className="px-3 py-2 border-r border-gray-100">
                                        <p className="font-black text-gray-800 leading-none mb-0.5">{m.name}</p>
                                        <p className="text-[8px] font-black text-blue-700 leading-none">{m.nameHindi}</p>
                                    </td>
                                    <td className="px-3 py-2 font-bold text-gray-500 border-r border-gray-100 uppercase">{m.gender}</td>
                                    <td className="px-3 py-2 font-black text-gray-400 uppercase border-r border-gray-100">{m.relation}</td>
                                    <td className="px-3 py-2 font-black text-green-600">{m.uid === 'Yes' ? 'Verified' : m.uid}</td>
                                </tr>
                                )) : (
                                <tr><td colSpan={5} className="py-20 text-center text-gray-300 font-black uppercase tracking-widest opacity-30 italic">No Members Recorded</td></tr>
                                )}
                            </tbody>
                            </table>
                        </div>
                      </div>

                      <div className="h-10 bg-gray-100 flex items-center justify-between px-8 border-t border-gray-300 mt-auto">
                        <div className="flex items-center gap-2 text-[8px] font-black text-gray-400">
                            <span className="bg-gray-200 px-1.5 py-0.5 rounded">HELPLINE</span> 1800-1800-150
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] font-mono leading-none">UP-FCS-PORTAL-GEN</p>
                            <p className="text-[6px] font-bold text-gray-300 uppercase mt-0.5">Authorized Sandhya Infotech Print</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isFarmerPrint ? (
                /* --- KISAN CARD TEMPLATE (TWO SIDED) --- */
                <div className="flex flex-col gap-12 items-center print:mt-10">
                  <div className="flex flex-col md:flex-row gap-10 print:flex-row print:justify-center">
                    {/* FRONT SIDE */}
                    <div className="w-[480px] h-[310px] bg-white border border-gray-300 shadow-2xl relative flex flex-col shrink-0 overflow-hidden rounded-2xl">
                      {/* Decorative Header */}
                      <div className="h-20 bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 flex items-center justify-between px-6 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center ring-1 ring-white/30">
                            <Sprout className="text-white w-7 h-7" />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-[13px] font-black text-white leading-none uppercase tracking-tight">Department of Agriculture</p>
                            <p className="text-[9px] font-bold text-green-100 uppercase tracking-widest mt-0.5">Government of India</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-black text-white leading-none">किसान पहचान पत्र</p>
                          <p className="text-[8px] font-bold text-white/70 uppercase tracking-widest">Farmer Identity Card</p>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-6 flex-1 flex flex-col relative z-10">
                        <div className="flex gap-6">
                          <div className="space-y-3">
                            <div className="w-28 h-32 bg-white border-2 border-green-100 rounded-xl overflow-hidden shadow-md flex items-center justify-center">
                              {photoPreview ? (
                                <img src={photoPreview} className="w-full h-full object-cover" />
                              ) : (
                                <User className="text-gray-200 w-16 h-16" />
                              )}
                            </div>
                            <div className="w-28 h-8 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center">
                               <p className="text-[8px] font-black text-green-700 uppercase">Verified Farmer</p>
                            </div>
                          </div>

                          <div className="flex-1 space-y-3 text-left">
                            <div className="space-y-0.5">
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Farmer Name / किसान का नाम</span>
                              <p className="text-[14px] font-black text-gray-900 uppercase">
                                {formData.fullName_hindi && <span className="block text-emerald-700 font-bold">{formData.fullName_hindi}</span>}
                                {formData.fullName || '---'}
                              </p>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Father's Name / पिता का नाम</span>
                              <p className="text-[13px] font-black text-gray-800 uppercase">
                                {formData.guardianName_hindi && <span className="block text-emerald-700 font-bold">{formData.guardianName_hindi}</span>}
                                {formData.guardianName || '---'}
                              </p>
                            </div>
                            <div className="flex justify-between border-t border-gray-100 pt-2">
                              <div>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">DOB / जन्म तिथि</span>
                                <p className="text-[11px] font-black text-gray-900">{formData.dob || '---'}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Gender / लिंग</span>
                                <p className="text-[11px] font-black text-gray-900">MALE</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto flex items-end justify-between pt-4">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-emerald-900/40 uppercase tracking-widest leading-none mb-1">Kisan ID / किसान आईडी</span>
                            <p className="text-2xl font-black text-emerald-900 tracking-[0.1em] leading-none">{formData.kisanId || 'PMK-92837461'}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=KISAN:${formData.kisanId}|NAME:${formData.fullName}|UID:${formData.aadhaarNumber}`} className="w-full opacity-90" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Strip */}
                      <div className="h-2 bg-emerald-700"></div>
                    </div>

                    {/* BACK SIDE */}
                    <div className="w-[480px] h-[310px] bg-slate-50 border border-gray-300 shadow-2xl relative flex flex-col shrink-0 overflow-hidden rounded-2xl">
                       <div className="h-14 bg-emerald-800 flex items-center justify-center px-6">
                          <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Terms & Conditions / नियम एवं शर्तें</p>
                       </div>
                       
                       <div className="p-6 flex-1 flex flex-col">
                          <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1 shrink-0"></div>
                              <p className="text-[9px] font-bold text-gray-600 leading-tight">This card is issued for the identification of farmers registered under government schemes.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1 shrink-0"></div>
                              <p className="text-[9px] font-bold text-gray-600 leading-tight">यह कार्ड सरकारी योजनाओं के तहत पंजीकृत किसानों की पहचान के लिए जारी किया गया है।</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1 shrink-0"></div>
                              <p className="text-[9px] font-bold text-gray-600 leading-tight">Always carry this card while visiting the Agriculture Department or Bank.</p>
                            </div>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Address / पता</span>
                            <p className="text-[10px] font-bold text-gray-700 leading-relaxed uppercase">
                              {formData.address_hindi && <span className="block text-emerald-800 font-bold mb-0.5">{formData.address_hindi}</span>}
                              {formData.address || 'VILLAGE POST TEHSIL DISTRICT STATE - 000000'}
                            </p>
                          </div>

                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex flex-col">
                               <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Aadhaar Number</span>
                               <p className="text-[12px] font-black text-gray-900">XXXX-XXXX-{formData.aadhaarNumber?.slice(-4) || '0000'}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest font-mono">SANDHYA-INFOTECH-VERIFIED</p>
                               <p className="text-[7px] font-bold text-gray-300 uppercase">Authorized Digital Print</p>
                            </div>
                          </div>
                       </div>
                       
                       {/* Barcode Strip */}
                       <div className="h-10 bg-white border-t border-gray-200 flex items-center justify-center px-10">
                          <div className="w-full h-6 bg-[url('https://www.scandit.com/wp-content/themes/scandit/assets/img/barcode-hero.png')] bg-repeat-x bg-contain opacity-20"></div>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                 /* ACKNOWLEDGEMENT RECEIPT */
                 <div className="bg-white p-12 shadow-2xl rounded-[3rem] border border-gray-100 mx-auto max-w-4xl text-left">
                    <div className="flex items-center gap-6 border-b-2 border-blue-900 pb-8 mb-10">
                       <div className="w-16 h-16 bg-blue-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl">S</div>
                       <div>
                          <h1 className="text-3xl font-black text-gray-900">Sandhya Infotech</h1>
                          <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Acknowledgment Receipt</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-12 text-left">
                       <div className="space-y-6">
                          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">App ID: <span className="text-gray-900 ml-2">{appId}</span></p>
                          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Service: <span className="text-blue-900 ml-2">{service.name}</span></p>
                       </div>
                       <div className="space-y-6 text-right">
                          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Date: <span className="text-gray-900 ml-2">{appDate}</span></p>
                          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Fee: <span className="text-green-600 ml-2">₹{service.fee}.00</span></p>
                       </div>
                    </div>
                 </div>
              )}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 w-full h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white min-h-full shadow-2xl flex flex-col">
            <div className="bg-blue-900 text-white px-10 py-12 sticky top-0 z-10 shadow-lg flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md ring-1 ring-white/20 shadow-inner">
                        {service.id === 'pan-2-print' ? <ScanLine className="w-8 h-8" /> : (service.icon || <FileText className="w-8 h-8"/>)}
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter leading-none">{service.name}</h2>
                        <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mt-2">Authorized Application Portal</p>
                    </div>
                </div>
                <div className="bg-white/10 px-8 py-4 rounded-2xl backdrop-blur-md border border-white/20 text-right shadow-sm">
                    <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mb-1">Service Fee</p>
                    <p className="text-2xl font-black">₹{service.fee}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-16 flex-1 text-left">
                {service.formFields && (
                  <section>
                      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                        <FileText size={18} /> Basic Information <div className="flex-1 h-[1px] bg-gray-100"></div>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          {service.formFields.map((field) => (
                              <div key={field.id} className={`${field.type === 'textarea' ? 'md:col-span-2' : ''} space-y-3`}>
                                  <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{field.label} {field.required && '*'}</label>
                                    {field.translateToHindi && (
                                        <div className="flex items-center gap-1.5 text-[8px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-md ring-1 ring-orange-100 animate-pulse">
                                            <Sparkles size={10} /> Auto-Translating...
                                        </div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-2">
                                    {field.type === 'select' ? (
                                      <select
                                          required={field.required}
                                          value={formData[field.id] || ''}
                                          onChange={(e) => handleInputChange(field.id, e.target.value, field)}
                                          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 transition-all cursor-pointer shadow-sm hover:bg-gray-100"
                                      >
                                          <option value="">-- Choose Option --</option>
                                          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                      </select>
                                    ) : field.type === 'textarea' ? (
                                      <textarea
                                        required={field.required}
                                        value={formData[field.id] || ''}
                                        placeholder={field.placeholder || `Enter ${field.label}`}
                                        onChange={(e) => handleInputChange(field.id, e.target.value, field)}
                                        onBlur={() => handleBlur(field)}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 transition-all shadow-sm h-32 resize-none"
                                      />
                                    ) : (
                                      <input
                                          required={field.required}
                                          type={field.type}
                                          value={formData[field.id] || ''}
                                          placeholder={field.placeholder || `Enter ${field.label}`}
                                          onChange={(e) => handleInputChange(field.id, e.target.value, field)}
                                          onBlur={() => handleBlur(field)}
                                          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 transition-all shadow-sm focus:bg-white"
                                      />
                                    )}

                                    {field.translateToHindi && formData[`${field.id}_hindi`] && (
                                        <div className="flex items-center gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-50 animate-in slide-in-from-left-2 shadow-sm">
                                            <span className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest shrink-0">Hindi:</span>
                                            <input 
                                                className="bg-transparent border-none outline-none font-bold text-blue-900 text-sm w-full" 
                                                value={formData[`${field.id}_hindi`]} 
                                                onChange={(e) => handleInputChange(`${field.id}_hindi`, e.target.value)}
                                            />
                                        </div>
                                    )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </section>
                )}

                {/* Member Unit Section for Ration Card */}
                {(service.id === 'ration-print' || service.id === 'ration-new') && (
                  <section>
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-4">
                        <Users size={18} /> Family Member Details <div className="hidden sm:block w-40 h-[1px] bg-gray-100"></div>
                      </h3>
                      <button 
                        type="button" 
                        onClick={addMember}
                        className="bg-orange-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-orange-700 active:scale-95 transition-all"
                      >
                        <UserPlus size={14} /> Add New Member Unit
                      </button>
                    </div>

                    <div className="space-y-6">
                      {members.length === 0 && (
                        <div className="py-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center">
                          <Users size={32} className="text-gray-200 mb-3" />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No family members listed yet</p>
                        </div>
                      )}
                      {members.map((m, idx) => (
                        <div key={m.id} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative animate-in slide-in-from-top-4 hover:border-blue-200 transition-colors group">
                          <div className="flex justify-between items-start mb-6">
                            <span className="bg-blue-50 text-blue-600 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-blue-100">Unit #{idx + 1}</span>
                            <button type="button" onClick={() => removeMember(m.id)} className="text-red-200 hover:text-red-600 transition-all p-2 bg-red-50/0 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Name (English)</label>
                                <input required type="text" value={m.name} onChange={(e) => updateMember(m.id, 'name', e.target.value)} onBlur={() => handleMemberBlur(m)} placeholder="Enter Member Name" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 shadow-sm" />
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-2">Name (Hindi) {translatingFields[`member_${m.id}`] && <Loader2 size={10} className="animate-spin text-orange-500" />}</label>
                                <input required type="text" value={m.nameHindi || ''} onChange={(e) => updateMember(m.id, 'nameHindi', e.target.value)} placeholder="नाम हिंदी में" className="w-full px-6 py-4 bg-orange-50/20 border border-orange-100 rounded-2xl font-bold text-sm outline-none shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Gender</label>
                                <select required value={m.gender} onChange={(e) => updateMember(m.id, 'gender', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none cursor-pointer shadow-sm">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Date of Birth</label>
                                <input required type="date" value={m.dob} onChange={(e) => updateMember(m.id, 'dob', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Relation with Head</label>
                                <input required type="text" value={m.relation} onChange={(e) => updateMember(m.id, 'relation', e.target.value)} placeholder="HUSBAND / SON" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">UID Reference</label>
                                <input required type="text" value={m.memberId} onChange={(e) => updateMember(m.id, 'memberId', e.target.value)} placeholder="Last 4 Digits" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 shadow-sm" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {service.requiredUploads && (
                  <section>
                      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                        <Upload size={18} /> Required Files <div className="flex-1 h-[1px] bg-gray-100"></div>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.requiredUploads.map(type => (
                          <div key={type} className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] relative group hover:border-blue-500 transition-all h-48 flex items-center justify-center shadow-inner">
                            <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              onChange={(e) => handleFileUpload(type, e.target.files?.[0] || null)}
                              accept="image/*,application/pdf"
                            />
                            <div className="flex flex-col items-center text-center">
                              {uploads[type] ? (
                                <>
                                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm ring-4 ring-green-50 animate-in zoom-in-50">
                                    <CheckCircle size={32} />
                                  </div>
                                  <p className="text-[11px] font-black text-gray-900 uppercase truncate w-full px-4">{uploads[type]?.name}</p>
                                  <button type="button" onClick={() => handleFileUpload(type, null)} className="mt-3 text-[10px] font-black text-red-500 uppercase tracking-widest hover:scale-110 transition-transform">Remove File</button>
                                </>
                              ) : (
                                <>
                                  <div className="w-16 h-16 bg-white text-gray-300 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-100 group-hover:text-blue-500 group-hover:scale-110 transition-all">
                                    <Upload size={32} />
                                  </div>
                                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-900 transition-colors">Upload {type}</p>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                  </section>
                )}

                <div className="pt-10 flex flex-col sm:flex-row gap-5 pb-10">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex-[3] bg-blue-900 text-white font-black uppercase tracking-widest py-7 rounded-[2rem] hover:bg-blue-800 transition shadow-2xl disabled:bg-gray-400 flex items-center justify-center gap-4 text-xs active:scale-[0.98]"
                    >
                        {loading ? 'Processing Document...' : 'Generate High Quality Preview'}
                    </button>
                    <button type="button" onClick={onClose} className="flex-1 bg-white border-2 border-gray-100 text-gray-400 font-black uppercase tracking-widest py-7 rounded-[2rem] text-[10px] hover:bg-gray-50 active:scale-[0.98]">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};
