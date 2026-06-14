import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

/** Simple max-width wrapper used by every page. */
export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">{children}</div>
  );
}
