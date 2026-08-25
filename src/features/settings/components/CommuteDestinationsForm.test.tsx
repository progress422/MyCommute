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

  it('saves from and to destinations to the commute settings store', async () => {
    const user = userEvent.setup();
    render(<CommuteDestinationsForm />);

    const fromInput = screen.getByLabelText('From');
    const toInput = screen.getByLabelText('To');

    await user.clear(fromInput);
    await user.type(fromInput, 'Essen Hbf');
    await user.clear(toInput);
    await user.type(toInput, 'Düsseldorf Hbf');
    await user.click(screen.getByRole('button', { name: 'Save destinations' }));

    expect(useCommuteSettingsStore.getState().from).toBe('Essen Hbf');
    expect(useCommuteSettingsStore.getState().to).toBe('Düsseldorf Hbf');
  });
});
