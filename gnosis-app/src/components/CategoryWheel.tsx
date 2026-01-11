"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { CategoryConfig } from "@/data/knowledgeCards";

interface CategoryWheelProps {
  categories: CategoryConfig[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  cardCounts: Record<string, number>;
}

// Comic colors for categories
const comicColors = [
  { bg: "#c41e3a", border: "#1a1a2e", accent: "#f4d03f" },
  { bg: "#1e3a5f", border: "#1a1a2e", accent: "#0891b2" },
  { bg: "#f4d03f", border: "#1a1a2e", accent: "#c41e3a" },
  { bg: "#2d5016", border: "#1a1a2e", accent: "#84cc16" },
  { bg: "#6b3fa0", border: "#1a1a2e", accent: "#d946ef" },
  { bg: "#e85d04", border: "#1a1a2e", accent: "#f4d03f" },
];

export function CategoryWheel({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  cardCounts 
}: CategoryWheelProps) {
  const filteredCategories = categories.filter(c => c.id !== "all");
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a wheel layout
  const radius = 280; // Desktop radius
  const mobileRadius = 160;
  const [currentRadius, setCurrentRadius] = useState(radius);

  useEffect(() => {
    const handleResize = () => {
      setCurrentRadius(window.innerWidth < 768 ? mobileRadius : radius);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    setRotation(prev => prev + e.deltaY * 0.1);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-hidden touch-none"
      onWheel={handleWheel}
    >
      {/* Background Newspaper Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 halftone" />
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-ink-black -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-ink-black -translate-x-1/2" />
      </div>

      {/* The Wheel */}
      <motion.div 
        className="relative flex items-center justify-center"
        animate={{ rotate: rotation }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      >
        {/* Central Masthead */}
        <div className="absolute z-30" style={{ rotate: -rotation }}>
          <motion.button
            className="relative flex flex-col items-center cursor-pointer"
            onClick={() => onSelectCategory("all")}
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className="px-8 py-4 md:px-12 md:py-6 text-center"
              style={{
                background: selectedCategory === "all" ? "var(--comic-red)" : "var(--paper-light)",
                border: "5px solid var(--ink-black)",
                boxShadow: "10px 10px 0 var(--ink-black)",
              }}
            >
              <div 
                className="font-comic text-4xl md:text-6xl tracking-wide"
                style={{ 
                  color: selectedCategory === "all" ? "var(--comic-yellow)" : "var(--ink-black)",
                  textShadow: selectedCategory === "all" 
                    ? "3px 3px 0 var(--ink-black)" 
                    : "2px 2px 0 var(--comic-yellow)",
                }}
              >
                GNOSIS
              </div>
              <div 
                className="font-serif text-xs md:text-sm italic mt-1"
                style={{ color: selectedCategory === "all" ? "var(--paper-light)" : "var(--ink-gray)" }}
              >
                L&apos;Archive Suprême
              </div>
            </div>
            
            {/* Total count badge */}
            <div 
              className="relative -mt-2 px-6 py-1"
              style={{
                background: "var(--comic-yellow)",
                border: "3px solid var(--ink-black)",
                transform: "rotate(1deg)",
              }}
            >
              <span className="font-headline text-[10px] md:text-xs font-bold text-ink whitespace-nowrap">
                {cardCounts.all} ARTICLES TOTAL
              </span>
            </div>
          </motion.button>
        </div>

        {/* Category Items */}
        {filteredCategories.map((category, index) => {
          const angle = (index / filteredCategories.length) * 360;
          const color = comicColors[index % comicColors.length];
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.div
              key={category.id}
              className="absolute"
              style={{
                rotate: angle,
                x: Math.cos((angle * Math.PI) / 180) * currentRadius,
                y: Math.sin((angle * Math.PI) / 180) * currentRadius,
              }}
            >
              <motion.button
                className="relative flex items-center justify-center p-4 cursor-pointer focus-comic"
                style={{ rotate: -angle - rotation }}
                onClick={() => onSelectCategory(category.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Comic Card */}
                <div
                  className="w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center gap-2 p-2 relative"
                  style={{
                    background: isSelected ? color.bg : "var(--paper-light)",
                    border: "4px solid var(--ink-black)",
                    boxShadow: isSelected 
                      ? `6px 6px 0 ${color.accent}` 
                      : "6px 6px 0 var(--ink-black)",
                    transform: `rotate(${(index % 2 === 0 ? -2 : 2)}deg)`,
                  }}
                >
                  {/* Icon */}
                  <div 
                    className="text-2xl md:text-4xl"
                    style={{
                      filter: isSelected ? "brightness(1.5)" : "none",
                    }}
                  >
                    {category.icon}
                  </div>
                  
                  {/* Label */}
                  <span 
                    className="font-headline text-[10px] md:text-xs font-bold uppercase text-center leading-tight"
                    style={{ color: isSelected ? "var(--paper-light)" : "var(--ink-black)" }}
                  >
                    {category.label}
                  </span>

                  {/* Count badge */}
                  <div 
                    className="absolute -top-3 -right-3 px-2 py-0.5"
                    style={{
                      background: isSelected ? "var(--paper-light)" : color.bg,
                      color: isSelected ? color.bg : "var(--paper-light)",
                      border: "2px solid var(--ink-black)",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {cardCounts[category.id] || 0}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Decorative Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div 
          className="px-6 py-2 stamp"
          style={{ background: "transparent" }}
        >
          <span className="font-marker text-sm md:text-base text-comic-red">
            Faites défiler pour tourner la roue
          </span>
        </div>
      </div>

      {/* Side Decorative elements for contrast */}
      <div className="absolute top-0 left-0 w-24 h-full pointer-events-none border-r-4 border-double border-ink-black opacity-20" />
      <div className="absolute top-0 right-0 w-24 h-full pointer-events-none border-l-4 border-double border-ink-black opacity-20" />
    </div>
  );
}
