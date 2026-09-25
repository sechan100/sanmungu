import { ok, type Result } from 'neverthrow';

import { deleteJson, readJson, withStoreLock, writeJson } from '@/lib/json-store';
import { queryClient } from '@/lib/query';

import {
  ACTIVE_HIKE_FILE,
  HIKE_RECORDS_FILE,
  type ActiveHike,
  type HikeRecord,
} from '../queries/hike-files';
import { stopTracking } from './location-tracking.service';

/** 보관하는 기록 수 — 넘으면 가장 오래된 것부터 지운다 */
const MAX_RECORDS = 10;

type StopHikeOutcome = { saved: true } | { saved: false };

export async function stopHike(): Promise<Result<StopHikeOutcome, string>> {
  await stopTracking();

  const saved = await withStoreLock(() => {
    const hike = readJson(ACTIVE_HIKE_FILE) as ActiveHike | null;
    deleteJson(ACTIVE_HIKE_FILE);
    // 위치가 한 번도 잡히지 않았으면 남길 경로가 없다.
    if (!hike || hike.points.length === 0) return false;

    const record: HikeRecord = {
      id: hike.startedAt,
      startedAt: hike.startedAt,
      endedAt: new Date().toISOString(),
      points: hike.points,
    };
    const records = (readJson(HIKE_RECORDS_FILE) as HikeRecord[] | null) ?? [];
    writeJson(HIKE_RECORDS_FILE, [record, ...records].slice(0, MAX_RECORDS));
    return true;
  });

  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['active-hike'] }),
    queryClient.invalidateQueries({ queryKey: ['hike-records'] }),
  ]);
  return ok({ saved });
}
