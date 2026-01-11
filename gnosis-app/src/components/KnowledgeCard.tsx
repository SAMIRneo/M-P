"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, BookOpen, Code2, Link2, ChevronUp, Hash, ArrowRight } from "lucide-react";
import { createPortal } from "react-dom";
import { categories, CategoryConfig } from "@/data/knowledgeCards";

export interface KnowledgeCardData {
  id: number;
  title: string;
  emoji: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
  codeExample?: string;
  links?: { label: string; url: string }[];
}

interface KnowledgeCardProps {
  card: KnowledgeCardData;
  index: number;
}

// Comic colors mapping
const comicColors: Record<string, { bg: string; accent: string }> = {
  "crypto": { bg: "#c41e3a", accent: "#f4d03f" },
  "physics": { bg: "#1e3a5f", accent: "#0891b2" },
  "tech": { bg: "#2d5016", accent: "#84cc16" },
  "esoteric": { bg: "#6b3fa0", accent: "#d946ef" },
  "politics": { bg: "#e85d04", accent: "#f4d03f" },
  "default": { bg: "#1a1a2e", accent: "#f4d03f" },
};

function getComicColor(category: string) {
  return comicColors[category] || comicColors.default;
}

function ExpandedModal({ card, config, onClose }: { card: KnowledgeCardData; config: CategoryConfig; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const comicColor = {
    bg: config.color,
    accent: config.accent
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const progress = scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(isNaN(progress) ? 0 : Math.min(progress, 1));
    setShowScrollTop(scrollTop > 300);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contentSections = card.content.split('\n\n').filter(Boolean);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop - More vivid comic overlay */}
        <motion.div
          className="absolute inset-0 halftone opacity-20 pointer-events-none"
          style={{ background: "var(--ink-black)" }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: "rgba(0, 0, 0, 0.85)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal - The Comic Book Page */}
        <motion.div
          className="relative w-full max-w-5xl h-[95vh] flex flex-col"
          initial={{ scale: 0.8, y: 100, rotate: -5 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.8, y: 100, rotate: 5 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          {/* Header Action Strip */}
          <div 
            className="flex items-center justify-between px-6 py-4 bg-comic-yellow border-4 border-ink-black shadow-[6px_-6px_0_var(--ink-black)] z-50 relative"
            style={{ transform: 'rotate(-0.5deg) translateY(4px)' }}
          >
            <div className="flex items-center gap-4">
              <span className="font-comic text-3xl text-ink-black drop-shadow-[2px_2px_0_white]">VOL. #1</span>
              <div className="h-8 w-[4px] bg-ink-black" />
              <span className="font-headline text-lg font-black italic tracking-widest">{card.category.toUpperCase()}</span>
            </div>
            <motion.button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center bg-comic-red border-4 border-ink-black shadow-[4px_4px_0_var(--ink-black)]"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-8 h-8 text-white" />
            </motion.button>
          </div>

          <div 
            className="flex-1 overflow-hidden flex flex-col bg-paper-light border-4 border-ink-black shadow-[15px_15px_0_var(--ink-black)] relative"
          >
            {/* Scroll Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-paper-dark z-40">
              <motion.div 
                className="h-full bg-comic-red"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>

            {/* Content Container */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto scrollbar-comic p-6 md:p-12"
              onScroll={handleScroll}
            >
              {/* Splash Header */}
              <div className="mb-16 relative">
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                  {/* Emoji "Avatar" */}
                  <motion.div
                    className="w-40 h-40 md:w-56 md:h-56 flex-shrink-0 flex items-center justify-center text-8xl md:text-9xl relative"
                    initial={{ rotate: -20, scale: 0.5 }}
                    animate={{ rotate: -5, scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-comic-blue border-8 border-ink-black shadow-[10px_10px_0_var(--ink-black)] -rotate-3" />
                    <div className="absolute inset-0 halftone opacity-20" />
                    <span className="relative z-10 drop-shadow-[5px_5px_0_var(--ink-black)]">
                      {card.emoji}
                    </span>
                  </motion.div>

                  {/* Title & Summary */}
                  <div className="flex-1 text-center md:text-left">
                    <motion.div
                      className="inline-block px-4 py-2 bg-comic-pink border-4 border-ink-black shadow-[4px_4px_0_var(--ink-black)] mb-6 -rotate-1"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      <span className="font-comic text-2xl text-white">DOSSIER SPÉCIAL</span>
                    </motion.div>
                    <h2 className="font-comic text-5xl md:text-7xl lg:text-8xl text-ink-black mb-8 leading-none" style={{ textShadow: "6px 6px 0 var(--comic-yellow)" }}>
                      {card.title}
                    </h2>
                    <p className="font-headline text-2xl md:text-3xl text-ink-black/80 italic border-l-8 border-comic-red pl-6 py-2">
                      {card.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-10">
                  {contentSections.map((section, i) => {
                    const isHeader = section === section.toUpperCase() && section.length < 50;
                    
                    if (isHeader) {
                      return (
                        <div key={i} className="relative mt-16 first:mt-0">
                          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-comic-red border-4 border-ink-black rotate-45 z-0" />
                          <h4 className="relative z-10 font-comic text-4xl text-ink-black bg-paper-light border-4 border-ink-black px-6 py-2 shadow-[6px_6px_0_var(--ink-black)] inline-block">
                            {section}
                          </h4>
                        </div>
                      );
                    }

                    return (
                      <p key={i} className="font-body text-xl md:text-2xl text-ink-black leading-relaxed selection:bg-comic-yellow">
                        {section}
                      </p>
                    );
                  })}
                </div>

                {/* Sidebar widgets */}
                <div className="lg:col-span-4 space-y-10">
                  {/* Semantic Tags Box */}
                  <div className="bg-comic-blue border-4 border-ink-black p-6 shadow-[8px_8px_0_var(--ink-black)] rotate-1">
                    <h5 className="font-comic text-2xl text-white mb-4 underline decoration-4 underline-offset-4">TAGS / CLÉS</h5>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-white border-2 border-ink-black font-headline text-sm font-black uppercase shadow-[2px_2px_0_var(--ink-black)]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* External Links Box */}
                  {card.links && card.links.length > 0 && (
                    <div className="bg-comic-green border-4 border-ink-black p-6 shadow-[8px_8px_0_var(--ink-black)] -rotate-1">
                      <h5 className="font-comic text-2xl text-ink-black mb-4">LIENS UTILES</h5>
                      <div className="space-y-4">
                        {card.links.map((link, i) => (
                          <a 
                            key={i} 
                            href={link.url} 
                            target="_blank" 
                            className="flex items-center gap-2 p-3 bg-white border-4 border-ink-black hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0_var(--ink-black)]"
                          >
                            <Link2 className="w-5 h-5" />
                            <span className="font-headline font-bold text-sm uppercase flex-1">{link.label}</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action word decorative */}
                  <div className="py-10 text-center">
                    <span className="action-word text-7xl animate-pulse">BAM!</span>
                  </div>
                </div>
              </div>

              <div className="h-24" />
            </div>
          </div>

          {/* Scroll to top button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                className="absolute bottom-12 right-12 w-20 h-20 flex items-center justify-center bg-comic-yellow border-4 border-ink-black shadow-[8px_8px_0_var(--ink-black)] z-50"
                onClick={scrollToTop}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronUp className="w-10 h-10 text-ink-black" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export function KnowledgeCard({ card, index }: KnowledgeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const config = categories.find(c => c.id === card.category) || categories[0];
  const comicColor = {
    bg: config.color,
    accent: config.accent
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = () => setIsExpanded(true);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: (index % 3) * 0.1,
          type: "spring",
        }}
        className="w-full h-full"
      >
        <motion.div
          ref={cardRef}
          className="relative cursor-pointer focus-comic h-full group"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          tabIndex={0}
          role="button"
          aria-label={`Article: ${card.title}`}
        >
          {/* The Comic Panel Card */}
          <div
            className="h-full relative overflow-hidden flex flex-col bg-paper-light border-4 border-ink-black shadow-[8px_8px_0_var(--ink-black)] group-hover:shadow-[12px_12px_0_var(--ink-black)] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-200"
          >
            {/* Category Header Strip */}
            <div 
              className="p-3 border-b-4 border-ink-black flex items-center justify-between overflow-hidden relative"
              style={{ background: comicColor.bg }}
            >
              <div className="absolute inset-0 halftone opacity-10 pointer-events-none" />
              <span className="relative z-10 font-headline text-xs font-black text-white bg-ink-black px-3 py-1 shadow-[2px_2px_0_white] -rotate-2">
                {card.category.toUpperCase()}
              </span>
              <BookOpen className="w-5 h-5 text-white/50" />
            </div>

            {/* Splash Area */}
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="flex gap-4 mb-6">
                <div 
                  className="w-20 h-20 flex-shrink-0 flex items-center justify-center text-5xl bg-comic-yellow border-4 border-ink-black shadow-[4px_4px_0_var(--ink-black)] rotate-3 group-hover:rotate-0 transition-transform"
                >
                  {card.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-comic text-3xl leading-none text-ink-black group-hover:text-comic-red transition-colors mb-2">
                    {card.title}
                  </h3>
                  <div className="h-1 w-full bg-ink-black/10" />
                </div>
              </div>

              <p className="font-body text-lg text-ink-black/80 font-bold leading-snug line-clamp-3 mb-6">
                {card.summary}
              </p>

              {/* Action area */}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {card.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] font-black uppercase bg-paper-dark px-2 py-0.5 border-2 border-ink-black">
                      {tag}
                    </span>
                  ))}
                </div>
                <motion.div 
                  className="w-10 h-10 flex items-center justify-center bg-comic-yellow border-4 border-ink-black shadow-[3px_3px_0_var(--ink-black)]"
                  animate={{ rotate: isHovered ? 360 : 0 }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </div>
            </div>

            {/* Halftone texture reveal */}
            <div className="absolute inset-0 halftone opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
          </div>
        </motion.div>
      </motion.div>

      {isExpanded && (
        <ExpandedModal 
          card={card} 
          config={config} 
          onClose={() => setIsExpanded(false)} 
        />
      )}
    </>
  );
}
