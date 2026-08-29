import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCommuteSettingsStore } from '../../../stores/useCommuteSettingsStore';
import { STATION_OPTIONS } from '../../transport/constants';

const commuteDestinationsSchema = z.object({
  from: z.enum(STATION_OPTIONS),
  to: z.enum(STATION_OPTIONS),
});

type CommuteDestinationsFormValues = z.infer<typeof commuteDestinationsSchema>;

export function CommuteDestinationsForm() {
  const from = useCommuteSettingsStore((state) => state.from);
  const to = useCommuteSettingsStore((state) => state.to);
  const setDestinations = useCommuteSettingsStore((state) => state.setDestinations);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CommuteDestinationsFormValues>({
    resolver: zodResolver(commuteDestinationsSchema),
    defaultValues: {
      from: from as CommuteDestinationsFormValues['from'],
      to: to as CommuteDestinationsFormValues['to'],
    },
  });

  useEffect(() => {
    reset({
      from: from as CommuteDestinationsFormValues['from'],
      to: to as CommuteDestinationsFormValues['to'],
    });
  }, [from, to, reset]);

  const onSubmit = (values: CommuteDestinationsFormValues) => {
    setDestinations(values.from, values.to);
    reset(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Commute destinations</h2>
        <p className="mt-1 text-sm text-slate-600">
          These stops are used automatically on the Transport page.
        </p>
      </div>

      <div>
        <label
          htmlFor="commute-from"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          From
        </label>
        <select
          id="commute-from"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          {...register('from')}
        >
          {STATION_OPTIONS.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
        {errors.from ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.from.message}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="commute-to"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          To
        </label>
        <select
          id="commute-to"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          {...register('to')}
        >
          {STATION_OPTIONS.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
        {errors.to ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.to.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        Save destinations
      </button>
    </form>
  );
}
