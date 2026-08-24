import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { MainLayout } from '../app/layouts/MainLayout';

describe('MainLayout', () => {
  it('renders a thin icon navigation without branding text', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Commute Planner')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Plan your daily commute'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Transport')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Notifications' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('link', { name: 'Notifications' })).toHaveAttribute(
      'href',
      '/notifications',
    );
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/settings',
    );
  });
});
