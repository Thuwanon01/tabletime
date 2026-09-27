"use client";

import NextLink from "next/link";
import { ChevronDown, LogOut } from "lucide-react";

import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/bases";

import {
  ACCOUNT_LINKS,
  NAV_LINKS,
  type NavItem,
  type NavbarUser,
} from "./navConfig";

function UserMenuLinks({ links }: { links: NavItem[] }) {
  return (
    <DropdownMenuGroup>
      {links.map(({ label, href, icon: Icon }) => (
        <DropdownMenuLinkItem key={href} render={<NextLink href={href} />}>
          <Icon className="size-4 text-muted-foreground" />
          {label}
        </DropdownMenuLinkItem>
      ))}
    </DropdownMenuGroup>
  );
}

export type UserMenuProps = {
  user: NavbarUser;
};

function UserMenu({ user }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="flex h-11 cursor-pointer items-center gap-2.25 rounded-full border border-transparent py-1 pr-2.5 pl-1 outline-none transition-colors hover:border-border hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-border data-popup-open:bg-muted"
      >
        <Avatar name={user.name} imageUrl={user.imageUrl} />
        <span className="tabletime-text-sm font-medium whitespace-nowrap text-secondary-foreground">
          {user.name}
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="mb-1 border-b border-border px-3 pt-2.5 pb-2">
          <p className="truncate tabletime-text-sm font-semibold text-foreground">
            {user.name}
          </p>
          <p className="truncate tabletime-text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>

        <UserMenuLinks links={NAV_LINKS} />
        <DropdownMenuSeparator />
        <UserMenuLinks links={ACCOUNT_LINKS} />
        <DropdownMenuSeparator />

        {/* TODO: sign out through auth once it is wired up. */}
        <DropdownMenuItem className="text-destructive data-highlighted:bg-destructive-subtle">
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
export { UserMenu };
