import { House, User, type LucideIcon } from "lucide-react";

export type NavbarUser = {
  name: string;
  email: string;
  imageUrl?: string;
};

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/", icon: House },
];

export const ACCOUNT_LINKS: NavItem[] = [
  { label: "Profile", href: "/profile", icon: User },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
