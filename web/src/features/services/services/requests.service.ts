import type { User } from '@/features/auth';
import { seedRequests } from '../mocks/requests.mock';
import { getRequestFields, getRequestType, staffMembers } from '../data/requestCatalog';
import type {
  Attachment,
  CreateRequest,
  RequestEvent,
  RequestStatus,
  ReviewData,
  StudentRequest,
} from '../types/requests';
import { createRequestStore, type RequestStore } from '../storage/requestStore';
import { requestState } from '../data/requestState';
import {
  assertProcessor,
  assertRead,
  validateAssignment,
  validateFiles,
  validateSubmission,
  validateTransition,
} from './requestRules';

const eventName = 'dut-requests-changed';
function notify() {
  window.dispatchEvent(new Event(eventName));
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel(eventName);
    channel.postMessage('changed');
    channel.close();
  }
}
export function subscribeRequests(callback: () => void) {
  window.addEventListener(eventName, callback);
  window.addEventListener('focus', callback);
  const channel =
    typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(eventName) : undefined;
  if (channel) channel.onmessage = callback;
  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener('focus', callback);
    channel?.close();
  };
}
function attachments(files: File[], purpose: Attachment['purpose']): Attachment[] {
  validateFiles(files);
  return files.map((file) => ({
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type,
    blob: file,
    addedAt: new Date().toISOString(),
    purpose,
    artifactKind: purpose === 'evidence' ? 'evidence' : 'reference-copy',
  }));
}
function addEvent(
  request: StudentRequest,
  user: User,
  message: string,
  extra: Partial<RequestEvent> = {},
) {
  request.updatedAt = new Date().toISOString();
  request.events.push({
    id: crypto.randomUUID(),
    at: request.updatedAt,
    actor: user.fullName,
    actorId: user.id,
    status: request.status,
    visibility: 'public',
    message: message.trim(),
    ...extra,
  });
}
const emptyReview = (): ReviewData => ({
  verification: '',
  recognizedLevel: '',
  convertedScore: '',
  reference: '',
  internalNote: '',
});
function publicRequest(r: StudentRequest): StudentRequest {
  const published = ['ready', 'completed'].includes(r.status);
  return {
    ...r,
    waitingFor: requestState(r).external ? 'external' : undefined,
    review: {
      ...emptyReview(),
      ...(published
        ? {
            deliveryMode: r.review.deliveryMode,
            pickupLocation: r.review.pickupLocation,
            pickupTime: r.review.pickupTime,
            pickupInstructions: r.review.pickupInstructions,
            announcementUrl: r.review.announcementUrl,
          }
        : {}),
    },
    attachments: r.attachments.filter((a) => a.purpose === 'evidence' || published),
    result: published ? r.result : '',
    events: r.events
      .filter((e) => e.visibility !== 'internal')
      .map(({ changes: _changes, ...event }) => event),
  };
}
function reviewChanges(before: ReviewData, after: ReviewData): RequestEvent['changes'] {
  return Object.keys(after)
    .filter((key) => before[key as keyof ReviewData] !== after[key as keyof ReviewData])
    .map((key) => ({
      field: key,
      before: String(before[key as keyof ReviewData] ?? '—'),
      after: String(after[key as keyof ReviewData] ?? '—'),
    }));
}
export function createRequestsService(store: RequestStore, changed: () => void = () => {}) {
  async function mutate(id: string, revision: number, edit: (request: StudentRequest) => void) {
    await store.mutate(id, revision, edit);
    changed();
  }
  return {
    async list(user: User): Promise<StudentRequest[]> {
      return (await store.list())
        .filter((request) => {
          try {
            assertRead(user, request);
            return true;
          } catch {
            return false;
          }
        })
        .map((r) => (user.role === 'student' ? publicRequest(r) : r))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async create(user: User, input: CreateRequest) {
      validateSubmission(user, input);
      const at = new Date().toISOString();
      const id = `YC-${at.slice(0, 4)}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const fields = Object.fromEntries(
        getRequestFields(input.typeId, input.fields).map((f) => [
          f.key,
          input.fields[f.key]?.trim() ?? '',
        ]),
      );
      const request: StudentRequest = {
        id,
        revision: 1,
        typeId: input.typeId,
        student: {
          id: user.id,
          fullName: user.fullName,
          studentId: user.studentId,
          className: user.className,
        },
        status: 'submitted',
        createdAt: at,
        updatedAt: at,
        priority: 'normal',
        fields,
        note: input.note.trim(),
        attachments: attachments(input.files, 'evidence'),
        events: [],
        review: emptyReview(),
        result: '',
      };
      addEvent(
        request,
        user,
        getRequestType(input.typeId).submissionMode === 'direct'
          ? 'Sinh viên đăng ký trước; cần nộp hồ sơ trực tiếp theo hướng dẫn.'
          : 'Sinh viên xác nhận và nộp hồ sơ trực tuyến.',
        { kind: 'submit' },
      );
      await store.add(request);
      changed();
      return id;
    },
    assign(
      user: User,
      request: StudentRequest,
      assigneeId: string,
      dueDate: string,
      priority: StudentRequest['priority'],
      note: string,
    ) {
      return mutate(request.id, request.revision, (current) => {
        validateAssignment(user, current, assigneeId, dueDate);
        if (!note.trim()) throw new Error('Nhập nội dung phân công.');
        if (!['normal', 'urgent'].includes(priority)) throw new Error('Mức ưu tiên không hợp lệ.');
        const name = (id?: string) =>
          staffMembers.find((s) => s.id === id)?.name ?? 'Chưa phân công';
        const changes = [
          { field: 'Chuyên viên', before: name(current.assigneeId), after: name(assigneeId) },
          { field: 'Hạn xử lý', before: current.dueDate ?? 'Chưa có', after: dueDate },
          { field: 'Ưu tiên', before: current.priority, after: priority },
        ];
        current.assigneeId = assigneeId;
        current.dueDate = dueDate;
        current.priority = priority;
        addEvent(
          current,
          user,
          `Chuyên viên phụ trách: ${name(assigneeId)}. Hạn xử lý: ${dueDate}.`,
          { kind: 'assignment' },
        );
        addEvent(current, user, note, { kind: 'assignment', visibility: 'internal', changes });
      });
    },
    transition(
      user: User,
      request: StudentRequest,
      status: RequestStatus,
      message: string,
      review: ReviewData,
      result: string,
      files: File[],
      acknowledged = false,
    ) {
      const resultFiles = attachments(files, 'result');
      return mutate(request.id, request.revision, (current) => {
        validateTransition(user, current, status, message, review, result, files, acknowledged);
        const fromStatus = current.status;
        const changes = reviewChanges(current.review, review);
        if (status === 'supplement') {
          current.resumeStatus = current.status;
          current.supplementMessage = message.trim();
        }
        current.status = status;
        current.review = { ...review };
        delete current.review.responseDraft;
        current.result = result.trim();
        current.attachments.push(...resultFiles);
        addEvent(current, user, message, { kind: 'transition', fromStatus });
        if (changes?.length || resultFiles.length)
          addEvent(current, user, `Lưu phiếu xử lý; ${resultFiles.length} tệp kết quả mới.`, {
            kind: 'review',
            visibility: 'internal',
            changes,
          });
      });
    },
    saveReview(
      user: User,
      request: StudentRequest,
      review: ReviewData,
      result?: string,
      files: File[] = [],
    ) {
      const draftFiles = attachments(files, 'result');
      return mutate(request.id, request.revision, (current) => {
        assertProcessor(user, current);
        const deliveryKeys: (keyof ReviewData)[] = [
          'deliveryMode',
          'pickupLocation',
          'pickupTime',
          'pickupInstructions',
          'announcementUrl',
        ];
        if (
          current.status === 'ready' &&
          (draftFiles.length > 0 ||
            (result !== undefined && result.trim() !== current.result) ||
            deliveryKeys.some((key) => review[key] !== current.review[key]))
        )
          throw new Error(
            'Kết quả đã phát hành. Dùng Cập nhật trạng thái để ghi nhận thay đổi hướng dẫn và phản hồi công khai.',
          );
        const changes = reviewChanges(current.review, review);
        current.review = { ...review };
        if (result !== undefined) current.result = result.trim();
        current.attachments.push(...draftFiles);
        addEvent(current, user, 'Lưu nháp phiếu xử lý nội bộ.', {
          kind: 'review',
          visibility: 'internal',
          changes,
        });
      });
    },
    supplement(user: User, request: StudentRequest, message: string, files: File[]) {
      const evidence = attachments(files, 'evidence');
      return mutate(request.id, request.revision, (current) => {
        assertRead(user, current);
        if (user.role !== 'student' || current.status !== 'supplement')
          throw new Error('Hồ sơ không ở bước cần bổ sung.');
        if (!message.trim()) throw new Error('Nhập nội dung giải trình bổ sung.');
        const fromStatus = current.status;
        current.status = current.resumeStatus ?? 'validating';
        delete current.resumeStatus;
        delete current.supplementMessage;
        current.attachments.push(...evidence);
        addEvent(current, user, `Bổ sung hồ sơ: ${message}`, { kind: 'supplement', fromStatus });
      });
    },
    cancel(user: User, request: StudentRequest, reason: string) {
      return mutate(request.id, request.revision, (current) => {
        assertRead(user, current);
        if (user.role !== 'student' || current.status !== 'submitted')
          throw new Error('Chỉ được hủy hồ sơ chưa tiếp nhận.');
        if (!reason.trim()) throw new Error('Nhập lý do hủy.');
        const fromStatus = current.status;
        current.status = 'cancelled';
        addEvent(current, user, reason, { kind: 'cancel', fromStatus });
      });
    },
    async demo(user: User, reset: boolean, confirmed: boolean) {
      if (user.role !== 'admin') throw new Error('Chỉ admin có thể quản lý dữ liệu mẫu.');
      if (!confirmed) throw new Error('Cần xác nhận phạm vi thao tác dữ liệu mẫu.');
      await store.seed(seedRequests(), reset);
      changed();
    },
  };
}
export const requestsService = createRequestsService(
  createRequestStore({ initial: seedRequests }),
  notify,
);
