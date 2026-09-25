// 위치 추적 — 화면이 꺼져도 좌표를 받도록 Android 포그라운드 서비스(알림 고정)로 돈다.
// 포그라운드 서비스는 "앱 사용 중에만 허용" 권한만으로 동작하므로 "항상 허용"을 묻지 않는다.
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { err, ok, type Result } from 'neverthrow';

import { readJson, withStoreLock, writeJson } from '@/lib/json-store';

import { ACTIVE_HIKE_FILE, type ActiveHike, type TrackPoint } from '../queries/hike-files';

const LOCATION_TASK = 'hike-location';
/** 이보다 부정확한 좌표는 버린다 — 산속에서 튀는 점이 경로를 지그재그로 만든다 */
const MAX_ACCURACY_M = 40;

type LocationTaskData = { locations: Location.LocationObject[] };

// 작업 정의는 앱 시작 시 모듈 최상단에서 한 번 등록돼야 한다(루트 레이아웃이 이 영역 배럴을 import).
TaskManager.defineTask<LocationTaskData>(LOCATION_TASK, async ({ data, error }) => {
  if (error || !data) return;
  const points: TrackPoint[] = data.locations
    .filter((l) => l.coords.accuracy === null || l.coords.accuracy <= MAX_ACCURACY_M)
    .map((l) => ({
      latitude: l.coords.latitude,
      longitude: l.coords.longitude,
      altitude: l.coords.altitude,
      recordedAt: new Date(l.timestamp).toISOString(),
    }));
  if (points.length === 0) return;

  await withStoreLock(() => {
    const hike = readJson(ACTIVE_HIKE_FILE) as ActiveHike | null;
    // 종료 직후 늦게 도착한 좌표는 버린다 — 산행 파일이 없으면 산행 중이 아니다.
    if (!hike) return;
    writeJson(ACTIVE_HIKE_FILE, { ...hike, points: [...hike.points, ...points] });
  });
});

export async function requestLocationPermission(): Promise<Result<void, string>> {
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) {
    return err('위치 권한이 꺼져 있습니다.\n휴대폰 설정 → 애플리케이션 → 산문구 → 권한에서\n위치를 "앱 사용 중에만 허용"으로 바꿔 주세요.');
  }
  return ok(undefined);
}

export async function startTracking(): Promise<Result<void, string>> {
  try {
    if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK)) return ok(undefined);
    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 5000,
      distanceInterval: 5,
      activityType: Location.ActivityType.Fitness,
      pausesUpdatesAutomatically: false,
      foregroundService: {
        notificationTitle: '산행 기록 중',
        notificationBody: '지나온 길을 저장하고 있습니다.',
        killServiceOnDestroy: false,
      },
    });
    return ok(undefined);
  } catch {
    return err('위치 기록을 시작하지 못했습니다.\n휴대폰의 위치(GPS)가 켜져 있는지 확인해 주세요.');
  }
}

export async function stopTracking(): Promise<void> {
  if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK)) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
  }
}

export async function isTracking(): Promise<boolean> {
  return Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
}
