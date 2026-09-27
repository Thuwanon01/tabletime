"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";

import { Avatar, Button } from "@/components/bases";

import NavLinks from "./NavLinks";
import { ACCOUNT_LINKS, type NavbarUser } from "./navConfig";

const iconButtonClassName =
  "p-0 border-border text-foreground hover:border-border hover:bg-muted";

export type MobileNavProps = {
  user?: NavbarUser | null;
};

function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open menu"
        render={
          <Button
            variant="outlined"
            color="gray"
            className={`size-9.5 ${iconButtonClassName}`}
          />
        }
      >
        <Menu className="size-4.5" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/40 transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0 md:hidden" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-4/5 max-w-80 flex-col overflow-y-auto bg-card p-5 shadow-xl outline-none transition-transform duration-200 ease-out data-starting-style:translate-x-full data-ending-style:translate-x-full md:hidden">
          <div className="mb-5.5 flex items-center justify-between">
            <Dialog.Title className="tabletime-text-h3 font-bold text-foreground">
              Menu
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close menu"
              render={
                <Button
                  variant="outlined"
                  color="gray"
                  className={`size-8 ${iconButtonClassName}`}
                />
              }
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <NavLinks orientation="column" onNavigate={close} />

          <div className="my-4 h-px bg-border" />

          {user ? (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2.5 px-2.5 pt-2 pb-3.5">
                <Avatar name={user.name} imageUrl={user.imageUrl} />
                <div className="min-w-0">
                  <p className="truncate tabletime-text-sm font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate tabletime-text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <NavLinks
                links={ACCOUNT_LINKS}
                orientation="column"
                label="Account"
                onNavigate={close}
              />

              {/* TODO: sign out through auth once it is wired up. */}
              <button
                type="button"
                onClick={close}
                className="cursor-pointer rounded-lg px-3.5 py-3 text-left tabletime-text-sm font-semibold text-destructive transition-colors hover:bg-destructive-subtle"
              >
                Sign out
              </button>
            </div>
          ) : (
            // TODO: route to the sign-in page once auth is wired up.
            <Button size="large" onClick={close}>
              Sign in
            </Button>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default MobileNav;
export { MobileNav };
