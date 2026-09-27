import NextLink from "next/link";

import { cn } from "@/lib/utils";

export type LogoProps = {
  tone?: "light" | "dark";
};

function Logo({ tone = "light" }: LogoProps) {
  return (
    <NextLink
      href="/"
      className="flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span
        aria-hidden
        className="flex size-8.5 items-center justify-center rounded-lg bg-primary tabletime-text-base font-bold text-primary-foreground"
      >
        T
      </span>
      <span
        className={cn(
          "tabletime-text-h3 font-bold",
          tone === "light" ? "text-foreground" : "text-background",
        )}
      >
        TableTime
      </span>
    </NextLink>
  );
}

export default Logo;
export { Logo };
