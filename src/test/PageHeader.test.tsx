import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageHeader } from '../shared/components/PageHeader';

describe('PageHeader', () => {
  it('renders the page title', () => {
    render(
      <PageHeader
        title="Commute Planner"
        description="Plan your daily commute"
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Commute Planner' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Plan your daily commute')).toBeInTheDocument();
  });
});
