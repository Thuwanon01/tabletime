import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 font-bold items-center justify-center rounded-lg transition-all",
  {
    variants: {
      variant: {
        contained:
          "border border-transparent disabled:bg-muted disabled:text-muted-foreground/50 disabled:pointer-events-none",
        outlined:
          "border disabled:border-muted disabled:text-muted-foreground/50 disabled:pointer-events-none",
        text: "border border-transparent disabled:text-muted-foreground/50 disabled:pointer-events-none",
      },
      color: {
        primary: "",
        accent: "",
        error: "",
        gray: "",
      },
      size: {
        small: "px-3 py-1 tabletime-text-xs",
        medium: "px-4.5 py-2 tabletime-text-sm",
        large: "px-6 py-2 tabletime-text-base",
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
        className: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      {
        variant: "contained",
        color: "accent",
        className: "bg-accent text-accent-foreground hover:bg-accent/90",
      },
      {
        variant: "contained",
        color: "error",
        className:
          "bg-destructive text-primary-foreground hover:bg-destructive/90",
      },
      {
        variant: "contained",
        color: "gray",
        className:
          "bg-muted-foreground text-primary-foreground hover:bg-muted-foreground/90",
      },
      {
        variant: "outlined",
        color: "primary",
        className:
          "border-primary text-primary hover:border-primary/90 hover:bg-primary/10",
      },
      {
        variant: "outlined",
        color: "accent",
        className:
          "border-accent text-accent hover:border-accent/90 hover:bg-accent/10",
      },
      {
        variant: "outlined",
        color: "error",
        className:
          "border-destructive text-destructive hover:border-destructive/90 hover:bg-destructive/10",
      },
      {
        variant: "outlined",
        color: "gray",
        className:
          "border-muted-foreground text-muted-foreground hover:border-muted-foreground/90 hover:bg-muted-foreground/10",
      },
      {
        variant: "text",
        color: "primary",
        className: "text-primary hover:bg-primary/10",
      },
      {
        variant: "text",
        color: "accent",
        className: "text-accent-strong hover:bg-accent/10",
      },
      {
        variant: "text",
        color: "error",
        className: "text-destructive hover:bg-destructive/10",
      },
      {
        variant: "text",
        color: "gray",
        className: "text-muted-foreground hover:bg-muted-foreground/10",
      },
    ],
  },
);

export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

function Button({
  className,
  variant = "contained",
  size = "medium",
  color = "primary",
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, color, className }))}
      {...props}
      disabled={loading || props.disabled}
    >
      {loading ? <p>Loading...</p> : props.children}
    </ButtonPrimitive>
  );
}

export default Button;
export { Button, buttonVariants };
