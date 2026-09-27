import type { ReactNode } from "react";

import CodeBlock from "./CodeBlock";

export type ShowcaseExampleProps = {
  label: string;
  code: string;
  children: ReactNode;
};

function ShowcaseExample({ label, code, children }: ShowcaseExampleProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <p className="tabletime-text-label text-muted-foreground">{label}</p>
      <div className="flex min-h-12 flex-wrap items-center gap-3">
        {children}
      </div>
      <CodeBlock>{code}</CodeBlock>
    </div>
  );
}

export default ShowcaseExample;
export { ShowcaseExample };
