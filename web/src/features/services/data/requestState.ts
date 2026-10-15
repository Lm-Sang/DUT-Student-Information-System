import {
  actionLabels,
  closedStatuses,
  getRequestType,
  isOverdue,
  nextStatus,
  statusLabels,
} from './requestCatalog';
import type { StudentRequest } from '../types/requests';

export function requestState(r: StudentRequest) {
  const closed = closedStatuses.includes(r.status);
  const type = getRequestType(r.typeId);
  const external =
    r.waitingFor === 'external' ||
    (['review', 'council', 'regrading', 'feedback'].includes(r.status) &&
      type.processingMode !== 'internal') ||
    (type.workflow === 'certificate' &&
      r.status === 'validating' &&
      r.review.verificationStatus === 'pending');
  const waitingOn = closed
    ? 'Không còn tác vụ'
    : r.status === 'supplement'
      ? 'Sinh viên'
      : r.status === 'ready'
        ? 'Người nhận kết quả'
        : !r.assigneeId
          ? 'Admin phân công'
          : external
            ? 'Đơn vị / cấp có thẩm quyền'
            : 'Chuyên viên';
  const lifecycle = closed
    ? 'Đã kết thúc'
    : r.status === 'submitted'
      ? 'Mới nộp'
      : r.status === 'ready'
        ? 'Chờ trả kết quả'
        : 'Đang giải quyết';
  const delivery =
    r.status === 'completed'
      ? 'Đã trả kết quả'
      : r.status === 'ready'
        ? 'Sẵn sàng trả'
        : 'Chưa phát hành';
  const next = nextStatus(r.typeId, r.status);
  const action =
    r.status === 'supplement'
      ? 'Bổ sung theo yêu cầu'
      : r.status === 'ready'
        ? 'Xem hướng dẫn nhận kết quả'
        : closed
          ? 'Xem kết quả và lịch sử'
          : !r.assigneeId
            ? 'Phân công chuyên viên'
            : external
              ? 'Ghi nhận phản hồi từ đơn vị'
              : next
                ? (actionLabels[next] ?? statusLabels[next])
                : 'Xem hồ sơ';
  return {
    closed,
    external,
    waitingOn,
    lifecycle,
    delivery,
    action,
    actionable: !closed && !external && r.status !== 'supplement' && !!r.assigneeId,
  };
}
export function daysRemaining(r: StudentRequest, now = new Date()) {
  if (!r.dueDate) return undefined;
  const today = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
  return Math.round((Date.parse(r.dueDate) - Date.parse(today)) / 86400000);
}
export function isNearDue(r: StudentRequest) {
  const days = daysRemaining(r);
  return !closedStatuses.includes(r.status) && days !== undefined && days >= 0 && days <= 2;
}
export function elapsedDays(r: StudentRequest) {
  return Math.max(0, Math.floor((Date.now() - Date.parse(r.createdAt)) / 86400000));
}
export const queueLabels = {
  all: 'Tất cả',
  active: 'Đang giải quyết',
  unassigned: 'Chưa phân công',
  actionable: 'Cần xử lý',
  supplement: 'Chờ sinh viên',
  external: 'Chờ đơn vị khác',
  near: 'Sắp đến hạn',
  overdue: 'Quá hạn',
  completed: 'Hoàn tất',
};
export type RequestQueue = keyof typeof queueLabels;
export function inQueue(r: StudentRequest, queue: RequestQueue) {
  const state = requestState(r);
  switch (queue) {
    case 'active':
      return !state.closed && !!r.assigneeId;
    case 'unassigned':
      return !r.assigneeId && !state.closed;
    case 'actionable':
      return state.actionable;
    case 'supplement':
      return r.status === 'supplement';
    case 'external':
      return state.external && !state.closed;
    case 'near':
      return isNearDue(r);
    case 'overdue':
      return isOverdue(r);
    case 'completed':
      return r.status === 'completed';
    default:
      return true;
  }
}
