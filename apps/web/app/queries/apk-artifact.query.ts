import 'server-only';

import { list } from '@vercel/blob';
import { connection } from 'next/server';

// ops/cmd/rn/@apk.ts --push 가 올리는 고정 경로 `<blobPrefix>/<project>-<app>.apk` 의 **복사본**이다
// (ops.config.ts: project=sanmungu, app=mobile, blobPrefix=dist). 한쪽만 고치면 에러 없이 "준비 중"으로만 보인다.
const APK_PATHNAME = 'dist/sanmungu-mobile.apk';

export type ApkArtifact = {
  downloadUrl: string;
  sizeBytes: number;
  uploadedAt: Date;
};

export type ApkArtifactResult = { ok: true; artifact: ApkArtifact | null } | { ok: false; message: string };

export async function getApkArtifactQuery(): Promise<ApkArtifactResult> {
  // 같은 경로에 덮어써지므로 빌드 시점에 구우면 교체가 반영되지 않는다 — 요청 시점 조회.
  await connection();

  try {
    const { blobs } = await list({ prefix: APK_PATHNAME });
    const blob = blobs.find((b) => b.pathname === APK_PATHNAME);
    if (!blob) return { ok: true, artifact: null };
    return {
      ok: true,
      artifact: {
        downloadUrl: withVersion(blob.downloadUrl, blob.uploadedAt),
        sizeBytes: blob.size,
        uploadedAt: blob.uploadedAt,
      },
    };
  } catch {
    return { ok: false, message: '배포 저장소에 연결하지 못했습니다.' };
  }
}

// URL 이 고정이라 한 번 받아간 브라우저는 옛 파일을 계속 쓴다 — 업로드 시각을 실어 교체마다 링크를 바꾼다.
function withVersion(url: string, uploadedAt: Date): string {
  const versioned = new URL(url);
  versioned.searchParams.set('v', String(uploadedAt.getTime()));
  return versioned.toString();
}
