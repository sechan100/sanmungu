// 기록 하나 — 올라온 길을 선으로 보여주고 내 위치를 함께 띄워 그 선을 따라 내려오게 한다.
import type { NaverMapViewRef } from '@mj-studio/react-native-naver-map';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, BigButton, Screen } from '@/components';
import { formatClock, formatDay, formatDistance, formatDuration } from '@/lib/format';
import { pathDistanceMeters, regionFor } from '@/lib/geo';
import { fontSize, palette, spacing } from '@/theme';

import { hikeRecordsQueryOptions } from '../queries/hike-records.query';
import { HikeMap } from './hike-map';

interface RecordScreenProps {
  recordId: string;
}

export const RecordScreen = ({ recordId }: RecordScreenProps) => {
  const router = useRouter();
  const mapRef = useRef<NaverMapViewRef>(null);
  const recordsQuery = useQuery(hikeRecordsQueryOptions());
  const record = recordsQuery.data?.find((r) => r.id === recordId);

  async function handleMapReady() {
    // 내 위치 점만 띄우고 카메라는 경로 전체에 둔다.
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (granted) mapRef.current?.setLocationTrackingMode('NoFollow');
  }

  function showWholeRoute() {
    if (!record) return;
    mapRef.current?.setLocationTrackingMode('NoFollow');
    mapRef.current?.animateRegionTo({ ...regionFor(record.points), duration: 600 });
  }

  if (recordsQuery.isPending) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator size="large" color={palette.ink} />
      </Screen>
    );
  }

  if (!record) {
    return (
      <Screen style={[styles.center, styles.missing]}>
        <AppText fontSize={fontSize.large}>이 기록은 지워졌습니다.</AppText>
        <BigButton label="돌아가기" size="medium" onPress={() => router.back()} />
      </Screen>
    );
  }

  const startedAt = new Date(record.startedAt);

  return (
    <Screen>
      <View style={styles.mapWrap}>
        <HikeMap ref={mapRef} points={record.points} showEnds onReady={() => void handleMapReady()} />
      </View>

      <View style={styles.panel}>
        <AppText weight="extrabold" fontSize={fontSize.large}>
          {formatDay(startedAt)} {formatClock(startedAt)} 출발
        </AppText>
        <AppText fontSize={fontSize.body} color={palette.ink2}>
          {formatDuration(startedAt, new Date(record.endedAt))} · {formatDistance(pathDistanceMeters(record.points))} · 빨간 선이 걸었던 길입니다
        </AppText>
        <View style={styles.row}>
          <BigButton
            label="내 위치"
            size="medium"
            style={styles.flex}
            onPress={() => mapRef.current?.setLocationTrackingMode('Follow')}
          />
          <BigButton label="전체 길" size="medium" style={styles.flex} onPress={showWholeRoute} />
        </View>
        <BigButton label="돌아가기" size="medium" onPress={() => router.back()} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  missing: { gap: 20, paddingHorizontal: spacing.screenX },
  flex: { flex: 1 },
  mapWrap: { flex: 1 },
  panel: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 10,
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  row: { flexDirection: 'row', gap: spacing.gap },
});
