import { err, ok, type Result } from 'neverthrow';

import { deleteJson, withStoreLock, writeJson } from '@/lib/json-store';
import { queryClient } from '@/lib/query';

import { ACTIVE_HIKE_FILE, type ActiveHike } from '../queries/hike-files';
import { requestLocationPermission, startTracking } from './location-tracking.service';

export async function startHike(): Promise<Result<void, string>> {
  const permission = await requestLocationPermission();
  if (permission.isErr()) return permission;

  const hike: ActiveHike = { startedAt: new Date().toISOString(), points: [] };
  await withStoreLock(() => writeJson(ACTIVE_HIKE_FILE, hike));

  const tracking = await startTracking();
  if (tracking.isErr()) {
    await withStoreLock(() => deleteJson(ACTIVE_HIKE_FILE));
    await queryClient.invalidateQueries({ queryKey: ['active-hike'] });
    return err(tracking.error);
  }

  await queryClient.invalidateQueries({ queryKey: ['active-hike'] });
  return ok(undefined);
}
