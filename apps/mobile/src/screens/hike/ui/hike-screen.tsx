// 첫 화면 — 산행 중이 아니면 [산행 시작], 산행 중이면 지나온 길과 [산행 종료].
import type { NaverMapViewRef } from '@mj-studio/react-native-naver-map';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppText, BigButton, Screen } from '@/components';
import { formatDistance, formatDuration } from '@/lib/format';
import { pathDistanceMeters } from '@/lib/geo';
import { fontSize, palette, radius, spacing } from '@/theme';

import { resumeHikeIfInterrupted } from '../commands/resume-hike.command';
import { startHike } from '../commands/start-hike.command';
import { stopHike } from '../commands/stop-hike.command';
import { activeHikeQueryOptions } from '../queries/active-hike.query';
import { HikeMap } from './hike-map';

/** 산행 중 지도 선을 다시 읽는 주기 — 위치는 5초마다 들어온다 */
const REFRESH_MS = 3000;

export const HikeScreen = () => {
  const router = useRouter();
  const mapRef = useRef<NaverMapViewRef>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const hikeQuery = useQuery({ ...activeHikeQueryOptions(), refetchInterval: REFRESH_MS });
  const hike = hikeQuery.data ?? null;

  useEffect(() => {
    void resumeHikeIfInterrupted().then((result) => {
      if (result.isErr()) Alert.alert('알림', result.error);
    });
  }, []);

  // 걸은 시간 표시를 30초마다 갱신한다.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  async function handleMapReady() {
    // 지도가 뜨면 바로 내 위치를 따라가게 한다. 권한이 없으면 산행 시작 때 다시 묻는다.
    const { granted } = await Location.getForegroundPermissionsAsync();
    if (granted) mapRef.current?.setLocationTrackingMode('Follow');
  }

  async function handleStart() {
    setBusy(true);
    const result = await startHike();
    setBusy(false);
    if (result.isErr()) {
      Alert.alert('산행을 시작하지 못했습니다', result.error);
      return;
    }
    mapRef.current?.setLocationTrackingMode('Follow');
  }

  function handleStop() {
    Alert.alert('산행을 끝낼까요?', '지금까지 걸은 길이 기록에 저장됩니다.', [
      { text: '계속 걷기', style: 'cancel' },
      { text: '산행 끝내기', style: 'destructive', onPress: () => void confirmStop() },
    ]);
  }

  async function confirmStop() {
    setBusy(true);
    const result = await stopHike();
    setBusy(false);
    if (result.isOk() && !result.value.saved) {
      Alert.alert('저장할 길이 없습니다', '위치가 한 번도 잡히지 않아 기록을 남기지 못했습니다.');
    }
  }

  if (hikeQuery.isPending) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator size="large" color={palette.ink} />
      </Screen>
    );
  }

  const hiking = hike !== null;

  return (
    <Screen>
      <View style={styles.mapWrap}>
        <HikeMap ref={mapRef} points={hike?.points ?? []} onReady={() => void handleMapReady()} />
        <Pressable
          onPress={() => mapRef.current?.setLocationTrackingMode('Follow')}
          style={({ pressed }) => [styles.myLocation, pressed && styles.myLocationPressed]}
        >
          <AppText weight="bold" fontSize={fontSize.body}>
            내 위치
          </AppText>
        </Pressable>
      </View>

      <View style={styles.panel}>
        {hiking ? (
          <>
            <AppText weight="extrabold" fontSize={fontSize.title} color={palette.start}>
              산행 기록 중
            </AppText>
            <View style={styles.stats}>
              <Stat label="걸은 시간" value={formatDuration(new Date(hike.startedAt), now)} />
              <Stat label="걸은 거리" value={formatDistance(pathDistanceMeters(hike.points))} />
            </View>
            <BigButton label="산행 종료" tone="stop" loading={busy} onPress={handleStop} />
          </>
        ) : (
          <>
            <BigButton label="산행 시작" tone="start" loading={busy} onPress={() => void handleStart()} />
            <BigButton label="지난 기록 보기" size="medium" onPress={() => router.push('/records')} />
          </>
        )}
      </View>
    </Screen>
  );
};

interface StatProps {
  label: string;
  value: string;
}

const Stat = ({ label, value }: StatProps) => (
  <View style={styles.stat}>
    <AppText fontSize={fontSize.body} color={palette.ink2}>
      {label}
    </AppText>
    <AppText weight="extrabold" fontSize={fontSize.title}>
      {value}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  mapWrap: { flex: 1 },
  myLocation: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.button,
    backgroundColor: palette.white,
    borderWidth: 2,
    borderColor: palette.ink2,
  },
  myLocationPressed: { backgroundColor: palette.line },
  panel: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 18,
    paddingBottom: 10,
    gap: spacing.gap,
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  stats: { flexDirection: 'row', gap: spacing.gap },
  stat: { flex: 1, gap: 2 },
});
