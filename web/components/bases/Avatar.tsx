import type { ComponentProps } from "react";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-primary-subtle font-bold text-primary select-none",
  {
    variants: {
      variant: {
        circular: "rounded-full",
      },
      size: {
        small: "size-6 tabletime-text-label",
        medium: "size-8.5 tabletime-text-sm",
        large: "size-16 tabletime-text-h3",
      },
    },
    defaultVariants: {
      variant: "circular",
      size: "medium",
    },
  },
);

const THAI_PATTERN = /[\u0E00-\u0E7F]/;

/**
 * Thai names carry no casing and are rarely spaced, so they fall back to the
 * first two characters. Latin names use the first and last word.
 */
function getInitials(name: string) {
  const trimmed = name.trim();

  if (!trimmed) {
    return "";
  }

  if (THAI_PATTERN.test(trimmed)) {
    return Array.from(trimmed).slice(0, 2).join("");
  }

  const words = trimmed.split(/\s+/);
  const characters =
    words.length > 1
      ? [words[0], words[words.length - 1]].map((word) => Array.from(word)[0])
      : Array.from(words[0]).slice(0, 2);

  return characters.join("").toUpperCase();
}

export type AvatarProps = Omit<
  ComponentProps<typeof AvatarPrimitive.Root>,
  "children"
> &
  VariantProps<typeof avatarVariants> & {
    name: string;
    imageUrl?: string;
  };

function Avatar({
  className,
  variant = "circular",
  size = "medium",
  name,
  imageUrl,
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      role="img"
      aria-label={name}
      className={cn(avatarVariants({ variant, size, className }))}
      {...props}
    >
      {imageUrl ? (
        <AvatarPrimitive.Image
          src={imageUrl}
          alt=""
          className="size-full object-cover"
        />
      ) : null}
      <AvatarPrimitive.Fallback aria-hidden>
        {getInitials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

const avatarGroupVariants = cva(
  "flex items-center [&>*]:ring-2 [&>*]:ring-card",
  {
    variants: {
      spacing: {
        small: "-space-x-2.5",
        medium: "-space-x-1",
      },
    },
    defaultVariants: {
      spacing: "small",
    },
  },
);

export type AvatarGroupProps = Omit<ComponentProps<"div">, "children"> &
  VariantProps<typeof avatarGroupVariants> &
  Pick<VariantProps<typeof avatarVariants>, "variant" | "size"> & {
    avatars: Pick<AvatarProps, "name" | "imageUrl">[];
    max?: number;
  };

function AvatarGroup({
  className,
  variant = "circular",
  size = "medium",
  spacing = "small",
  avatars,
  max,
  ...props
}: AvatarGroupProps) {
  const visible = typeof max === "number" ? avatars.slice(0, max) : avatars;
  const overflow = avatars.length - visible.length;

  return (
    <div
      data-slot="avatar-group"
      role="group"
      className={cn(avatarGroupVariants({ spacing, className }))}
      {...props}
    >
      {visible.map((avatar, index) => (
        <Avatar
          key={`${avatar.name}-${index}`}
          variant={variant}
          size={size}
          {...avatar}
        />
      ))}
      {overflow > 0 ? (
        <span
          data-slot="avatar-group-overflow"
          aria-label={`${overflow} more`}
          className={cn(
            avatarVariants({ variant, size }),
            "bg-secondary text-secondary-foreground",
          )}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}

export default Avatar;
export { Avatar, AvatarGroup, avatarVariants, avatarGroupVariants };
