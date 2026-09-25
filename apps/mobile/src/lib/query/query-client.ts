import { QueryClient } from '@tanstack/react-query';

// 조회 대상이 전부 기기 안 파일이라 재시도·창 포커스 재조회가 의미 없다.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false, staleTime: Infinity },
  },
});
