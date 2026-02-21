
import React, { useState } from 'react';
import { useAuth, JobCategory, JobPost } from './AuthContext';
import { ExternalLink, FileText, Calendar, ArrowRight, X, Search, Filter } from 'lucide-react';
import Markdown from 'react-markdown';

export const JobPortal: React.FC = () => {
  const { jobPosts } = useAuth();
  const [selectedPost, setSelectedPost] = useState<JobPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const livePosts = jobPosts.filter(p => p.status === 'live');

  const categories: { id: JobCategory; label: string; color: string }[] = [
    { id: 'result', label: 'Latest Results', color: 'bg-red-600' },
    { id: 'admit-card', label: 'Admit Cards', color: 'bg-blue-600' },
    { id: 'latest-job', label: 'Latest Jobs', color: 'bg-green-600' },
  ];

  const filteredPosts = (cat: JobCategory) => {
    return livePosts
      .filter(p => p.category === cat)
      .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());
  };

  return (
    <section id="jobs" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Job & Recruitment Portal</h2>
          <p className="text-lg text-gray-600">Latest Government Jobs, Results, and Admit Cards at your fingertips.</p>
        </div>

        <div className="mb-10 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for jobs, results..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[600px]">
              <div className={`${cat.color} p-6 text-white`}>
                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                  <FileText size={20} /> {cat.label}
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                {filteredPosts(cat.id).map(post => (
                  <button 
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="w-full text-left p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group flex items-start gap-3"
                  >
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm leading-tight group-hover:text-blue-600 transition-colors">{post.title}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase mt-1">{new Date(post.postDate).toLocaleDateString()}</p>
                    </div>
                  </button>
                ))}
                {filteredPosts(cat.id).length === 0 && (
                  <div className="py-20 text-center text-gray-300">
                    <p className="font-black uppercase tracking-widest text-xs">No posts yet</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-slate-50 border-t border-gray-100">
                <button className="w-full py-3 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 rounded-xl transition-all">View All {cat.label}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedPost(null)} />
          <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center text-white">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">{selectedPost.title}</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Posted on {new Date(selectedPost.postDate).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-red-500">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10">
              <div className="max-w-3xl mx-auto">
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 mb-10">
                  <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">Short Information</h4>
                  <p className="text-sm text-blue-800 font-medium leading-relaxed">{selectedPost.shortInfo}</p>
                </div>

                <div className="markdown-body prose prose-slate max-w-none">
                  <Markdown>{selectedPost.content}</Markdown>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedPost.applyLink && (
                    <a 
                      href={selectedPost.applyLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-green-600/20 hover:bg-green-700 transition-all"
                    >
                      Apply Online <ExternalLink size={16} />
                    </a>
                  )}
                  {selectedPost.notificationPdf && (
                    <a 
                      href={selectedPost.notificationPdf} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-blue-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all"
                    >
                      Download Notification <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
