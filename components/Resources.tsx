
import React, { useState, useMemo } from 'react';
import { DOWNLOAD_LINKS } from '../constants';
import { FileText, Download, Search, CheckCircle, Clock, ShieldCheck, AlertCircle, FileCheck, ExternalLink } from 'lucide-react';
import { useAuth } from './AuthContext';
import { AdUnit } from './AdUnit';

export const Resources: React.FC = () => {
    const [statusId, setStatusId] = useState('');
    const [statusResult, setStatusResult] = useState<string | null>(null);
    const { user, applications } = useAuth();

    const handleCheckStatus = (e: React.FormEvent) => {
        e.preventDefault();
        const found = applications.find(app => app.id === statusId || app.id.includes(statusId));
        if (found) {
            setStatusResult(`Application for ${found.serviceName}: ${found.status.toUpperCase()}`);
        } else if(statusId.length > 5) {
            setStatusResult("No direct record found. Please verify Application ID.");
        } else {
            setStatusResult(null);
        }
    };

    const myApplications = useMemo(() => {
        if (!user) return [];
        return applications.filter(app => app.agentId === user.id);
    }, [user, applications]);

    return (
        <div className="bg-slate-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Agent Portal Section: Only visible when logged in */}
                {user && user.role === 'agent' && (
                    <div className="mb-20 animate-in slide-in-from-top-10 duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Agent Dashboard</h2>
                                <p className="text-gray-500 font-medium">History of your service applications and downloads.</p>
                            </div>
                            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                    <FileCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Submissions</p>
                                    <p className="text-xl font-black text-gray-900">{myApplications.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myApplications.length === 0 ? (
                                <div className="col-span-full py-16 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                    <FileText className="mx-auto text-gray-200 mb-4" size={48} />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No applications submitted yet</p>
                                    <a href="#services" className="mt-4 inline-block text-orange-600 font-black text-xs uppercase tracking-widest hover:underline">Apply for your first service &rarr;</a>
                                </div>
                            ) : (
                                <>
                                    {myApplications.map((app, index) => (
                                        <div key={app.id} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                                                    <FileText size={24} className="text-gray-400 group-hover:text-blue-600" />
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                                    app.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                                    app.status === 'approved' ? 'bg-blue-50 text-blue-600' :
                                                    app.status === 'completed' ? 'bg-green-50 text-green-600' :
                                                    'bg-red-50 text-red-600'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            
                                            <h4 className="text-lg font-black text-gray-900 mb-1 leading-tight">{app.serviceName}</h4>
                                            <p className="text-[10px] font-mono text-gray-400 mb-6">{app.id}</p>

                                            <div className="h-[1px] bg-gray-100 w-full mb-6"></div>

                                            {app.status === 'completed' && app.certificateUrl ? (
                                                <a 
                                                    href={app.certificateUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-full bg-blue-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-blue-800 shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                                                >
                                                    <Download size={14} /> Download Certificate
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 italic px-2">
                                                    <Clock size={12} /> 
                                                    {app.status === 'rejected' ? 'Application Rejected' : 'Processing in Backend'}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {/* Ad card in agent dashboard */}
                                    <div className="bg-white rounded-[2rem] p-8 border-2 border-dashed border-gray-100 flex items-center justify-center">
                                        <AdUnit slotId="agent-dash-ad" format="rectangle" label={false} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Status Section */}
                    <div id="status" className="bg-white rounded-[2.5rem] shadow-lg p-10 md:p-12 border border-slate-100 relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>

                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="p-4 bg-blue-100 rounded-2xl text-blue-600 shadow-inner">
                                <Search size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Public Tracker</h3>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Real-time status monitor</p>
                            </div>
                        </div>
                        <p className="text-gray-500 mb-8 font-medium leading-relaxed">Enter your Application ID or Reference Number provided on your acknowledgement slip to track progress.</p>
                        
                        <form onSubmit={handleCheckStatus} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reference App ID</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={statusId}
                                        onChange={(e) => setStatusId(e.target.value)}
                                        placeholder="e.g., PAN-2024-912384"
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-900 outline-none transition-all font-bold text-sm"
                                    />
                                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]">
                                Check Application Status
                            </button>
                        </form>

                        {statusResult && (
                            <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] flex items-start gap-4 animate-in zoom-in-95 duration-300">
                                <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Search Result</p>
                                    <p className="text-sm font-bold text-white leading-relaxed">{statusResult}</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-8">
                            <AdUnit slotId="status-bottom-ad" />
                        </div>
                    </div>

                    {/* Downloads Section */}
                    <div id="downloads" className="bg-white rounded-[2.5rem] shadow-lg p-10 md:p-12 border border-slate-100">
                         <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-orange-100 rounded-2xl text-orange-600 shadow-inner">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Form Center</h3>
                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-1">Official Document Library</p>
                            </div>
                        </div>
                         <p className="text-gray-500 mb-8 font-medium leading-relaxed">Access official PDF forms and formats required for manual applications and supporting documents.</p>

                         <div className="space-y-4">
                            {DOWNLOAD_LINKS.map((link, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 hover:bg-orange-50 border border-gray-100 transition-all group cursor-pointer hover:border-orange-200">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                            <span className="text-[9px] font-black text-red-500 uppercase">PDF</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-800 text-sm leading-none mb-1">{link.title}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{link.size}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-300 group-hover:text-orange-600 p-2 transition-colors">
                                        <Download size={20} />
                                    </button>
                                </div>
                            ))}
                         </div>
                         <div className="mt-8">
                            <AdUnit slotId="form-center-ad" format="fluid" />
                         </div>
                         <div className="mt-10 text-center">
                            <button className="text-xs font-black text-orange-600 uppercase tracking-widest hover:underline flex items-center justify-center gap-2 mx-auto group">
                                Browse Entire Library <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
