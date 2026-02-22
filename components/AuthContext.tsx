
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SERVICES_DATA, ServiceItem } from '../constants';
import { db } from '../firebase';
import { ref, onValue, set, update, push } from 'firebase/database';

export type UserRole = 'admin' | 'agent';
export type UserStatus = 'active' | 'pending' | 'rejected';
export type AppStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type JobCategory = 'result' | 'admit-card' | 'latest-job' | 'answer-key' | 'syllabus' | 'admission';

export interface JobPost {
  id: string;
  title: string;
  category: JobCategory;
  postDate: string;
  shortInfo: string;
  content: string; // Markdown or HTML
  status: 'draft' | 'live';
  applyLink?: string;
  officialWebsite?: string;
  notificationPdf?: string;
}

export interface SiteSettings {
  announcement: string;
  heroTitle: string;
  heroSubtitle: string;
  maintenanceMode: boolean;
  adsEnabled: boolean;
  adClientCode: string;
}

export interface Application {
  id: string;
  serviceId: string;
  serviceName: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  formData: Record<string, string>;
  status: AppStatus;
  certificateUrl?: string;
  fee: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  walletBalance: number;
  agentId: string;
}

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  applications: Application[];
  jobPosts: JobPost[];
  services: ServiceItem[];
  siteSettings: SiteSettings;
  loading: boolean;
  login: (identifier: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateWallet: (amount: number) => boolean;
  addApplication: (app: Omit<Application, 'id' | 'status' | 'timestamp'>) => void;
  addJobPost: (post: Omit<JobPost, 'id'>) => void;
  updateJobPost: (id: string, post: Partial<JobPost>) => void;
  deleteJobPost: (id: string) => void;
  publishJobPost: (id: string) => void;
  adminApproveUser: (userId: string) => void;
  adminRejectUser: (userId: string) => void;
  adminTransferFunds: (userId: string, amount: number) => void;
  adminChangePassword: (userId: string, newPass: string) => void;
  adminUpdateApplicationStatus: (appId: string, status: AppStatus) => void;
  adminUploadCertificate: (appId: string, url: string) => void;
  adminCreateUser: (name: string, email: string, pass: string) => boolean;
  adminDeleteUser: (userId: string) => void;
  adminAddService: (service: ServiceItem) => void;
  adminUpdateService: (service: ServiceItem) => void;
  adminDeleteService: (serviceId: string) => void;
  adminUpdateSettings: (settings: SiteSettings) => void;
  exportSystemData: () => string;
  importSystemData: (encodedData: string, isSilent?: boolean) => boolean;
  generateSyncLink: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  name: 'Sandhya Infotech Admin',
  email: 'admin@sandhya.com',
  password: 'admin',
  role: 'admin',
  status: 'active',
  walletBalance: 999999,
  agentId: 'ADM001'
};

const DEFAULT_SETTINGS: SiteSettings = {
  announcement: '🔥 New PAN Card 2.0 applications now processed within 48 hours. • Aadhaar PVC Card printing service available at our center. • PM-KISAN 16th Installment e-KYC last date extended.',
  heroTitle: 'The Smart Way to Digital Governance',
  heroSubtitle: 'Access over 50+ essential citizen services from the comfort of your home. Secure, reliable, and lightning-fast digital solutions.',
  maintenanceMode: false,
  adsEnabled: false,
  adClientCode: 'ca-pub-XXXXXXXXXXXX'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const [allUsers, setAllUsers] = useState<User[]>([DEFAULT_ADMIN]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  // Sync with Firebase
  useEffect(() => {
    const usersRef = ref(db, 'users');
    const appsRef = ref(db, 'applications');
    const jobsRef = ref(db, 'jobPosts');
    const servicesRef = ref(db, 'services');
    const settingsRef = ref(db, 'settings');

    let usersSynced = false;
    let appsSynced = false;
    let jobsSynced = false;
    let servicesSynced = false;
    let settingsSynced = false;

    const checkAllSynced = () => {
      if (usersSynced && appsSynced && jobsSynced && servicesSynced && settingsSynced) {
        setLoading(false);
      }
    };

    const unsubUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.values(data) as User[];
        // Ensure admin exists
        if (!usersList.some(u => u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase())) {
          set(ref(db, `users/${DEFAULT_ADMIN.id}`), DEFAULT_ADMIN);
        }
        setAllUsers(usersList);
      } else {
        // Initialize with default admin
        set(ref(db, `users/${DEFAULT_ADMIN.id}`), DEFAULT_ADMIN);
        setAllUsers([DEFAULT_ADMIN]);
      }
      usersSynced = true;
      checkAllSynced();
    });

    const unsubApps = onValue(appsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setApplications(Object.values(data) as Application[]);
      else setApplications([]);
      appsSynced = true;
      checkAllSynced();
    });

    const unsubJobs = onValue(jobsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setJobPosts(Object.values(data) as JobPost[]);
      else setJobPosts([]);
      jobsSynced = true;
      checkAllSynced();
    });

    const unsubServices = onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setServices(Object.values(data) as ServiceItem[]);
      else setServices(SERVICES_DATA);
      servicesSynced = true;
      checkAllSynced();
    });

    const unsubSettings = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSiteSettings(data);
        // Dynamically update AdSense Client ID
        const adsScript = document.getElementById('adsense-script') as HTMLScriptElement;
        if (adsScript && data.adClientCode) {
            adsScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${data.adClientCode}`;
        }
      } else {
        set(ref(db, 'settings'), DEFAULT_SETTINGS);
      }
      settingsSynced = true;
      checkAllSynced();
    });

    // Safety timeout: If sync takes more than 5 seconds, force loading to false
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      unsubUsers();
      unsubApps();
      unsubJobs();
      unsubServices();
      unsubSettings();
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const syncData = params.get('sync');
    if (syncData) {
        const success = importSystemData(syncData, true);
        if (success) {
            window.history.replaceState({}, document.title, window.location.pathname);
            alert("✨ AUTO-SYNC SUCCESSFUL!\nWebsite settings and services updated.");
        }
    }
  }, []);

  const exportSystemData = () => {
    const data = {
        users: allUsers,
        apps: applications,
        services: services.map(({ icon, ...rest }) => rest),
        settings: siteSettings,
        exportDate: new Date().toISOString()
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  };

  const generateSyncLink = () => {
    const key = exportSystemData();
    return `${window.location.origin}${window.location.pathname}?sync=${key}`;
  };

  const importSystemData = (encodedData: string, isSilent: boolean = false) => {
    try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(encodedData.trim()))));
        if (decoded.users) setAllUsers(decoded.users);
        if (decoded.apps) setApplications(decoded.apps);
        if (decoded.services) setServices(decoded.services);
        if (decoded.settings) setSiteSettings(decoded.settings);
        if (!isSilent) alert("System Synchronized!");
        return true;
    } catch (e) {
        if (!isSilent) alert("Sync Failed.");
        return false;
    }
  };

  const login = async (identifier: string, pass: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();
    
    // Absolute fallback for Master Admin to ensure access under any condition
    const isMasterAdmin = 
      (cleanId === 'admin@sandhya.com' || 
       cleanId === 'adm001' || 
       cleanId === 'admin') && 
      cleanPass === 'admin';

    if (isMasterAdmin) {
      setUser(DEFAULT_ADMIN);
      return true;
    }

    const found = allUsers.find(u => 
      (u.email.toLowerCase() === cleanId || 
       u.name.toLowerCase() === cleanId || 
       u.agentId.toLowerCase() === cleanId) && 
      u.password === cleanPass
    );
    if (found) {
      if (found.status === 'pending') { alert("Verification Pending."); return false; }
      if (found.status === 'rejected') { alert("Access Denied."); return false; }
      setUser(found);
      return true;
    }
    return false;
  };

  const adminCreateUser = (name: string, email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const userId = 'usr-' + Math.random().toString(36).substr(2, 9);
    const newUser: User = {
      id: userId,
      name, email: cleanEmail, password: pass, role: 'agent', status: 'active', 
      walletBalance: 0, agentId: 'AGT' + Math.floor(1000 + Math.random() * 9000)
    };
    set(ref(db, `users/${userId}`), newUser);
    return true;
  };

  const adminUpdateSettings = (settings: SiteSettings) => set(ref(db, 'settings'), settings);
  const adminDeleteUser = (userId: string) => set(ref(db, `users/${userId}`), null);
  const adminAddService = (service: ServiceItem) => set(ref(db, `services/${service.id}`), service);
  const adminUpdateService = (updatedService: ServiceItem) => set(ref(db, `services/${updatedService.id}`), updatedService);
  const adminDeleteService = (serviceId: string) => set(ref(db, `services/${serviceId}`), null);
  const logout = () => setUser(null);

  const updateWallet = (amount: number) => {
    if (!user) return false;
    const newBalance = user.walletBalance + amount;
    if (newBalance < 0) return false;
    update(ref(db, `users/${user.id}`), { walletBalance: newBalance });
    setUser({ ...user, walletBalance: newBalance });
    return true;
  };

  const addApplication = (appData: Omit<Application, 'id' | 'status' | 'timestamp'>) => {
    const appId = `APP-${Date.now()}`;
    const newApp: Application = { ...appData, id: appId, status: 'pending', timestamp: new Date().toISOString() };
    set(ref(db, `applications/${appId}`), newApp);
  };

  const addJobPost = (postData: Omit<JobPost, 'id'>) => {
    const jobId = `JOB-${Date.now()}`;
    const newJob: JobPost = { ...postData, id: jobId };
    set(ref(db, `jobPosts/${jobId}`), newJob);
  };

  const updateJobPost = (id: string, postData: Partial<JobPost>) => {
    update(ref(db, `jobPosts/${id}`), postData);
  };

  const deleteJobPost = (id: string) => {
    set(ref(db, `jobPosts/${id}`), null);
  };

  const publishJobPost = (id: string) => {
    update(ref(db, `jobPosts/${id}`), { status: 'live' });
  };

  const adminApproveUser = (userId: string) => update(ref(db, `users/${userId}`), { status: 'active' });
  const adminRejectUser = (userId: string) => update(ref(db, `users/${userId}`), { status: 'rejected' });
  const adminChangePassword = (userId: string, newPass: string) => update(ref(db, `users/${userId}`), { password: newPass });
  const adminTransferFunds = (userId: string, amount: number) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (targetUser) {
      update(ref(db, `users/${userId}`), { walletBalance: targetUser.walletBalance + amount });
    }
  };
  const adminUpdateApplicationStatus = (appId: string, status: AppStatus) => update(ref(db, `applications/${appId}`), { status });
  const adminUploadCertificate = (appId: string, url: string) => update(ref(db, `applications/${appId}`), { certificateUrl: url, status: 'completed' });

  return (
    <AuthContext.Provider value={{ 
      user, allUsers, applications, jobPosts, services, siteSettings, loading, login, logout, updateWallet, 
      addApplication, addJobPost, updateJobPost, deleteJobPost, publishJobPost,
      adminApproveUser, adminRejectUser, adminTransferFunds, adminChangePassword,
      adminUpdateApplicationStatus, adminUploadCertificate, adminCreateUser, adminDeleteUser,
      adminAddService, adminUpdateService, adminDeleteService, adminUpdateSettings,
      exportSystemData, importSystemData, generateSyncLink
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
