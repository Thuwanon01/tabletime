export type CodeBlockProps = {
  children: string;
};

function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-[0.8125rem] whitespace-pre text-muted-foreground">
      <code>{children}</code>
    </pre>
  );
}

export default CodeBlock;
export { CodeBlock };
