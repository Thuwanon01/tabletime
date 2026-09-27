import { Button } from "@/components/bases";

import Logo from "./Logo";
import MobileNav from "./MobileNav";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import type { NavbarUser } from "./navConfig";

export type NavbarProps = {
  user?: NavbarUser | null;
};

function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5">
        <Logo />

        <div className="hidden md:block">
          <NavLinks />
        </div>

        <div className="flex-1" />

        <div className="hidden md:flex">
          {/* TODO: route to the sign-in page once auth is wired up. */}
          {user ? <UserMenu user={user} /> : <Button>Sign in</Button>}
        </div>

        <div className="flex md:hidden">
          <MobileNav user={user} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
export { Navbar };
