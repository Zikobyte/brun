import React, { useState } from 'react';
import { Search, X, Coffee, Sparkles, Flame, Tag } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoffee: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCoffee,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickTags = [
    'Ethiopian Yirgacheffe',
    'Meyer Lemon',
    'Jasmine Blossom',
    'Caramel Malt',
    'Nitro Cold Brew',
    'Whole Bean 12oz',
    'Gedeo Smallholder',
    'Light-Medium Roast',
  ];

  const searchResults = [
    {
      title: 'Ethiopian Yirgacheffe Limited Release',
      category: 'Signature Roast',
      notes: 'Bergamot, candied citrus, honeysuckle, toffee',
      score: '89.5 SCAA',
    },
    {
      title: 'Nitro Cold Brew Reserve Can',
      category: 'Ready to Drink',
      notes: 'Velvety micro-crema, dark cacao, molasses',
      score: 'Cold Steeped 20h',
    },
    {
      title: 'Single Origin Whole Bean Craft Pack',
      category: 'Whole Bean Bag',
      notes: 'Washed heirloom, floral aromatics, stone fruit',
      score: '1,950m MASL',
    },
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.notes.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#F8F6F0] rounded-xl shadow-2xl border border-[#DFD8CB] overflow-hidden z-10">
        <div className="p-4 sm:p-6 border-b border-[#E3DDD1] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#2F1207]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roasts, flavor notes, origins (e.g. Jasmine, Citrus, Yirgacheffe)..."
            autoFocus
            className="w-full bg-transparent text-[#1D1B16] placeholder-[#8C8372] text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-[#8C8372] hover:text-[#1D1B16]">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7C7567] hover:bg-[#EAE4D7] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tags */}
        <div className="p-4 sm:p-6 bg-[#F3EFE6] border-b border-[#E3DDD1]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C7567] block mb-2">
            Popular Tasting Notes & Searches
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 text-xs bg-white/90 hover:bg-[#2F1207] hover:text-white rounded border border-[#DFD8CB] text-[#3A352D] transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="p-4 sm:p-6 max-h-80 overflow-y-auto space-y-3">
          {searchResults.length > 0 ? (
            searchResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectCoffee(item.title);
                  onClose();
                }}
                className="p-3.5 rounded-lg border border-[#DFD8CB] bg-white hover:border-[#2F1207] hover:shadow-sm transition-all cursor-pointer group flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F1207]">
                      {item.category}
                    </span>
                    <span className="text-xs text-[#8C8372]">·</span>
                    <span className="text-[10px] text-[#7C7567] font-medium">{item.score}</span>
                  </div>
                  <h4 className="font-cinzel font-bold text-sm text-[#1D1B16] group-hover:text-[#2F1207]">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#7C7567]">Notes: {item.notes}</p>
                </div>
                <Coffee className="w-4 h-4 text-[#A89F8F] group-hover:text-[#2F1207] transition-colors mt-1" />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-[#7C7567]">
              No direct matches found for "{query}". Try searching "Citrus" or "Yirgacheffe".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
