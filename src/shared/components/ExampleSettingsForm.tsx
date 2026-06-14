import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

/**
 * Example schema for the settings form demo.
 * Real settings validation will live in `features/settings/schemas/`.
 */
const exampleSettingsSchema = z.object({
  departureLocation: z
    .string()
    .trim()
    .min(1, 'Departure location is required'),
  destination: z.string().trim().min(1, 'Destination is required'),
});

type ExampleSettingsFormValues = z.infer<typeof exampleSettingsSchema>;

/**
 * Demonstrates React Hook Form + Zod validation.
 *
 * TODO: Replace with real settings form in `features/settings/`.
 * TODO: Persist values via a Zustand store or API — not implemented here.
 * TODO: Pre-fill fields from saved user preferences.
 */
export function ExampleSettingsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExampleSettingsFormValues>({
    resolver: zodResolver(exampleSettingsSchema),
    defaultValues: {
      departureLocation: '',
      destination: '',
    },
  });

  const onSubmit = (values: ExampleSettingsFormValues) => {
    // TODO: Call settings save action / mutation when persistence is implemented.
    console.log('Example form submitted (not persisted):', values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4"
      noValidate
    >
      <h2 className="text-lg font-medium text-slate-900">
        Example Settings Form
      </h2>
      <p className="text-sm text-slate-600">
        Demonstrates form state and validation only. Submissions are logged to
        the console and not saved.
      </p>

      <div>
        <label
          htmlFor="departureLocation"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Departure location
        </label>
        <input
          id="departureLocation"
          type="text"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="e.g. Central Station"
          {...register('departureLocation')}
        />
        {errors.departureLocation ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.departureLocation.message}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="destination"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Destination
        </label>
        <input
          id="destination"
          type="text"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="e.g. Office Park"
          {...register('destination')}
        />
        {errors.destination ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.destination.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Save (demo only)
      </button>
    </form>
  );
}
