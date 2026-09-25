// 앱 문서 폴더의 JSON 파일 하나를 통째로 읽고 쓴다. 기록 크기(수천 좌표)에선 통째 덮어쓰기로 충분하다.
import { File, Paths } from 'expo-file-system';

export function readJson(name: string): unknown | null {
  const file = new File(Paths.document, name);
  if (!file.exists) return null;
  return JSON.parse(file.textSync());
}

export function writeJson(name: string, value: unknown): void {
  const file = new File(Paths.document, name);
  if (!file.exists) file.create();
  file.write(JSON.stringify(value));
}

export function deleteJson(name: string): void {
  const file = new File(Paths.document, name);
  if (file.exists) file.delete();
}
