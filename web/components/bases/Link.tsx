import type { ComponentProps } from "react";
import NextLink from "next/link";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const linkVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm tabletime-text-sm font-semibold underline-offset-4 outline-none transition-colors hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      color: {
        primary: "text-primary hover:text-primary/90",
        accent: "text-accent-strong hover:text-accent-strong/90",
        error: "text-destructive hover:text-destructive/90",
        gray: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  },
);

export type LinkProps = Omit<ComponentProps<typeof NextLink>, "color"> &
  VariantProps<typeof linkVariants>;

function Link({
  className,
  color = "primary",
  target,
  rel,
  ...props
}: LinkProps) {
  return (
    <NextLink
      data-slot="link"
      className={cn(linkVariants({ color, className }))}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      {...props}
    />
  );
}

export default Link;
export { Link, linkVariants };
