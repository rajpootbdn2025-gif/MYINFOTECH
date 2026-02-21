
import React, { useState, useRef, useMemo } from 'react';
import { X, Users, Wallet, Check, Ban, DollarSign, Search, UserCheck, FileText, Upload, Download, Eye, Clock, ShieldCheck, AlertCircle, UserPlus, Trash2, Cloud, Copy, RefreshCw, Share2, Plus, Edit2, Globe, Server, Settings, PlusCircle, Layout, Bell, Monitor, Lock, Unlock, Megaphone, DollarSign as RevenueIcon, BarChart3, TrendingUp, Layers, ChevronRight, CloudUpload, CloudDownload, Terminal, Zap, ShieldQuestion } from 'lucide-react';
import { useAuth, AppStatus, SiteSettings } from './AuthContext';
import { ServiceCategory, ServiceItem, FormField } from '../constants';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { 
    allUsers, adminApproveUser, adminRejectUser, adminTransferFunds, 
    applications, adminUpdateApplicationStatus, adminUploadCertificate,
    adminCreateUser, adminDeleteUser, services, adminAddService, adminUpdateService, adminDeleteService,
    siteSettings, adminUpdateSettings, generateSyncLink, importSystemData, exportSystemData
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'applications' | 'services' | 'settings' | 'sync'>('dashboard');
  const [transferUserId, setTransferUserId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [viewingApp, setViewingApp] = useState<any>(null);
  const [importKey, setImportKey] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [localSettings, setLocalSettings] = useState<SiteSettings>(siteSettings);

  // Dynamic Service Form States
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceFee, setNewServiceFee] = useState(0);
  const [newServiceCat, setNewServiceCat] = useState<ServiceCategory>(ServiceCategory.G2C);
  const [newServiceRedirect, setNewServiceRedirect] = useState('');
  const [dynamicFields, setDynamicFields] = useState<FormField[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAppId, setUploadingAppId] = useState<string | null>(null);

  const addField = () => {
    const field: FormField = { id: `f-${Date.now()}`, label: 'New Field', type: 'text', required: true };
    setDynamicFields([...dynamicFields, field]);
  };

  const updateField = (id: string, key: keyof FormField, value: any) => {
    setDynamicFields(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const removeField = (id: string) => {
    setDynamicFields(prev => prev.filter(f => f.id !== id));
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceObj: ServiceItem = {
      id: editingService ? editingService.id : `SVC-${Date.now()}`,
      name: newServiceName,
      description: newServiceDesc,
      fee: newServiceFee,
      category: newServiceCat,
      isRedirect: !!newServiceRedirect,
      redirectUrl: newServiceRedirect,
      formFields: dynamicFields,
      icon: null 
    };

    if (editingService) adminUpdateService(serviceObj);
    else adminAddService(serviceObj);

    setShowServiceForm(false);
    resetForm();
    alert("Website Updated Live!");
  };

  const resetForm = () => {
    setEditingService(null);
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServiceFee(0);
    setNewServiceRedirect('');
    setDynamicFields([]);
  };

  const startEditService = (svc: ServiceItem) => {
    setEditingService(svc);
    setNewServiceName(svc.name);
    setNewServiceDesc(svc.description);
    setNewServiceFee(svc.fee);
    setNewServiceCat(svc.category);
    setNewServiceRedirect(svc.redirectUrl || '');
    setDynamicFields(svc.formFields || []);
    setShowServiceForm(true);
  };

  const activeAgents = allUsers.filter(u => u.role === 'agent' && u.status === 'active');
  const pendingAgents = allUsers.filter(u => u.role === 'agent' && u.status === 'pending');
  const sortedApps = [...applications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const stats = useMemo(() => {
    const totalFees = applications.reduce((sum, app) => sum + app.fee, 0);
    const completedApps = applications.filter(a => a.status === 'completed').length;
    return {
        revenue: totalFees,
        orders: applications.length,
        completed: completedApps,
        agents: activeAgents.length,
        pendingApproval: pendingAgents.length
    };
  }, [applications, activeAgents, pendingAgents]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateSettings(localSettings);
    alert("Site configuration saved!");
  };

  const handleMagicSink = () => {
    if (!importKey.trim()) return;
    setIsSyncing(true);
    setTimeout(() => {
        const success = importSystemData(importKey);
        if (success) {
            setImportKey('');
            alert("✨ MAGIC SINK SUCCESSFUL! System data has been overwritten with new configuration.");
        }
        setIsSyncing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-[95vw] lg:max-w-7xl h-full md:h-[90vh] bg-slate-50 rounded-none md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
        
        <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf,image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && uploadingAppId) {
                adminUploadCertificate(uploadingAppId, URL.createObjectURL(file));
                setUploadingAppId(null);
            }
        }} />

        {/* Sidebar Header Mix */}
        <div className="bg-blue-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md ring-1 ring-white/20">
                    <ShieldCheck size={28} className="text-blue-200" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tight leading-none">Command Center</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Master Admin Connected</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-blue-950/50 p-1.5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide max-w-full">
                {[
                  { id: 'dashboard', label: 'Overview', icon: <BarChart3 size={14}/> },
                  { id: 'agents', label: 'Agents', icon: <Users size={14}/> },
                  { id: 'applications', label: 'Orders', icon: <FileText size={14}/> },
                  { id: 'services', label: 'CMS', icon: <Layers size={14}/> },
                  { id: 'settings', label: 'Site Config', icon: <Settings size={14}/> },
                  { id: 'sync', label: 'Magic Sync', icon: <RefreshCw size={14}/> }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-200 hover:text-white hover:bg-white/5'}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
            </div>

            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all hidden md:block"><X size={28} /></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
            
            {activeTab === 'dashboard' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner"><DollarSign size={28}/></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</p>
                                <p className="text-2xl font-black text-gray-900">₹{stats.revenue.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><FileText size={28}/></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orders</p>
                                <p className="text-2xl font-black text-gray-900">{stats.orders}</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner"><Users size={28}/></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Agents</p>
                                <p className="text-2xl font-black text-gray-900">{stats.agents}</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner"><TrendingUp size={28}/></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completion</p>
                                <p className="text-2xl font-black text-gray-900">{Math.round((stats.completed / (stats.orders || 1)) * 100)}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                             <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Recent Applications</h3>
                                <button onClick={() => setActiveTab('applications')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">View All <ChevronRight size={14}/></button>
                             </div>
                             <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <tr><th className="px-8 py-4">Service</th><th className="px-8 py-4">Agent</th><th className="px-8 py-4 text-right">Status</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {sortedApps.slice(0, 5).map(app => (
                                            <tr key={app.id}>
                                                <td className="px-8 py-5">
                                                    <p className="font-black text-gray-900 text-sm leading-none mb-1">{app.serviceName}</p>
                                                    <p className="text-[10px] font-mono text-gray-300">{app.id}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-xs font-bold text-gray-600">{app.agentName}</p>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{app.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </div>

                        <div className="space-y-8">
                             <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Quick Actions</h3>
                             <div className="grid grid-cols-1 gap-4">
                                <button onClick={() => setActiveTab('agents')} className="p-6 bg-white border border-gray-100 rounded-[2rem] flex items-center gap-4 hover:border-blue-500 hover:shadow-xl transition-all group">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-all"><UserPlus size={20}/></div>
                                    <div className="text-left">
                                        <p className="font-black text-gray-900 text-sm leading-none">Add Agent</p>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Create new partner</p>
                                    </div>
                                </button>
                                <button onClick={() => { resetForm(); setActiveTab('services'); setShowServiceForm(true); }} className="p-6 bg-white border border-gray-100 rounded-[2rem] flex items-center gap-4 hover:border-emerald-500 hover:shadow-xl transition-all group">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-white transition-all"><PlusCircle size={20}/></div>
                                    <div className="text-left">
                                        <p className="font-black text-gray-900 text-sm leading-none">New Service</p>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Live website CMS</p>
                                    </div>
                                </button>
                                <div className="p-8 bg-blue-900 rounded-[2.5rem] text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-4">Total Revenue Flow</p>
                                        <p className="text-3xl font-black">₹{stats.revenue.toLocaleString()}</p>
                                        <p className="text-[10px] text-blue-200 mt-2 font-bold uppercase">Volume across all categories</p>
                                    </div>
                                    <BarChart3 className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'agents' && (
                <div className="space-y-12 pb-20 animate-in slide-in-from-left-4 duration-500">
                    {pendingAgents.length > 0 && (
                      <section>
                        <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-6 flex items-center gap-3"><Bell size={16}/> User Approval Queue ({pendingAgents.length})</h3>
                        <div className="bg-orange-50/50 border border-orange-100 rounded-[2.5rem] overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-orange-100/50 text-[10px] font-black text-orange-800 uppercase tracking-widest">
                                  <tr><th className="px-8 py-4">Requester</th><th className="px-8 py-4 text-right">Actions</th></tr>
                              </thead>
                              <tbody className="divide-y divide-orange-100">
                                  {pendingAgents.map(u => (
                                      <tr key={u.id}>
                                          <td className="px-8 py-5"><p className="font-black text-gray-900">{u.name}</p><p className="text-[10px] text-gray-400 font-bold">{u.email}</p></td>
                                          <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                                              <button onClick={() => adminApproveUser(u.id)} className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 shadow-sm transition-all">Approve</button>
                                              <button onClick={() => adminRejectUser(u.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 shadow-sm transition-all">Reject</button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                        </div>
                      </section>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3"><Users size={16} className="text-blue-500" /> Active Agents Database</h3>
                            <section className="border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm bg-white">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <tr><th className="px-8 py-5">Agent</th><th className="px-8 py-5 text-right">Balance</th><th className="px-8 py-5 text-right">Manage</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {activeAgents.map(u => (
                                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-5"><p className="font-black text-gray-900 leading-none mb-1">{u.name}</p><p className="text-[10px] text-gray-400 font-bold uppercase">{u.agentId}</p></td>
                                                <td className="px-8 py-5 text-right font-black text-blue-900">₹{u.walletBalance.toLocaleString()}</td>
                                                <td className="px-8 py-5 text-right">
                                                    <button onClick={() => adminDeleteUser(u.id)} className="p-2 text-red-300 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        </div>
                        <div>
                            <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-3"><DollarSign size={16} className="text-green-600" /> Wallet Transfer</h3>
                                <form onSubmit={(e) => { e.preventDefault(); if(transferUserId && transferAmount) { adminTransferFunds(transferUserId, parseFloat(transferAmount)); setTransferAmount(''); setTransferUserId(''); alert("Funds Transferred!"); }}} className="space-y-6">
                                    <select required value={transferUserId} onChange={(e) => setTransferUserId(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none transition-all focus:border-blue-900">
                                        <option value="">-- Select Agent --</option>
                                        {activeAgents.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                    <input required type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="Amount INR" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-sm outline-none transition-all focus:border-blue-900" />
                                    <button type="submit" className="w-full bg-blue-900 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">Send Funds Instantly</button>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'services' && (
                <div className="space-y-10 pb-20 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                            <Server size={16} className="text-emerald-500" /> Live Website CMS ({services.length})
                        </h3>
                        <button 
                            onClick={() => { resetForm(); setShowServiceForm(true); }}
                            className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all"
                        >
                            <PlusCircle size={18} /> Create New Web Service
                        </button>
                    </div>

                    {showServiceForm && (
                        <div className="p-10 bg-white rounded-[3rem] border border-gray-200 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="text-xl font-black text-gray-900 tracking-tight">No-Code Service Builder</h4>
                                <button onClick={() => setShowServiceForm(false)} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"><X size={20}/></button>
                            </div>

                            <form onSubmit={handleSaveService} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Service Name</label>
                                        <input required value={newServiceName} onChange={e => setNewServiceName(e.target.value)} placeholder="e.g. Income Certificate" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none shadow-sm focus:border-blue-900" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Portal Fee (₹)</label>
                                        <input required type="number" value={newServiceFee} onChange={e => setNewServiceFee(parseInt(e.target.value))} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-black outline-none shadow-sm focus:border-blue-900" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Web Category</label>
                                        <select value={newServiceCat} onChange={e => setNewServiceCat(e.target.value as ServiceCategory)} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none shadow-sm cursor-pointer">
                                            <option value={ServiceCategory.G2C}>G2C (Citizen)</option>
                                            <option value={ServiceCategory.B2C}>B2C (Business)</option>
                                            <option value={ServiceCategory.PRINT}>Print Services</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Direct Portal Link (Optional)</label>
                                        <input value={newServiceRedirect} onChange={e => setNewServiceRedirect(e.target.value)} placeholder="https://..." className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none shadow-sm focus:border-blue-900" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dynamic Form Fields (CMS)</h5>
                                        <button type="button" onClick={addField} className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all">
                                            <Plus size={14}/> Add Input Field
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dynamicFields.map(f => (
                                            <div key={f.id} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-4 animate-in slide-in-from-left-2">
                                                <input value={f.label} onChange={e => updateField(f.id, 'label', e.target.value)} placeholder="Field Label" className="flex-1 bg-transparent border-b border-gray-200 outline-none font-bold text-sm text-gray-800 focus:border-blue-900" />
                                                <select value={f.type} onChange={e => updateField(f.id, 'type', e.target.value)} className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-black uppercase">
                                                    <option value="text">Text</option>
                                                    <option value="number">Number</option>
                                                    <option value="date">Date</option>
                                                </select>
                                                <button type="button" onClick={() => removeField(f.id)} className="p-2 text-red-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                            </div>
                                        ))}
                                        {dynamicFields.length === 0 && <p className="col-span-full py-10 text-center text-gray-300 font-bold uppercase tracking-widest text-[10px]">No custom fields added</p>}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button type="submit" className="flex-1 bg-blue-900 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                                        Update Portal Live Now
                                    </button>
                                    <button type="button" onClick={() => setShowServiceForm(false)} className="px-10 py-6 bg-white text-gray-400 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all border border-gray-100">Discard Changes</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <section className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Service Overview</th>
                                    <th className="px-8 py-5 text-right">Portal Fee</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {services.map(svc => (
                                    <tr key={svc.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <p className="font-black text-gray-900 text-sm leading-none mb-1.5">{svc.name}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[8px] font-black px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded uppercase tracking-tighter">{svc.category}</span>
                                                <p className="text-[10px] text-gray-400 font-bold max-w-sm truncate">{svc.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-emerald-600">₹{svc.fee}</td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => startEditService(svc)} className="p-2.5 text-gray-300 hover:text-blue-600 transition-all"><Edit2 size={18} /></button>
                                                <button onClick={() => adminDeleteService(svc.id)} className="p-2.5 text-gray-300 hover:text-red-600 transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in zoom-in-95 duration-300">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3"><Monitor size={16} className="text-purple-500" /> Global Site Configuration</h3>
                    <form onSubmit={handleSaveSettings} className="space-y-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hero Title (Main Heading)</label>
                              <input 
                                  value={localSettings.heroTitle}
                                  onChange={e => setLocalSettings({...localSettings, heroTitle: e.target.value})}
                                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-black text-sm outline-none focus:border-blue-900 transition-all"
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Portal Accessibility</label>
                              <button 
                                  type="button"
                                  onClick={() => setLocalSettings({...localSettings, maintenanceMode: !localSettings.maintenanceMode})}
                                  className={`w-full py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all ${localSettings.maintenanceMode ? 'bg-red-600 text-white shadow-xl' : 'bg-green-100 text-green-700'}`}
                              >
                                  {localSettings.maintenanceMode ? <Lock size={16}/> : <Unlock size={16}/>}
                                  {localSettings.maintenanceMode ? 'Portal Locked for Agents' : 'Portal is Live'}
                              </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Scrolling Global News Ticker</label>
                            <textarea 
                                value={localSettings.announcement}
                                onChange={e => setLocalSettings({...localSettings, announcement: e.target.value})}
                                className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm h-24 resize-none outline-none focus:border-blue-900 transition-all"
                                placeholder="Edit marquee text here..."
                            />
                        </div>

                        {/* --- ADSENSE SECTION --- */}
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-gray-200 space-y-6">
                            <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-3">
                                <RevenueIcon size={18} className="text-emerald-600" /> AdSense Control Center
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Display Ads Status</label>
                                    <button 
                                        type="button"
                                        onClick={() => setLocalSettings({...localSettings, adsEnabled: !localSettings.adsEnabled})}
                                        className={`w-full py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all ${localSettings.adsEnabled ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'}`}
                                    >
                                        <Megaphone size={16}/>
                                        {localSettings.adsEnabled ? 'Ads Displaying Live' : 'All Ads Hidden'}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Google Publisher ID</label>
                                    <input 
                                        value={localSettings.adClientCode}
                                        onChange={e => setLocalSettings({...localSettings, adClientCode: e.target.value})}
                                        placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-white font-mono font-bold text-xs outline-none focus:border-blue-900 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="p-4 bg-white border border-blue-100 rounded-xl flex items-start gap-3">
                                <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[9px] font-bold text-blue-900/60 leading-relaxed uppercase">
                                    Strategic ad units are placed in the Hero section and Service Grid. Ensure your AdSense dashboard has approved this domain for monetization.
                                </p>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-900 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                            <Layout size={20}/> Save Global Site Configuration
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="space-y-8 pb-20 animate-in slide-in-from-bottom-10 duration-500">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3"><FileText size={16} className="text-orange-500" /> Unified Order Management</h3>
                    <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <tr><th className="px-8 py-5">Order Reference</th><th className="px-8 py-5">Service Details</th><th className="px-8 py-5">Current Status</th><th className="px-8 py-5 text-right">Operations</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sortedApps.map(app => (
                                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6"><p className="text-[9px] font-mono font-bold text-gray-400 mb-1">{app.id}</p><p className="text-xs font-black text-gray-900">{new Date(app.timestamp).toLocaleDateString()}</p></td>
                                        <td className="px-8 py-6"><p className="text-sm font-black text-blue-900 leading-none mb-1.5">{app.serviceName}</p><p className="text-[10px] font-bold text-gray-400 uppercase">Agent: {app.agentName}</p></td>
                                        <td className="px-8 py-6"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{app.status}</span></td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => setViewingApp(app)} className="p-2 text-gray-300 hover:text-blue-900 transition-colors"><Eye size={20} /></button>
                                                {app.status === 'pending' && <button onClick={() => adminUpdateApplicationStatus(app.id, 'approved')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase shadow-sm">Process</button>}
                                                {app.status === 'approved' && <button onClick={() => { setUploadingAppId(app.id); fileInputRef.current?.click(); }} className="px-4 py-2 bg-blue-900 text-white rounded-xl text-[9px] font-black uppercase shadow-sm">Upload Cert</button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {sortedApps.length === 0 && <tr><td colSpan={4} className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-[10px]">No orders found in history</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'sync' && (
                <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-4 flex items-center justify-center gap-4">
                            <Zap className="text-orange-500" /> Magic Sync Terminal
                        </h3>
                        <p className="text-gray-500 font-medium max-w-2xl mx-auto">Export your entire portal configuration into a command link (Magic Out) or inject data from another source (Magic Sink).</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* MAGIC OUT SECTION */}
                        <section className="bg-white border border-gray-100 p-10 rounded-[4rem] shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-30 group-hover:bg-blue-200 transition-all duration-700"></div>
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 shadow-inner border border-blue-100"><CloudUpload size={32} /></div>
                            
                            <h4 className="text-2xl font-black text-gray-900 mb-2">Magic Out</h4>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-10">Export Entire System</p>
                            
                            <div className="space-y-6">
                                <button 
                                    onClick={() => { const link = generateSyncLink(); navigator.clipboard.writeText(link).then(() => alert("✨ MAGIC COMMAND LINK COPIED!")); }} 
                                    className="w-full bg-blue-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-4 hover:bg-blue-800 active:scale-95 transition-all"
                                >
                                    <Share2 size={20} /> Copy Magic Sync Link
                                </button>
                                <button 
                                    onClick={() => { const key = exportSystemData(); navigator.clipboard.writeText(key).then(() => alert("✨ MAGIC COMMAND KEY COPIED!")); }} 
                                    className="w-full bg-white text-blue-900 border border-blue-100 py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 hover:bg-blue-50 transition-all"
                                >
                                    <Copy size={20} /> Copy Raw Sync Key
                                </button>
                            </div>
                            <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-3">
                                <ShieldQuestion size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[9px] font-bold text-blue-900/60 leading-relaxed uppercase">
                                    Sharing this link allows anyone with the key to instantly duplicate your services, agents, and history. Use with caution.
                                </p>
                            </div>
                        </section>

                        {/* MAGIC SINK SECTION */}
                        <section className="bg-[#0f172a] p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group text-white">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl transition-all duration-700"></div>
                            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-orange-400 mb-8 shadow-inner border border-white/10"><CloudDownload size={32} /></div>
                            
                            <h4 className="text-2xl font-black text-white mb-2">Magic Sink</h4>
                            <p className="text-xs text-orange-400/60 font-black uppercase tracking-widest mb-8">Inject System Data</p>
                            
                            <div className="space-y-6">
                                <div className="relative">
                                    <Terminal className="absolute left-4 top-4 text-orange-500/40" size={16} />
                                    <textarea 
                                        value={importKey}
                                        onChange={(e) => setImportKey(e.target.value)}
                                        placeholder="PASTE MAGIC SYNC KEY HERE..."
                                        className="w-full h-32 pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-orange-500 transition-all font-mono text-[10px] text-orange-400 uppercase scrollbar-hide resize-none"
                                    />
                                </div>
                                <button 
                                    disabled={!importKey.trim() || isSyncing}
                                    onClick={handleMagicSink}
                                    className="w-full bg-orange-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-orange-900/20 flex items-center justify-center gap-4 hover:bg-orange-500 active:scale-95 transition-all disabled:opacity-30"
                                >
                                    {isSyncing ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
                                    {isSyncing ? 'SINKING DATA...' : 'SINK DATA NOW'}
                                </button>
                            </div>
                            {isSyncing && (
                                <div className="mt-4 flex items-center gap-3 justify-center animate-pulse">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Processing Data Packets...</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            )}
        </div>

        {/* Dynamic Detail Modal */}
        {viewingApp && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md" onClick={() => setViewingApp(null)}>
              <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Order Submission Details</h3>
                    <button onClick={() => setViewingApp(null)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-colors"><X size={24}/></button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-4 scrollbar-hide">
                    {Object.entries(viewingApp.formData).map(([key, val]: any) => (
                      <div key={key} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1.5 block">{key.replace(/_/g, ' ')}</span>
                        <p className="text-base font-bold text-gray-900 break-words">{val || 'Not provided'}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 flex gap-4">
                    <button onClick={() => setViewingApp(null)} className="flex-1 bg-blue-900 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all">Close Viewer</button>
                    {viewingApp.status === 'pending' && (
                        <button 
                            onClick={() => { adminUpdateApplicationStatus(viewingApp.id, 'rejected'); setViewingApp(null); alert("Order Rejected"); }}
                            className="flex-1 bg-white text-red-500 border border-red-100 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-50 transition-all"
                        >
                            Reject Order
                        </button>
                    )}
                  </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};
