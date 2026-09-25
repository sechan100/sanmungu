// 지난 기록 목록 — 최근 산행이 위. 누르면 그 길을 지도로 본다.
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText, BigButton, Screen } from '@/components';
import { formatClock, formatDay, formatDistance, formatDuration } from '@/lib/format';
import { pathDistanceMeters } from '@/lib/geo';
import { fontSize, palette, radius, spacing } from '@/theme';

import type { HikeRecord } from '../queries/hike-files';
import { hikeRecordsQueryOptions } from '../queries/hike-records.query';

export const RecordsScreen = () => {
  const router = useRouter();
  const recordsQuery = useQuery(hikeRecordsQueryOptions());

  return (
    <Screen>
      <View style={styles.header}>
        <AppText weight="extrabold" fontSize={fontSize.title}>
          지난 기록
        </AppText>
        <AppText fontSize={fontSize.body} color={palette.ink2}>
          최근 산행 10개까지 보관합니다.
        </AppText>
      </View>

      {recordsQuery.isPending ? (
        <ActivityIndicator size="large" color={palette.ink} style={styles.flex} />
      ) : (
        <FlatList
          style={styles.flex}
          contentContainerStyle={styles.list}
          data={recordsQuery.data ?? []}
          keyExtractor={(record) => record.id}
          renderItem={({ item }) => (
            <RecordCard record={item} onPress={() => router.push(`/records/${encodeURIComponent(item.id)}`)} />
          )}
          ListEmptyComponent={
            <AppText fontSize={fontSize.large} color={palette.ink2} style={styles.empty}>
              아직 기록이 없습니다.{'\n'}산행을 시작하면 이곳에 저장됩니다.
            </AppText>
          }
        />
      )}

      <View style={styles.footer}>
        <BigButton label="처음 화면으로" size="medium" onPress={() => router.back()} />
      </View>
    </Screen>
  );
};

interface RecordCardProps {
  record: HikeRecord;
  onPress: () => void;
}

const RecordCard = ({ record, onPress }: RecordCardProps) => {
  const startedAt = new Date(record.startedAt);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <AppText weight="extrabold" fontSize={fontSize.large}>
        {formatDay(startedAt)}
      </AppText>
      <AppText fontSize={fontSize.body} color={palette.ink2}>
        {formatClock(startedAt)} 출발
      </AppText>
      <AppText weight="bold" fontSize={fontSize.body}>
        {formatDuration(startedAt, new Date(record.endedAt))} · {formatDistance(pathDistanceMeters(record.points))}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: spacing.screenX, paddingTop: 16, paddingBottom: 12, gap: 4 },
  list: { paddingHorizontal: spacing.screenX, paddingBottom: 16, gap: spacing.gap },
  empty: { textAlign: 'center', marginTop: 60, lineHeight: 36 },
  card: {
    padding: 20,
    gap: 6,
    borderRadius: radius.card,
    backgroundColor: palette.white,
    borderWidth: 2,
    borderColor: palette.line,
  },
  cardPressed: { backgroundColor: palette.line },
  footer: { paddingHorizontal: spacing.screenX, paddingTop: 8, paddingBottom: 10 },
});
