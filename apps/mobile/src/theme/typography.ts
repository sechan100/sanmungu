// Pretendard static 폰트 패밀리 매핑 — src/app/_layout.tsx의 useFonts 등록 키와 1:1.
// RN은 커스텀 폰트에 fontWeight를 적용하지 않으므로 반드시 이 fontFamily로 굵기를 지정한다.
export const font = {
  regular: 'Pretendard-Regular',
  semibold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
  extrabold: 'Pretendard-ExtraBold',
} as const;

export type FontWeightKey = keyof typeof font;

/** 어르신용 글자 크기 — 본문도 20 이상 */
export const fontSize = {
  body: 20,
  large: 24,
  title: 30,
  button: 28,
} as const;
