import { demoVersion } from '../data/demoScenarios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/features/auth';
import { requestsService, subscribeRequests } from '../services/requests.service';
import type { CreateRequest, RequestStatus, ReviewData, StudentRequest } from '../types/requests';

export function useRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const generation = useRef(0);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const reload = useCallback(async () => {
    const current = ++generation.current;
    if (!user) return;
    try {
      const items = await requestsService.list(user);
      if (current === generation.current) {
        setRequests(items);
        setError('');
      }
    } catch (e) {
      if (current === generation.current)
        setError(e instanceof Error ? e.message : 'Không tải được hồ sơ.');
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- Loads records from IndexedDB and subscribes to external cross-tab changes.
    void reload();
    const unsubscribe = subscribeRequests(() => {
      void reload();
    });
    return () => {
      // oxlint-disable-next-line react-hooks/exhaustive-deps -- Invalidates every pending read, including reads started by subscription callbacks.
      generation.current++;
      unsubscribe();
    };
  }, [reload]);
  const act = async (operation: () => Promise<unknown>, success: string) => {
    if (lock.current || !user) return false;
    lock.current = true;
    setBusy(true);
    setError('');
    setFeedback('');
    try {
      await operation();
      await reload();
      setFeedback(success);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Thao tác chưa được lưu.');
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  return {
    user,
    requests,
    loading,
    busy,
    error,
    feedback,
    reload,
    setFeedback,
    create: (input: CreateRequest) =>
      act(
        () => requestsService.create(user!, input),
        'Đã lập đơn đề nghị. Hồ sơ đang chờ tiếp nhận.',
      ),
    assign: (
      r: StudentRequest,
      id: string,
      due: string,
      priority: StudentRequest['priority'],
      note: string,
    ) =>
      act(
        () => requestsService.assign(user!, r, id, due, priority, note),
        'Đã cập nhật phân công và hạn xử lý.',
      ),
    transition: (
      r: StudentRequest,
      status: RequestStatus,
      message: string,
      review: ReviewData,
      result: string,
      files: File[],
      acknowledged = false,
    ) =>
      act(
        () =>
          requestsService.transition(
            user!,
            r,
            status,
            message,
            review,
            result,
            files,
            acknowledged,
          ),
        'Đã cập nhật trạng thái. Sinh viên có thể theo dõi trong hồ sơ.',
      ),
    saveReview: (r: StudentRequest, review: ReviewData, result?: string, files: File[] = []) =>
      act(
        () => requestsService.saveReview(user!, r, review, result, files),
        'Đã lưu phiếu kiểm tra.',
      ),
    supplement: (r: StudentRequest, message: string, files: File[]) =>
      act(
        () => requestsService.supplement(user!, r, message, files),
        'Đã gửi bổ sung cho chuyên viên.',
      ),
    cancel: (r: StudentRequest, reason: string) =>
      act(() => requestsService.cancel(user!, r, reason), 'Đã hủy hồ sơ và giữ lại lịch sử.'),
    demo: (reset: boolean, confirmed: boolean) =>
      act(
        () => requestsService.demo(user!, reset, confirmed),
        reset
          ? `Đã đặt lại bộ mẫu v${demoVersion}; hồ sơ tự tạo được giữ nguyên.`
          : `Đã nạp thêm bộ mẫu v${demoVersion}; mọi hồ sơ cũ được giữ nguyên.`,
      ),
  };
}
export type RequestController = ReturnType<typeof useRequests>;
