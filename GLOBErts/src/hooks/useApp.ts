import { useState, useEffect, useCallback } from 'react';

export function useSystemLoad(initialValue: number = 42) {
  const [systemLoad, setSystemLoad] = useState(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => Math.min(99, Math.max(10, prev + (Math.random() * 10 - 5))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return systemLoad;
}

export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return currentTime;
}

export function useToggle<T>(initialValue: T | null = null) {
  const [value, setValue] = useState<T | null>(initialValue);

  const toggle = useCallback((newValue: T) => {
    setValue(prev => prev === newValue ? null : newValue);
  }, []);

  const reset = useCallback(() => setValue(null), []);

  return [value, toggle, reset] as const;
}
