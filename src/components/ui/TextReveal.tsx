import { ReactNode } from "react";
import { useTextReveal } from "../../hooks/useTextReveal";

interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
}

/**
 * TextReveal - Component that animates text based on scroll position.
 * Words fade in as they approach viewport center and fade out as they pass.
 */
export function TextReveal({ 
  children, 
  as: Component = "h1", 
  className = "" 
}: TextRevealProps) {
  const { containerRef, words } = useTextReveal(children);

  return (
    <Component ref={containerRef as any} className={className}>
      {words.map((item, index) => (
        <span
          key={index}
          className={`text-reveal-word ${item.state}`}
        >
          {item.word}
          {index < words.length - 1 && " "}
        </span>
      ))}
    </Component>
  );
}

export default TextReveal;
