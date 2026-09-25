import { differenceInMinutes, format } from 'date-fns';
import { ko } from 'date-fns/locale';

/** 1234 → "1.2km", 850 → "850m" */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/** 두 시각 사이 → "2시간 5분" / "35분" */
export function formatDuration(from: Date, to: Date): string {
  const minutes = Math.max(0, differenceInMinutes(to, from));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}분`;
  return rest === 0 ? `${hours}시간` : `${hours}시간 ${rest}분`;
}

/** "9월 25일 (목)" — 기기 시간대(한국)로 표시 */
export function formatDay(date: Date): string {
  return format(date, 'M월 d일 (E)', { locale: ko });
}

/** "오전 8시 10분" */
export function formatClock(date: Date): string {
  return format(date, 'a h시 m분', { locale: ko });
}
