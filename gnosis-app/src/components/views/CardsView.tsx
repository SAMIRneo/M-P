"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowLeft } from "lucide-react";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { CategoryConfig, KnowledgeCard as KnowledgeCardType } from "@/data/knowledgeCards";

interface CardsViewProps {
  filteredCards: KnowledgeCardType[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  handleBackToWheel: () => void;
  categories: CategoryConfig[];
  selectedCategoryConfig?: CategoryConfig;
}

// No longer need local comicColors as we use config
export function CardsView({
  filteredCards,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  handleBackToWheel,
  categories,
  selectedCategoryConfig,
}: CardsViewProps) {
  const categoryColor = selectedCategoryConfig?.color || "var(--comic-red)";

  return (
    <motion.div
      key="cards-view"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pb-20"
    >
      {/* Newspaper Header */}
      <header className="relative z-20 pt-10 px-4 mb-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 text-ink-black font-bold gap-4">
            <span className="font-comic text-2xl tracking-tighter text-comic-red bg-paper-light px-4 border-4 border-ink-black shadow-[4px_4px_0_var(--ink-black)] -rotate-2">
              GNOSIS DAILY
            </span>
            <div className="flex-1 flex flex-col items-center">
              <span className="font-headline text-lg tracking-[0.3em] font-black italic">ARCHIVES CLASSÉES S01</span>
              <div className="flex items-center gap-6 mt-1">
                <span className="font-serif text-xs italic opacity-80">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
                <span className="w-2 h-2 bg-comic-red rounded-full" />
                <span className="font-serif text-xs italic opacity-80">48 DOSSIERS ACTIFS</span>
              </div>
            </div>
            <span className="font-comic text-2xl text-comic-blue bg-paper-light px-4 border-4 border-ink-black shadow-[4px_4px_0_var(--ink-black)] rotate-2">
              SECTION SPÉCIALE
            </span>
          </div>
          <div className="h-[6px] bg-ink-black" />
          <div className="h-[2px] bg-ink-black mt-[3px]" />
        </div>
      </header>

      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation & Controls */}
            <div className="sticky top-6 z-50 space-y-4 mb-12 relative">
              <div className="flex flex-col md:flex-row gap-6 items-stretch">
                {/* Back button */}
                <motion.button
                  onClick={handleBackToWheel}
                  className="flex items-center gap-4 px-8 py-4 bg-paper-light border-4 border-ink-black shadow-[8px_8px_0_var(--ink-black)] hover:bg-comic-yellow transition-colors group flex-shrink-0"
                  whileHover={{ x: -2, y: -2, boxShadow: "10px 10px 0 var(--ink-black)" }}
                  whileTap={{ x: 2, y: 2, boxShadow: "2px 2px 0 var(--ink-black)" }}
                >
                  <ArrowLeft className="w-6 h-6 text-ink-black group-hover:-translate-x-1 transition-transform" />
                  <span className="font-comic text-xl text-ink-black uppercase tracking-tight">
                    Retour
                  </span>
                </motion.button>

                {/* Search input - The "Comic Batte" */}
                <div className="relative flex-1">
                  <div 
                    className="absolute inset-0 bg-ink-black translate-x-2 translate-y-2" 
                    style={{ transform: 'rotate(0.5deg)' }}
                  />
                  <div className="relative bg-paper-light border-4 border-ink-black p-1 flex items-center">
                    <div className="pl-4 pr-2">
                      <Search className="w-7 h-7 text-ink-black" />
                    </div>
                    <input
                      type="text"
                      placeholder="RECHERCHER UN DOSSIER..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent py-4 px-2 font-comic text-2xl text-ink-black placeholder-ink-black/30 focus:outline-none uppercase"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="p-3 hover:text-comic-red transition-colors"
                      >
                        <X className="w-7 h-7" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category indicator Badge */}
                <motion.div
                  className="flex items-center gap-4 px-8 py-4 flex-shrink-0"
                  style={{
                    background: categoryColor,
                    border: "4px solid var(--ink-black)",
                    boxShadow: "8px 8px 0 var(--ink-black)",
                    transform: "rotate(1deg)"
                  }}
                >
                  <span className="text-4xl drop-shadow-[2px_2px_0_var(--ink-black)]">
                    {selectedCategoryConfig?.icon || "📚"}
                  </span>
                  <div className="flex flex-col">
                    <h2 className="font-comic text-3xl text-paper-light leading-none -mb-1" style={{ textShadow: "3px 3px 0 var(--ink-black)" }}>
                      {selectedCategoryConfig?.label || "TOUTES"}
                    </h2>
                    <span className="font-headline text-[10px] font-black text-paper-light/80 uppercase tracking-widest">
                      {filteredCards.length} ARTICLES
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Category selection row */}
              <div className="bg-paper-light border-4 border-ink-black shadow-[8px_8px_0_var(--ink-black)] p-3 relative overflow-hidden">
                <div className="absolute inset-0 halftone opacity-5 pointer-events-none" />
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                  {categories.map((cat, i) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <motion.button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSearchQuery("");
                        }}
                        className={`flex items-center gap-3 px-6 py-3 whitespace-nowrap font-comic text-lg uppercase transition-all relative z-10 ${
                          isSelected ? 'text-paper-light' : 'text-ink-black hover:bg-paper-dark'
                        }`}
                        style={{
                          background: isSelected ? cat.color : "transparent",
                          border: isSelected ? "3px solid var(--ink-black)" : "3px solid transparent",
                          transform: isSelected ? "scale(1.05) rotate(-1deg)" : "none",
                          boxShadow: isSelected ? "4px 4px 0 var(--ink-black)" : "none",
                        }}
                        whileHover={!isSelected ? { scale: 1.05, rotate: 1 } : {}}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Functional detail: Results count */}
              <div className="absolute -bottom-3 right-6 px-3 py-1 bg-ink-black text-paper-light font-headline text-[10px] uppercase tracking-tighter">
                {filteredCards.length} Résultats trouvés
              </div>
            </div>

          {/* Cards Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${searchQuery}`}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredCards.map((card, index) => (
                <KnowledgeCard key={card.id} card={card} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {filteredCards.length === 0 && (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div 
                className="inline-block p-12"
                style={{
                  background: "var(--paper-light)",
                  border: "5px solid var(--ink-black)",
                  boxShadow: "12px 12px 0 var(--ink-black)",
                  transform: "rotate(-2deg)",
                }}
              >
                <div className="text-7xl mb-6">🕵️‍♂️</div>
                <h3 className="font-comic text-3xl text-ink mb-4">
                  DOSSIER INTROUVABLE !
                </h3>
                <p className="font-body text-lg text-ink font-medium max-w-md mx-auto">
                  Nos agents n&apos;ont rien trouvé pour &quot;{searchQuery}&quot;. <br/>
                  <span className="italic opacity-70">Peut-être a-t-il été censuré ?</span>
                </p>
                <button 
                  onClick={() => {setSearchQuery(""); setSelectedCategory("all");}}
                  className="mt-8 font-headline text-sm font-bold uppercase underline decoration-2 underline-offset-4 hover:text-comic-red transition-colors"
                >
                  Réinitialiser la recherche
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="h-[2px] bg-ink-black mb-[3px]" />
          <div className="h-[5px] bg-ink-black" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            <p className="font-serif text-sm text-ink font-bold italic">
              GNOSIS ARCHIVES • PROPRIÉTÉ DE L&apos;ESPRIT
            </p>
            <div className="flex items-center gap-4">
              <span className="font-headline text-xs font-bold text-ink uppercase tracking-widest">
                PAGE {filteredCards.length > 0 ? "01" : "00"}
              </span>
              <div className="w-12 h-[2px] bg-ink-black" />
              <span className="font-headline text-xs font-bold text-ink uppercase tracking-widest">
                {filteredCards.length} ARTICLES TOTAL
              </span>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
