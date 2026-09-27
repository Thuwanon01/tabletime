import type { ComponentProps } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full tabletime-text-label font-bold whitespace-nowrap",
  {
    variants: {
      variant: {
        contained: "border border-transparent",
        outlined: "border",
      },
      color: {
        primary: "",
        accent: "",
        success: "",
        error: "",
        gray: "",
      },
      size: {
        medium: "px-2.5 py-0.5",
        large: "px-3.5 py-1 text-[0.8rem]",
      },
    },
    defaultVariants: {
      variant: "contained",
      color: "primary",
      size: "medium",
    },
    compoundVariants: [
      {
        variant: "contained",
        color: "primary",
        className: "bg-primary-subtle text-primary",
      },
      {
        variant: "contained",
        color: "accent",
        className: "bg-accent-subtle text-accent-strong",
      },
      {
        variant: "contained",
        color: "success",
        className: "bg-success-subtle text-success",
      },
      {
        variant: "contained",
        color: "error",
        className: "bg-destructive-subtle text-destructive-strong",
      },
      {
        variant: "contained",
        color: "gray",
        className: "bg-secondary text-secondary-foreground",
      },
      {
        variant: "outlined",
        color: "primary",
        className: "bg-card border-primary text-primary",
      },
      {
        variant: "outlined",
        color: "accent",
        className: "bg-card border-accent text-accent-strong",
      },
      {
        variant: "outlined",
        color: "success",
        className: "bg-card border-success text-success",
      },
      {
        variant: "outlined",
        color: "error",
        className: "bg-card border-destructive text-destructive-strong",
      },
      {
        variant: "outlined",
        color: "gray",
        className: "bg-card border-border text-secondary-foreground",
      },
    ],
  },
);

export type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

function Badge({
  className,
  variant = "contained",
  size = "medium",
  color = "primary",
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, color, className }))}
      {...props}
    />
  );
}

export default Badge;
export { Badge, badgeVariants };
