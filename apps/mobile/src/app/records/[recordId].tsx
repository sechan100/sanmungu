import { useLocalSearchParams } from 'expo-router';

import { RecordScreen } from '@/screens/hike';

export default function RecordRoute() {
  const { recordId } = useLocalSearchParams<{ recordId: string }>();
  return <RecordScreen recordId={recordId} />;
}
