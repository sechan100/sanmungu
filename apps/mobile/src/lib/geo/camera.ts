type Coord = { latitude: number; longitude: number };

/** 좌표 전체를 감싸는 영역 + 여백 — 지도 animateRegionTo·initialRegion 입력 */
export function regionFor(coords: readonly Coord[]) {
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  // 경로가 점 하나여도 너무 확대되지 않게 최소 폭을 둔다(약 300m).
  const latDelta = Math.max((maxLat - minLat) * 1.4, 0.003);
  const lngDelta = Math.max((maxLng - minLng) * 1.4, 0.003);
  return {
    latitude: (minLat + maxLat) / 2 - latDelta / 2,
    longitude: (minLng + maxLng) / 2 - lngDelta / 2,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}
