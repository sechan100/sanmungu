// 이 영역이 읽고 쓰는 파일 두 개와 그 모양. 파일 이름이 저장 계약이다 — 바꾸면 기존 기록을 못 읽는다.
export const ACTIVE_HIKE_FILE = 'active-hike.json';
export const HIKE_RECORDS_FILE = 'hike-records.json';

export type TrackPoint = {
  latitude: number;
  longitude: number;
  /** 해발 고도(m) — 기기가 못 주면 null */
  altitude: number | null;
  /** ISO(UTC) */
  recordedAt: string;
};

/** 산행 중인 경로 — 파일이 있으면 산행 중이다 */
export type ActiveHike = {
  startedAt: string;
  points: TrackPoint[];
};

export type HikeRecord = {
  id: string;
  startedAt: string;
  endedAt: string;
  points: TrackPoint[];
};
