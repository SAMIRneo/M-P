"use client";

import { useState, useEffect } from "react";

interface TypingEffectProps {
  text: string;
  speed?: number;
  cursorInterval?: number;
}

export function TypingEffect({ 
  text, 
  speed = 40, 
  cursorInterval = 530 
}: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    const cursorInt = setInterval(() => {
      setCursorVisible((v) => !v);
    }, cursorInterval);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInt);
    };
  }, [text, speed, cursorInterval]);

  return (
    <span>
      {displayedText}
      <span
        className="inline-block w-[2px] h-[1em] ml-1 align-middle"
        style={{ 
          background: "var(--ink-black)",
          opacity: cursorVisible ? 1 : 0 
        }}
      />
    </span>
  );
}
