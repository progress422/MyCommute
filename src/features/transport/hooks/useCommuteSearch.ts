import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCommuteWithTimetables } from '../../../shared/api/transportApi';
import type { CommuteSearchParams } from '../../../shared/types';

export function useCommuteSearch(
  params: CommuteSearchParams,
  options?: { enabled?: boolean },
) {
  const from = params.from.trim();
  const to = params.to.trim();
  const departureTime = params.departureTime;
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ['commute', from, to, departureTime],
    queryFn: () =>
      getCommuteWithTimetables({
        from,
        to,
        departureTime,
      }),
    enabled: enabled && from.length > 0 && to.length > 0,
    placeholderData: keepPreviousData,
  });
}
