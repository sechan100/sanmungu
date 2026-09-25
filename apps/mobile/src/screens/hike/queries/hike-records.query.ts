// 키 계약: ['hike-records'] — 산행 종료 command가 무효화한다.
import { queryOptions } from '@tanstack/react-query';

import { readJson } from '@/lib/json-store';

import { HIKE_RECORDS_FILE, type HikeRecord } from './hike-files';

export function hikeRecordsQueryOptions() {
  return queryOptions({
    queryKey: ['hike-records'],
    queryFn: () => (readJson(HIKE_RECORDS_FILE) as HikeRecord[] | null) ?? [],
  });
}
