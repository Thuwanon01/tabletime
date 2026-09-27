import type { ReactNode } from "react";

export type ShowcaseSectionProps = {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
};

function ShowcaseSection({
  id,
  title,
  description,
  children,
}: ShowcaseSectionProps) {
  return (
    <section id={id} className="flex scroll-mt-8 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="tabletime-text-h2 text-foreground">{title}</h2>
        {description ? (
          <p className="tabletime-text-body text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default ShowcaseSection;
export { ShowcaseSection };
