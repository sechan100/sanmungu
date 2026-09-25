// 위치 백그라운드 작업과 화면의 쓰기가 같은 JS 런타임에서 파일을 번갈아 읽고 쓰므로,
// 읽기-수정-쓰기 한 묶음을 순서대로 세워 한쪽 쓰기가 다른 쪽 쓰기를 덮지 않게 한다.
let tail: Promise<unknown> = Promise.resolve();

export function withStoreLock<T>(work: () => Promise<T> | T): Promise<T> {
  const run = tail.then(work, work);
  tail = run.catch(() => undefined);
  return run;
}
