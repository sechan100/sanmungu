// 산행 중에 휴대폰이 재부팅되거나 앱이 강제 종료되면 산행 파일은 남고 위치 추적만 멈춘다.
// 앱을 다시 열었을 때 추적을 이어 붙여 "시작했으면 끝날 때까지 기록된다"를 지킨다.
import { ok, type Result } from 'neverthrow';

import { readJson } from '@/lib/json-store';

import { ACTIVE_HIKE_FILE } from '../queries/hike-files';
import { isTracking, requestLocationPermission, startTracking } from './location-tracking.service';

export async function resumeHikeIfInterrupted(): Promise<Result<void, string>> {
  if (readJson(ACTIVE_HIKE_FILE) === null) return ok(undefined);
  if (await isTracking()) return ok(undefined);

  const permission = await requestLocationPermission();
  if (permission.isErr()) return permission;
  return startTracking();
}
