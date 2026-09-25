// Screen — SafeArea + 배경색 래퍼. 모든 화면의 루트.
import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { palette } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  edges?: readonly Edge[];
  style?: StyleProp<ViewStyle>;
}

export const Screen = ({ children, edges = ['top', 'bottom'], style }: ScreenProps) => (
  <SafeAreaView edges={edges} style={[styles.root, style]}>
    {children}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg },
});
