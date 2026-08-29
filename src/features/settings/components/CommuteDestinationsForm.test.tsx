import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_COMMUTE_FROM,
  DEFAULT_COMMUTE_TO,
} from '../../transport/constants';
import { useCommuteSettingsStore } from '../../../stores/useCommuteSettingsStore';
import { CommuteDestinationsForm } from './CommuteDestinationsForm';

describe('CommuteDestinationsForm', () => {
  beforeEach(() => {
    localStorage.clear();
    useCommuteSettingsStore.setState({
      from: DEFAULT_COMMUTE_FROM,
      to: DEFAULT_COMMUTE_TO,
    });
  });

  it('defaults the selects to the currently stored destinations', () => {
    render(<CommuteDestinationsForm />);

    expect(screen.getByLabelText('From')).toHaveValue(DEFAULT_COMMUTE_FROM);
    expect(screen.getByLabelText('To')).toHaveValue(DEFAULT_COMMUTE_TO);
  });

  it('saves from and to destinations to the commute settings store', async () => {
    const user = userEvent.setup();
    render(<CommuteDestinationsForm />);

    const fromSelect = screen.getByLabelText('From');
    const toSelect = screen.getByLabelText('To');

    await user.selectOptions(fromSelect, 'Rüttenscheider Stern, Essen');
    await user.selectOptions(toSelect, 'Mülheim Hbf, Mülheim a.d. Ruhr');
    await user.click(screen.getByRole('button', { name: 'Save destinations' }));

    expect(useCommuteSettingsStore.getState().from).toBe(
      'Rüttenscheider Stern, Essen',
    );
    expect(useCommuteSettingsStore.getState().to).toBe(
      'Mülheim Hbf, Mülheim a.d. Ruhr',
    );
  });
});
