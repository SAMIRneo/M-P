"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { ParticleBackground } from "@/components/ParticleBackground";
import { DecorativePillars } from "@/components/DecorativePillars";
import { WheelView } from "@/components/views/WheelView";
import { CardsView } from "@/components/views/CardsView";
import { knowledgeCards, categories } from "@/data/knowledgeCards";

export default function GnosisApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCards, setShowCards] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredCards = useMemo(() => {
    return knowledgeCards.filter((card) => {
      const matchesSearch =
        searchQuery === "" ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "all" || card.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const cardCounts = useMemo(() => {
    const counts: Record<string, number> = { all: knowledgeCards.length };
    knowledgeCards.forEach((card) => {
      counts[card.category] = (counts[card.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setShowCards(true);
  }, []);

  const handleBackToWheel = useCallback(() => {
    setShowCards(false);
    setSearchQuery("");
  }, []);

  const selectedCategoryConfig = categories.find(c => c.id === selectedCategory);

  if (!mounted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--paper-medium)" }}
      >
        {/* Comic-style loading */}
        <div 
          className="relative p-8"
          style={{
            background: "var(--paper-light)",
            border: "4px solid var(--ink-black)",
            boxShadow: "8px 8px 0 var(--ink-black)",
          }}
        >
          <div className="font-comic text-3xl text-ink animate-pulse">
            CHARGEMENT...
          </div>
          <div 
            className="mt-4 h-3 w-48 overflow-hidden"
            style={{ 
              background: "var(--paper-dark)",
              border: "2px solid var(--ink-black)",
            }}
          >
            <div 
              className="h-full animate-[loading_1s_ease-in-out_infinite]"
              style={{ 
                background: "var(--comic-red)",
                width: "30%",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen relative ${!showCards ? 'overflow-hidden' : 'overflow-x-hidden'}`}
      style={{ background: "var(--paper-medium)" }}
    >
      {/* Paper texture background */}
      <ParticleBackground />
      
      {/* Decorative newspaper-style pillars */}
      <DecorativePillars position="left" />
      <DecorativePillars position="right" />

      {/* Main content */}
      <main className={`relative z-10 ${showCards ? 'lg:px-20' : ''}`}>
        <AnimatePresence mode="wait">
          {!showCards ? (
            <WheelView
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              cardCounts={cardCounts}
            />
          ) : (
            <CardsView
              filteredCards={filteredCards}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              handleBackToWheel={handleBackToWheel}
              categories={categories}
              selectedCategoryConfig={selectedCategoryConfig}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Corner print marks */}
      <div className="fixed top-4 left-4 text-ink-gray opacity-20 text-xs pointer-events-none z-0">+</div>
      <div className="fixed top-4 right-4 text-ink-gray opacity-20 text-xs pointer-events-none z-0">+</div>
      <div className="fixed bottom-4 left-4 text-ink-gray opacity-20 text-xs pointer-events-none z-0">+</div>
      <div className="fixed bottom-4 right-4 text-ink-gray opacity-20 text-xs pointer-events-none z-0">+</div>
    </div>
  );
}
