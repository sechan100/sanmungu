import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Suspense } from 'react';

import { getApkArtifactQuery } from '@/app/queries/apk-artifact.query';

export default function DownloadPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-8 px-5 py-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold">산문구</h1>
        <p className="text-xl text-gray-700">올라간 길을 기록하고, 그 길을 따라 내려오는 앱</p>
      </header>

      <Suspense fallback={<div className="h-24 animate-pulse rounded-2xl bg-gray-200" />}>
        <DownloadButton />
      </Suspense>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">설치하는 법</h2>
        <ol className="list-decimal space-y-3 pl-7 text-xl leading-relaxed">
          <li>위의 초록 버튼을 누릅니다.</li>
          <li>받은 파일을 누릅니다.</li>
          <li>
            &ldquo;출처를 알 수 없는 앱&rdquo; 안내가 나오면 <b>설정</b>에서 <b>허용</b>을 켭니다.
          </li>
          <li>
            <b>설치</b>를 누릅니다. 이미 깔려 있으면 <b>업데이트</b>로 나오고 기록은 그대로 남습니다.
          </li>
        </ol>
      </section>
    </main>
  );
}

async function DownloadButton() {
  const result = await getApkArtifactQuery();

  if (!result.ok) {
    return <p className="rounded-2xl bg-red-50 p-6 text-xl text-red-800">{result.message}</p>;
  }
  if (result.artifact === null) {
    return <p className="rounded-2xl bg-gray-100 p-6 text-xl text-gray-700">아직 올라온 앱 파일이 없습니다.</p>;
  }

  const { downloadUrl, sizeBytes, uploadedAt } = result.artifact;
  const uploadedKst = format(new TZDate(uploadedAt, 'Asia/Seoul'), 'M월 d일 a h시 m분', { locale: ko });

  return (
    <div className="space-y-3">
      <a
        href={downloadUrl}
        className="flex h-24 items-center justify-center rounded-2xl bg-green-700 text-3xl font-extrabold text-white active:bg-green-800"
      >
        앱 내려받기
      </a>
      <p className="text-center text-lg text-gray-600">
        {uploadedKst} 올림 · {(sizeBytes / 1024 / 1024).toFixed(0)}MB
      </p>
    </div>
  );
}
