import type { ProcedurePolicy, RequestType } from '../types/requests';

export function procedurePolicy(type: Omit<RequestType, keyof ProcedurePolicy>): ProcedurePolicy {
  const document = type.workflow === 'document';
  const certificate = type.workflow === 'certificate';
  const direct = type.id === 'withdrawal' || type.id === 'graduation';
  const hybrid = ['exam-delay', 'leave', 'extend-leave', 'return', 'regrade'].includes(type.id);
  const campaign = [
    'extra-exam',
    'regrade',
    'graduation',
    'graduation-delay',
    'second-program',
    'scholarship',
  ].includes(type.id);
  return {
    submissionMode: direct ? 'direct' : hybrid ? 'hybrid' : 'online',
    evidenceMode: direct ? 'physical' : certificate || hybrid ? 'mixed' : 'online',
    processingMode: type.workflow === 'support' ? 'internal' : 'mixed',
    resultDeliveryMode:
      document || type.workflow === 'card' || type.id === 'withdrawal'
        ? 'pickup'
        : certificate || ['evaluation', 'graduation'].includes(type.workflow)
          ? 'announcement'
          : 'configured',
    requiresOriginalVerification: direct,
    requiresApprovalRecord: !['support', 'card'].includes(type.workflow),
    requiresSignatureRecord: document,
    requiresSealRecord: document,
    requiresPickup: document || type.workflow === 'card' || type.id === 'withdrawal',
    requiresCampaign: campaign,
    policyNote: direct
      ? 'Danh mục tham khảo yêu cầu nộp trực tiếp. Trang này chỉ đăng ký trước và theo dõi; phải nộp bản gốc theo hướng dẫn của đơn vị tiếp nhận.'
      : document
        ? 'Đăng ký online; việc phê duyệt, ký, đóng dấu và trả bản giấy được thực hiện tại đơn vị có thẩm quyền. Tệp trên web chỉ là bản tham khảo.'
        : certificate
          ? 'Nộp bản quét online. Có thể được yêu cầu đối chiếu bản gốc; chỉ công nhận sau thẩm tra, quyết định và cập nhật hệ thống bên ngoài.'
          : hybrid
            ? 'Khai báo và đính kèm minh chứng trước trên web. Hồ sơ bản giấy / bản gốc thực hiện theo quy trình và hướng dẫn của đơn vị tiếp nhận.'
            : 'Kênh tiếp nhận trong bản thử nghiệm. Chuyên viên đối chiếu quy trình và thông báo đang áp dụng trước khi xử lý.',
    source:
      direct || document || certificate
        ? 'Ảnh danh mục HC1C và tài liệu quy trình người dùng cung cấp; cần đơn vị nghiệp vụ xác nhận phiên bản áp dụng.'
        : 'Tài liệu quy trình người dùng cung cấp; cấu hình demo cần xác nhận nghiệp vụ.',
  };
}

export const submissionLabels = {
  online: 'Đăng ký online',
  direct: 'Nộp trực tiếp · đăng ký trước',
  hybrid: 'Kết hợp online và trực tiếp',
};
export const evidenceLabels = {
  online: 'Bản điện tử',
  physical: 'Hồ sơ bản giấy',
  mixed: 'Bản quét, đối chiếu gốc khi yêu cầu',
};
export const deliveryLabels = {
  digital: 'Trên hệ thống',
  pickup: 'Nhận trực tiếp',
  announcement: 'Theo thông báo',
  configured: 'Theo hướng dẫn trả kết quả',
};
