"use client";

import { usePathname } from "next/navigation";

import { Link } from "@/components/bases";
import { cn } from "@/lib/utils";

import { NAV_LINKS, isActivePath, type NavItem } from "./navConfig";

export type NavLinksProps = {
  links?: NavItem[];
  orientation?: "row" | "column";
  label?: string;
  onNavigate?: () => void;
};

function NavLinks({
  links = NAV_LINKS,
  orientation = "row",
  label = "Main",
  onNavigate,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={label}
      className={cn(
        "flex",
        orientation === "row" ? "items-center gap-1" : "flex-col gap-0.5",
      )}
    >
      {links.map(({ label, href }) => {
        const active = isActivePath(pathname, href);

        return (
          <Link
            key={href}
            href={href}
            color={active ? "primary" : "gray"}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "rounded-lg px-3.5 py-2 font-medium hover:no-underline",
              !active && "text-secondary-foreground hover:bg-muted",
              orientation === "column" && "py-3",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default NavLinks;
export { NavLinks };
