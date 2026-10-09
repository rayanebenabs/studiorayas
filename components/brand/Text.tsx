import type { ElementType, HTMLAttributes } from "react";

interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

/** Étiquette en capitales espacées. */
export function Eyebrow({ as: Tag = "p", className = "", ...rest }: EyebrowProps) {
  return <Tag className={`sr-eyebrow ${className}`.trim()} {...rest} />;
}

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3;
  display?: boolean;
}

export function Heading({ level = 2, display = false, className = "", ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  const base = display ? "sr-display" : `sr-h${level}`;
  return <Tag className={`${base} ${className}`.trim()} {...rest} />;
}
