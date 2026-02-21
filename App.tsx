import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServiceGrid } from './components/ServiceGrid';
import { Resources } from './components/Resources';
import { Contact } from './components/Contact';
import { GeminiAssistant } from './components/GeminiAssistant';
import { AuthProvider } from './components/AuthContext';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Header onOpenAuth={() => setShowAuth(true)} onOpenAdmin={() => setShowAdmin(true)} />
      <main>
        <Hero />
        <ServiceGrid onOpenAuth={() => setShowAuth(true)} />
        <Resources />
      </main>
      <Contact />
      <GeminiAssistant />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;