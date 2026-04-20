import React, { createContext, useContext, useMemo, useState, useRef, useCallback } from "react";
import SpinnerElement from "../components/Main/SpinnerElement.tsx";

// Define the interface for better TS support
interface LoadingContextType {
  loading: boolean;
  show: () => void;
  hide: () => void;
  set: (v: boolean) => void;
  withLoader: <T>(promiseOrFn: Promise<T> | (() => Promise<T>)) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const counterRef = useRef(0);
  const [loading, setLoading] = useState(false);

  // Optimized: Removed 'loading' dependency by using functional updates
  // This keeps the function identity stable across renders
  const show = useCallback(() => {
    counterRef.current += 1;
    setLoading(true);
  }, []);

  const hide = useCallback(() => {
    counterRef.current = Math.max(0, counterRef.current - 1);
    if (counterRef.current === 0) {
      setLoading(false);
    }
  }, []);

  const set = useCallback((v: boolean) => {
    counterRef.current = v ? 1 : 0;
    setLoading(v);
  }, []);

  const withLoader = useCallback(
    async <T,>(promiseOrFn: Promise<T> | (() => Promise<T>)): Promise<T> => {
      show();
      try {
        const p = typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn;
        return await p;
      } finally {
        hide();
      }
    },
    [show, hide],
  );

  const value = useMemo(
    () => ({
      loading,
      show,
      hide,
      set,
      withLoader,
    }),
    [loading, show, hide, set, withLoader],
  );

  return (
    <LoadingContext.Provider value={value}>
      {/* The spinner is rendered here. 
         Because it's absolute/z-500, it will cover the {children} 
      */}
      {loading && <SpinnerElement text={3} />}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used inside <LoadingProvider>");
  return ctx;
}
