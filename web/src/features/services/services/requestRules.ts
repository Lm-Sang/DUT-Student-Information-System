import type { User } from '@/features/auth';
import {
  closedStatuses,
  getRequestFields,
  getRequestType,
  nextStatus,
  staffMembers,
} from '../data/requestCatalog';
import type { CreateRequest, RequestStatus, ReviewData, StudentRequest } from '../types/requests';

export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
function validPastDate(value: string) {
  return (
    validDate(value) &&
    value <= new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
  );
}
function validAnnouncement(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function validateFiles(files: File[]) {
  if (files.length > 5) throw new Error('Mỗi lần nộp tối đa 5 tệp.');
  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const types: Record<string, string> = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
    };
    if (!extension || !types[extension] || file.type !== types[extension])
      throw new Error('Chỉ hỗ trợ tệp PDF, JPG hoặc PNG.');
    if (!file.size || file.size > 10 * 1024 * 1024)
      throw new Error('Mỗi tệp phải có dữ liệu và không vượt quá 10MB.');
  }
}
export function validateSubmission(user: User, input: CreateRequest) {
  if (user.role !== 'student') throw new Error('Chỉ sinh viên có thể nộp hồ sơ.');
  const errors = submissionIssues(input);
  const first = Object.values(errors)[0];
  if (first) throw new Error(first);
}
export function submissionIssues(input: CreateRequest): Record<string, string> {
  const errors: Record<string, string> = {};
  const type = getRequestType(input.typeId);
  for (const field of getRequestFields(input.typeId, input.fields)) {
    const value = input.fields[field.key]?.trim();
    if (field.required && !value) errors[field.key] = `Vui lòng nhập ${field.label.toLowerCase()}`;
    if (value && field.options && !field.options.includes(value))
      errors[field.key] = 'Lựa chọn không hợp lệ.';
    if (value && field.type === 'date' && !validDate(value))
      errors[field.key] = 'Ngày không hợp lệ.';
    if (value && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      errors[field.key] = 'Nhập email liên hệ hợp lệ.';
    if (value && field.type === 'number' && (!Number.isFinite(Number(value)) || Number(value) < 0))
      errors[field.key] = 'Nhập số không âm hợp lệ.';
  }
  if (type.evidence && input.files.length === 0)
    errors.files = 'Vui lòng đính kèm minh chứng bắt buộc.';
  if (
    input.fields.copies &&
    (!Number.isInteger(Number(input.fields.copies)) ||
      Number(input.fields.copies) < 1 ||
      Number(input.fields.copies) > 5)
  )
    errors.copies = 'Số lượng từ 1 đến 5 bản.';
  if (type.workflow === 'certificate') {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
    if (input.fields.examDate > today) errors.examDate = 'Ngày thi không được ở tương lai.';
    if (input.fields.issueDate > today) errors.issueDate = 'Ngày cấp không được ở tương lai.';
    if (input.fields.examDate > input.fields.issueDate)
      errors.issueDate = 'Ngày cấp phải từ ngày thi trở đi.';
    if (input.fields.expiryDate && input.fields.expiryDate < input.fields.issueDate)
      errors.expiryDate = 'Ngày hết hạn phải từ ngày cấp trở đi.';
  }
  try {
    validateFiles(input.files);
  } catch (error) {
    errors.files = (error as Error).message;
  }
  return errors;
}
export function assertRead(user: User, request: StudentRequest) {
  if (
    user.role === 'admin' ||
    (user.role === 'student' && user.id === request.student.id) ||
    (user.role === 'staff' && user.id === request.assigneeId)
  )
    return;
  throw new Error('Bạn không có quyền truy cập hồ sơ này.');
}
export function assertProcessor(user: User, request: StudentRequest) {
  if (user.role !== 'staff' || request.assigneeId !== user.id)
    throw new Error('Chỉ chuyên viên được phân công có thể xử lý hồ sơ.');
  if (closedStatuses.includes(request.status)) throw new Error('Hồ sơ đã kết thúc.');
}
export function validateAssignment(
  user: User,
  request: StudentRequest,
  assigneeId: string,
  dueDate: string,
) {
  if (user.role !== 'admin') throw new Error('Chỉ admin có thể phân công.');
  if (closedStatuses.includes(request.status))
    throw new Error('Không thể phân công hồ sơ đã kết thúc.');
  const member = staffMembers.find((item) => item.id === assigneeId);
  if (!member || member.department !== getRequestType(request.typeId).department)
    throw new Error('Chọn chuyên viên thuộc đơn vị phụ trách.');
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
  if (!validDate(dueDate) || dueDate < today) throw new Error('Hạn xử lý phải từ hôm nay trở đi.');
}
export function validateTransition(
  user: User,
  request: StudentRequest,
  status: RequestStatus,
  message: string,
  review: ReviewData,
  result: string,
  files: File[] = [],
  acknowledged = false,
) {
  assertProcessor(user, request);
  const issues = transitionIssues(request, status, message, review, result, files, acknowledged);
  if (issues.length) throw new Error(issues[0]);
}
export function needsExternalAcknowledgment(status: RequestStatus) {
  return [
    'signed',
    'sealed',
    'decision',
    'updated',
    'completed',
    'regrading',
    'council',
    'verified',
  ].includes(status);
}
export function transitionIssues(
  request: StudentRequest,
  status: RequestStatus,
  message: string,
  review: ReviewData,
  result: string,
  files: File[] = [],
  acknowledged = false,
) {
  const issues: string[] = [];
  const need = (valid: unknown, message: string) => {
    if (!valid) issues.push(message);
  };
  const type = getRequestType(request.typeId);
  if (closedStatuses.includes(request.status)) return ['Hồ sơ đã kết thúc.'];
  if (request.status === 'supplement') return ['Đang chờ sinh viên bổ sung hồ sơ.'];
  const early = ['received', 'validating', 'review', 'verified', 'feedback', 'council'].includes(
    request.status,
  );
  if (
    status !== nextStatus(request.typeId, request.status) &&
    !(early && ['supplement', 'rejected'].includes(status))
  )
    return ['Không thể chuyển sang bước này.'];
  need(message.trim(), 'Nhập phản hồi để sinh viên theo dõi.');
  if (['supplement', 'rejected'].includes(status)) return issues;
  if (request.status === 'validating') {
    need(review.identityChecked, 'Xác nhận đã đối chiếu thông tin sinh viên.');
    need(review.evidenceChecked, 'Xác nhận đã kiểm tra thành phần hồ sơ.');
    if (type.requiresOriginalVerification || review.originalRequired)
      need(review.originalChecked, 'Cần ghi nhận đã đối chiếu bản gốc.');
    if (type.requiresCampaign)
      need(review.campaignChecked, 'Cần đối chiếu điều kiện và thời hạn của đợt áp dụng.');
  }
  if (type.workflow === 'certificate' && status === 'verified') {
    need(review.verificationStatus === 'valid', 'Cần kết quả xác minh hợp lệ từ đơn vị cấp.');
    need(review.verification.trim(), 'Cần nội dung kết quả xác minh.');
    need(review.verificationChannel?.trim(), 'Nhập kênh xác minh chứng chỉ.');
    need(
      validPastDate(review.verificationDate ?? ''),
      'Nhập ngày xác minh hợp lệ, không ở tương lai.',
    );
    need(review.verificationRef?.trim(), 'Nhập mã / tham chiếu xác minh.');
  }
  if (type.workflow === 'certificate' && status === 'review') {
    need(review.recognizedLevel.trim(), 'Nhập mức công nhận đề xuất.');
    need(review.recommendation?.trim(), 'Nhập kiến nghị xử lý.');
    need(review.reviewer?.trim(), 'Nhập người / đơn vị thẩm định.');
    if (review.convertedScore.trim())
      need(
        Number.isFinite(Number(review.convertedScore)) && Number(review.convertedScore) >= 0,
        'Điểm quy đổi phải là số không âm.',
      );
    if (review.convertedScore.trim())
      need(
        review.conversionBasis?.trim(),
        'Nhập căn cứ quy đổi điểm; không tự suy diễn bảng tương đương.',
      );
  }
  if (status === 'decision') {
    need(review.reference.trim(), 'Nhập số văn bản / quyết định từ cấp có thẩm quyền.');
    need(
      validPastDate(review.decisionDate ?? ''),
      'Nhập ngày quyết định hợp lệ, không ở tương lai.',
    );
    need(review.decisionOutcome?.trim(), 'Nhập kết luận quyết định.');
    if (type.workflow === 'certificate')
      need(
        files.length || request.attachments.some((f) => f.purpose === 'result'),
        'Đính kèm bản tham khảo quyết định đã ban hành.',
      );
  }
  if (status === 'signed') need(review.signatureRef?.trim(), 'Nhập tham chiếu văn bản đã ký.');
  if (status === 'sealed')
    need(review.sealRef?.trim(), 'Nhập ghi nhận đóng dấu của đơn vị phụ trách.');
  if (['council', 'regrading', 'updated'].includes(status))
    need(review.externalReference?.trim(), 'Nhập tham chiếu bàn giao / kết quả thực hiện.');
  if (status === 'updated' && type.workflow === 'certificate')
    need(review.academicUpdate?.trim(), 'Ghi nhận kết quả cập nhật hệ thống đào tạo bên ngoài.');
  if (['ready', 'completed'].includes(status)) {
    need(result.trim(), 'Nhập kết quả và hướng dẫn nhận kết quả.');
    need(
      ['pickup', 'digital', 'announcement'].includes(review.deliveryMode ?? ''),
      'Chọn kênh trả kết quả hợp lệ.',
    );
    if (type.requiresSignatureRecord)
      need(review.signatureRef?.trim(), 'Cần tham chiếu văn bản đã ký trước khi trả kết quả.');
    if (type.requiresSealRecord)
      need(review.sealRef?.trim(), 'Cần ghi nhận đóng dấu trước khi trả kết quả.');
    if (type.requiresOriginalVerification || review.originalRequired)
      need(review.originalChecked, 'Cần ghi nhận đã đối chiếu bản gốc.');
    if (['academic', 'certificate', 'evaluation', 'graduation'].includes(type.workflow)) {
      need(review.reference.trim(), 'Cần số quyết định đã ban hành trước khi trả kết quả.');
      need(
        validPastDate(review.decisionDate ?? ''),
        'Cần ngày quyết định hợp lệ trước khi trả kết quả.',
      );
      need(review.decisionOutcome?.trim(), 'Cần kết luận quyết định trước khi trả kết quả.');
    }
    if (type.workflow === 'certificate')
      need(
        review.academicUpdate?.trim(),
        'Cần ghi nhận cập nhật hệ thống đào tạo trước khi trả kết quả.',
      );
    if (type.requiresPickup)
      need(review.deliveryMode === 'pickup', 'Thủ tục yêu cầu nhận kết quả trực tiếp.');
    if (review.deliveryMode === 'pickup') {
      need(review.pickupLocation?.trim(), 'Nhập địa điểm nhận kết quả.');
      need(review.pickupTime?.trim(), 'Nhập thời gian nhận kết quả.');
      need(review.pickupInstructions?.trim(), 'Nhập giấy tờ / hướng dẫn khi nhận kết quả.');
    }
    if (review.deliveryMode === 'digital' && type.workflow !== 'support')
      need(
        files.length || request.attachments.some((f) => f.purpose === 'result'),
        'Đính kèm tệp kết quả trước khi trả trên hệ thống.',
      );
    if (review.deliveryMode === 'announcement')
      need(
        validAnnouncement(review.announcementUrl ?? ''),
        'Nhập liên kết thông báo HTTPS hợp lệ.',
      );
  }
  if (status === 'completed')
    need(review.deliveryAcknowledged, 'Xác nhận đã trả kết quả / thông báo theo kênh đã chọn.');
  if (needsExternalAcknowledgment(status))
    need(acknowledged, 'Xác nhận thao tác bên ngoài đã thực hiện và có căn cứ.');
  return issues;
}
