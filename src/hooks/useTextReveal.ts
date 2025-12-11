import { useEffect, useRef, useState, useCallback } from "react";

interface WordState {
  word: string;
  state: "inactive" | "active" | "past";
}

/**
 * Hook for text reveal animation based on scroll position.
 * Splits text into words and calculates which words should be active
 * based on their position relative to viewport center.
 */
export function useTextReveal(text: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [words, setWords] = useState<WordState[]>(() =>
    text.split(/\s+/).map((word) => ({ word, state: "inactive" as const }))
  );

  const updateWordStates = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;

    // Calculate how far through the viewport the element is
    const elementTop = rect.top;
    const elementBottom = rect.bottom;
    const elementHeight = rect.height;

    // If element is not in view, all words inactive
    if (elementBottom < 0 || elementTop > viewportHeight) {
      setWords((prev) =>
        prev.map((w) => ({ ...w, state: "inactive" as const }))
      );
      return;
    }

    // Calculate progress (0 = just entering, 1 = fully past)
    const progress = Math.max(
      0,
      Math.min(1, (viewportCenter - elementTop) / (elementHeight + viewportHeight / 2))
    );

    // Map progress to active word index
    const totalWords = text.split(/\s+/).length;
    const activeIndex = Math.floor(progress * totalWords * 1.5);

    setWords((prev) =>
      prev.map((w, i) => {
        let state: "inactive" | "active" | "past" = "inactive";
        
        if (i < activeIndex - 2) {
          state = "past";
        } else if (i >= activeIndex - 2 && i <= activeIndex + 1) {
          state = "active";
        } else {
          state = "inactive";
        }
        
        return { ...w, state };
      })
    );
  }, [text]);

  useEffect(() => {
    // Update on scroll
    const handleScroll = () => {
      requestAnimationFrame(updateWordStates);
    };

    // Initial update
    updateWordStates();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [updateWordStates]);

  return { containerRef, words };
}

export default useTextReveal;
