import { workflows } from '../data/requestCatalog';
import type { RequestStatus, RequestType, ReviewData } from '../types/requests';

/** Imported state only: these values do not claim real approvals or external operations. */
export function seedReview(
  type: RequestType,
  status: RequestStatus,
  date: string,
  reference: string,
  verification?: 'pending' | 'invalid',
): ReviewData {
  const steps = workflows[type.workflow];
  const reached = (step: RequestStatus) =>
    steps.includes(step) && steps.indexOf(status) >= steps.indexOf(step);
  const checked = steps.indexOf(status) > steps.indexOf('validating');
  const released = reached('ready');
  return {
    verification: '',
    recognizedLevel: '',
    convertedScore: '',
    reference: '',
    internalNote: 'Ghi chú nội bộ mẫu; không công khai cho sinh viên.',
    ...(checked
      ? {
          identityChecked: true,
          evidenceChecked: true,
          originalChecked: type.requiresOriginalVerification,
          campaignChecked: type.requiresCampaign,
        }
      : {}),
    ...(type.workflow === 'certificate' && reached('verified')
      ? {
          verificationStatus: 'valid',
          verification: 'Đã đối chiếu thông tin trong tình huống giả lập.',
          verificationChannel: 'Cổng tra cứu giả lập của đơn vị cấp',
          verificationDate: date,
          verificationRef: `${reference}-VERIFY`,
        }
      : {}),
    ...(type.workflow === 'certificate' && reached('review')
      ? {
          recognizedLevel: 'Đủ điều kiện theo tình huống mẫu',
          recommendation: 'Đề xuất công nhận theo hồ sơ mẫu; không áp dụng quy đổi thật.',
          reviewer: 'Tổ thẩm định giả lập',
        }
      : {}),
    ...(verification
      ? {
          identityChecked: true,
          evidenceChecked: true,
          verificationStatus: verification,
          verification:
            verification === 'pending'
              ? 'Đã gửi yêu cầu; đang chờ phản hồi từ đơn vị cấp (mẫu).'
              : 'Số hiệu chứng chỉ không khớp dữ liệu phản hồi (mẫu). Cần xác minh lại hoặc từ chối có lý do.',
          verificationChannel: 'Email đơn vị cấp (giả lập)',
          verificationRef: `${reference}-LOOKUP`,
          verificationDate: date,
        }
      : {}),
    ...(reached('decision')
      ? {
          reference: `${reference}-QD`,
          decisionDate: date,
          decisionOutcome: 'Chấp thuận trong tình huống mẫu',
        }
      : {}),
    ...(reached('signed') ? { signatureRef: `${reference}-SIGN` } : {}),
    ...(reached('sealed') ? { sealRef: `${reference}-SEAL` } : {}),
    ...(reached('updated') || reached('council') || reached('regrading')
      ? {
          externalReference: `${reference}-TRANSFER`,
        }
      : {}),
    ...(reached('updated') && type.workflow === 'certificate'
      ? {
          academicUpdate: 'Đã ghi nhận công nhận chứng chỉ trong hệ thống giả lập.',
        }
      : {}),
    ...(released
      ? {
          deliveryMode: type.requiresPickup ? 'pickup' : 'digital',
          pickupLocation: 'Bộ phận một cửa HC1C (mẫu)',
          pickupTime: 'Theo lịch hẹn của chuyên viên',
          pickupInstructions: 'Mang giấy tờ đối chiếu theo thông báo.',
          deliveryAcknowledged: status === 'completed',
        }
      : {}),
  };
}
