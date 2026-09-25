// BigButton — 어르신이 장갑 낀 손으로도 누를 수 있는 큰 글자 버튼. loading 중 disabled.
import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { fontSize, palette, radius } from '@/theme';

import { AppText } from './app-text';

type BigButtonTone = 'start' | 'stop' | 'plain';

interface BigButtonProps {
  label: string;
  onPress: () => void;
  tone?: BigButtonTone;
  /** 보조 버튼은 낮게 */
  size?: 'large' | 'medium';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const BigButton = ({
  label,
  onPress,
  tone = 'plain',
  size = 'large',
  loading = false,
  style,
}: BigButtonProps) => {
  const filled = tone !== 'plain';
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        size === 'large' ? styles.large : styles.medium,
        tone === 'start' && { backgroundColor: pressed ? palette.startPressed : palette.start },
        tone === 'stop' && { backgroundColor: pressed ? palette.stopPressed : palette.stop },
        tone === 'plain' && [styles.plain, pressed && styles.plainPressed],
        loading && styles.dimmed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="large" color={filled ? palette.white : palette.ink} />
      ) : (
        <AppText
          weight="extrabold"
          fontSize={size === 'large' ? fontSize.button : fontSize.large}
          color={filled ? palette.white : palette.ink}
        >
          {label}
        </AppText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  large: { height: 84 },
  medium: { height: 64 },
  plain: {
    backgroundColor: palette.white,
    borderWidth: 2,
    borderColor: palette.ink2,
  },
  plainPressed: { backgroundColor: palette.line },
  dimmed: { opacity: 0.6 },
});
