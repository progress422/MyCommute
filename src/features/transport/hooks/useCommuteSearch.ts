import { useMutation } from '@tanstack/react-query';
import { getCommuteWithTimetables } from '../../../shared/api/transportApi';
import type { CommuteSearchParams } from '../../../shared/types';

export function useCommuteSearch() {
  return useMutation({
    mutationFn: (params: CommuteSearchParams) =>
      getCommuteWithTimetables(params),
  });
}
