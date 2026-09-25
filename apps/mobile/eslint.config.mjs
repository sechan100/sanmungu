import { defineConfig, globalIgnores } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';

export default defineConfig([
  expoConfig,
  globalIgnores(['android/**', 'ios/**', '.expo/**', 'dist/**', 'expo-env.d.ts']),
]);
