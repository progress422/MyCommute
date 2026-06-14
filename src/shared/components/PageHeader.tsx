interface PageHeaderProps {
  title: string;
  description?: string;
}

/** Reusable page title block. */
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {description ? (
        <p className="mt-2 text-slate-600">{description}</p>
      ) : null}
    </header>
  );
}
