'use client';

import { useState } from 'react';
import { HomePage } from "@/components/HomePage";
import { IslandScene } from "@/components/IslandScene";

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <main className="w-full h-screen">
      {!hasEntered && (
        <HomePage onEnter={() => setHasEntered(true)} />
      )}
      {hasEntered && (
        <IslandScene />
      )}
    </main>
  );
}
