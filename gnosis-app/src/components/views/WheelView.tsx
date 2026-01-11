"use client";

import { motion } from "framer-motion";
import { CategoryWheel } from "@/components/CategoryWheel";
import { CategoryConfig } from "@/data/knowledgeCards";

interface WheelViewProps {
  categories: CategoryConfig[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  cardCounts: Record<string, number>;
}

export function WheelView({
  categories,
  selectedCategory,
  onSelectCategory,
  cardCounts,
}: WheelViewProps) {
  return (
    <motion.div
      key="wheel-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col relative"
    >
      {/* Newspaper Header */}
      <header className="relative z-20 pt-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Top date line */}
          <div className="flex items-center justify-between mb-2 text-ink-gray">
            <span className="font-serif text-xs italic">Édition Quotidienne</span>
            <span className="font-headline text-xs">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }).toUpperCase()}
            </span>
            <span className="font-serif text-xs italic">Prix: Gratuit</span>
          </div>
          
          {/* Double line */}
          <div className="h-[3px] bg-ink-black" />
          <div className="h-[1px] bg-ink-black mt-[2px]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <CategoryWheel
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          cardCounts={cardCounts}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-20 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-[1px] bg-ink-black mb-[2px]" />
          <div className="h-[3px] bg-ink-black" />
          <div className="flex items-center justify-center mt-3 gap-4">
            <span className="text-ink-gray text-xs">★</span>
            <span className="font-headline text-xs tracking-wider text-ink-gray">
              VOTRE SOURCE DE SAVOIR DEPUIS 2024
            </span>
            <span className="text-ink-gray text-xs">★</span>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
