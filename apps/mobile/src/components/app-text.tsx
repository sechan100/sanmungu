// AppText — Pretendard fontFamily가 기본 적용된 Text. fontWeight 대신 weight prop을 쓴다.
import { Text, type TextProps } from 'react-native';

import { font, fontSize as fontSizes, palette, type FontWeightKey } from '@/theme';

interface AppTextProps extends TextProps {
  weight?: FontWeightKey;
  fontSize?: number;
  color?: string;
}

export const AppText = ({
  weight = 'regular',
  fontSize = fontSizes.body,
  color = palette.ink,
  style,
  ...rest
}: AppTextProps) => (
  <Text {...rest} style={[{ fontFamily: font[weight], fontSize, color }, style]} />
);
