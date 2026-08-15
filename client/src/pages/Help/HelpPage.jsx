import React, { useState, useEffect } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import api from '../../services/api';

export default function HelpPage() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openId, setOpenId] = useState(null);

  const categories = [
    'Donor Registration',
    'Recipient Registration',
    'Waiting List',
    'Organ Matching',
    'Consent',
    'Account & Login',
    'Transplant Information'
  ];

  const fetchHelp = async () => {
    try {
      const res = await api.get('/help', {
        params: { query: search, category: selectedCategory }
      });
      if (res.data.success) {
        setArticles(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch help articles:', err);
    }
  };

  useEffect(() => {
    fetchHelp();
  }, [search, selectedCategory]);

  return (
    <MainLayout>
      <div className="py-12 bg-slate-50 min-h-[calc(100vh-10rem)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-8 text-white text-center space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto backdrop-blur-sm">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-extrabold">Help & Support Knowledge Base</h1>
            <p className="text-sky-100 text-xs max-w-xl mx-auto">
              Find answers to questions about donor pledges, recipient waiting lists, matching scores, and consent policies.
            </p>

            {/* Search Input */}
            <div className="max-w-md mx-auto relative pt-2">
              <Search className="w-4 h-4 absolute left-3 top-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search help topics or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 text-xs text-slate-800 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-md"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === '' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion FAQ Articles */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 divide-y divide-slate-100">
            {articles.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No help articles found matching your query.</p>
            ) : (
              articles.map((art) => {
                const isOpen = openId === art.id;
                return (
                  <div key={art.id} className="py-4 space-y-2">
                    <button
                      onClick={() => setOpenId(isOpen ? null : art.id)}
                      className="w-full flex items-center justify-between text-left focus:outline-none group"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">{art.category}</span>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{art.question}</h3>
                      </div>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-sky-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <p className="text-xs text-slate-600 leading-relaxed pt-2 pl-2 border-l-2 border-sky-400 animate-in fade-in duration-150">
                        {art.answer}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
