import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { cn } from "@/lib/utils";

export type DropdownMenuProps = MenuPrimitive.Root.Props;

function DropdownMenu(props: DropdownMenuProps) {
  return <MenuPrimitive.Root {...props} />;
}

export type DropdownMenuTriggerProps = MenuPrimitive.Trigger.Props;

function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

export type DropdownMenuContentProps = MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "side" | "align" | "sideOffset">;

function DropdownMenuContent({
  className,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  ...props
}: DropdownMenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50 outline-none"
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "w-53 origin-[var(--transform-origin)] rounded-xl border border-border bg-card p-1.5 shadow-[0_16px_38px_rgba(24,24,27,0.14)] outline-none transition-[transform,opacity] duration-150 ease-out data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0",
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export type DropdownMenuGroupProps = MenuPrimitive.Group.Props;

function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

export type DropdownMenuLabelProps = MenuPrimitive.GroupLabel.Props;

function DropdownMenuLabel({ className, ...props }: DropdownMenuLabelProps) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      className={cn(
        "tabletime-text-label px-3 pt-2.5 pb-2 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

const dropdownMenuItemClassName =
  "tabletime-text-sm flex cursor-pointer items-center gap-2.25 rounded-md px-2.5 py-2.25 text-secondary-foreground outline-none select-none data-highlighted:bg-muted data-disabled:pointer-events-none data-disabled:text-muted-foreground/50";

export type DropdownMenuItemProps = MenuPrimitive.Item.Props;

function DropdownMenuItem({ className, ...props }: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(dropdownMenuItemClassName, className)}
      {...props}
    />
  );
}

export type DropdownMenuLinkItemProps = MenuPrimitive.LinkItem.Props;

/**
 * Navigates instead of running an action. Pass a router link through
 * `render`, e.g. `render={<NextLink href="/restaurants" />}`.
 */
function DropdownMenuLinkItem({
  className,
  ...props
}: DropdownMenuLinkItemProps) {
  return (
    <MenuPrimitive.LinkItem
      data-slot="dropdown-menu-link-item"
      className={cn(dropdownMenuItemClassName, className)}
      {...props}
    />
  );
}

export type DropdownMenuSeparatorProps = MenuPrimitive.Separator.Props;

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("mx-0.5 my-1.25 h-px bg-border", className)}
      {...props}
    />
  );
}

export default DropdownMenu;
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
};
