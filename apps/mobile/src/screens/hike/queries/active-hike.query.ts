// 키 계약: ['active-hike'] — 산행 시작·종료 command가 무효화한다.
import { queryOptions } from '@tanstack/react-query';

import { readJson } from '@/lib/json-store';

import { ACTIVE_HIKE_FILE, type ActiveHike } from './hike-files';

export function activeHikeQueryOptions() {
  return queryOptions({
    queryKey: ['active-hike'],
    queryFn: () => readJson(ACTIVE_HIKE_FILE) as ActiveHike | null,
  });
}
