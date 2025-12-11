import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions extends IntersectionObserverInit {
  /** Once true, element stays visible (default: true) */
  once?: boolean;
}

/**
 * Hook for scroll-triggered reveal animations using Intersection Observer.
 * Returns a ref to attach to the element and a boolean indicating visibility.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const { once = true, threshold = 0.1, rootMargin = "0px 0px -50px 0px", ...rest } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin, ...rest }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return { ref, isVisible };
}

export default useScrollReveal;
