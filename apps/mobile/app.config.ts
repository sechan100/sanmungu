import type { ConfigContext, ExpoConfig } from 'expo/config';

// 네이버 지도 client_id 는 prebuild 때 AndroidManifest 에 박힌다 — 값을 바꾸면 `just rn apk mobile -p` 로 재생성해야 반영된다.
// expo CLI 가 prebuild 시 자동 로드하는 .env.local 에서 읽는다(.env.prod 는 prebuild 가 읽지 않는다).
export default ({ config }: ConfigContext): ExpoConfig => {
  const clientId = process.env.NAVER_MAP_CLIENT_ID;
  if (!clientId) throw new Error('apps/mobile/.env.local 에 NAVER_MAP_CLIENT_ID 가 비어 있습니다.');

  return {
    ...(config as ExpoConfig),
    plugins: config.plugins?.map((plugin) =>
      Array.isArray(plugin) && plugin[0] === '@mj-studio/react-native-naver-map'
        ? [plugin[0], { ...plugin[1], client_id: clientId }]
        : plugin,
    ),
  };
};
