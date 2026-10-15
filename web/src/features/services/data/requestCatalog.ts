import type {
  FieldDefinition,
  RequestStatus,
  RequestType,
  StaffMember,
  Workflow,
  ProcedurePolicy,
} from '../types/requests';
import { procedurePolicy } from './procedurePolicy';
import { demoStaffAccounts } from '@/shared/config/demoAccounts';

export const categories = [
  'Lập đơn xác nhận',
  'Lập đơn đề nghị',
  'Xét duyệt học vụ',
  'Giải quyết thủ tục thôi học',
  'Hỗ trợ tài khoản',
];
export const staffMembers: StaffMember[] = demoStaffAccounts.map((person) => ({
  id: person.id,
  username: person.username,
  name: person.fullName,
  department: person.department,
}));
export const statusLabels: Record<RequestStatus, string> = {
  submitted: 'Chờ tiếp nhận',
  received: 'Đã tiếp nhận',
  validating: 'Đang kiểm tra',
  supplement: 'Cần bổ sung',
  review: 'Chờ xét duyệt',
  feedback: 'Đối chiếu và tiếp nhận phản hồi',
  council: 'Trình Hội đồng',
  regrading: 'Đang chấm phúc khảo',
  signed: 'Đã ký',
  sealed: 'Đã đóng dấu',
  verified: 'Đã thẩm tra',
  decision: 'Đã có quyết định',
  updated: 'Đã cập nhật kết quả',
  ready: 'Sẵn sàng trả kết quả',
  completed: 'Hoàn tất',
  rejected: 'Từ chối',
  cancelled: 'Đã hủy',
};
export const workflows: Record<Workflow, RequestStatus[]> = {
  card: ['submitted', 'received', 'validating', 'review', 'updated', 'ready', 'completed'],
  document: [
    'submitted',
    'received',
    'validating',
    'review',
    'signed',
    'sealed',
    'ready',
    'completed',
  ],
  academic: [
    'submitted',
    'received',
    'validating',
    'review',
    'decision',
    'updated',
    'ready',
    'completed',
  ],
  certificate: [
    'submitted',
    'received',
    'validating',
    'verified',
    'review',
    'decision',
    'updated',
    'ready',
    'completed',
  ],
  support: ['submitted', 'received', 'validating', 'updated', 'ready', 'completed'],
  regrade: [
    'submitted',
    'received',
    'validating',
    'review',
    'regrading',
    'verified',
    'updated',
    'ready',
    'completed',
  ],
  evaluation: [
    'submitted',
    'received',
    'validating',
    'feedback',
    'council',
    'decision',
    'updated',
    'ready',
    'completed',
  ],
  graduation: [
    'submitted',
    'received',
    'validating',
    'feedback',
    'council',
    'decision',
    'updated',
    'ready',
    'completed',
  ],
};
export const closedStatuses: RequestStatus[] = ['completed', 'rejected', 'cancelled'];
const field = (
  key: string,
  label: string,
  type: FieldDefinition['type'] = 'text',
  required = true,
): FieldDefinition => ({ key, label, type, required });
const year = field('year', 'Năm học');
const semester = field('semester', 'Học kỳ');
const reason = field('reason', 'Lý do đề nghị');
const course = field('course', 'Mã và tên học phần');
const round = field('round', 'Đợt xét / thông báo áp dụng');
const parentDecision = field('parentDecision', 'Số quyết định ngừng học đã được duyệt');
const certificateFields: FieldDefinition[] = [
  field('certificateName', 'Tên chứng chỉ'),
  field('certificateNumber', 'Số hiệu / số vào sổ'),
  field('issuer', 'Đơn vị cấp'),
  field('examDate', 'Ngày thi', 'date'),
  field('issueDate', 'Ngày cấp', 'date'),
  field('expiryDate', 'Ngày hết hạn (nếu có)', 'date', false),
  field('score', 'Điểm / xếp loại'),
  {
    key: 'recognitionPurpose',
    label: 'Mục đích công nhận',
    required: true,
    options: ['Chuẩn đầu ra', 'Miễn học / chuyển điểm học phần'],
  },
];
const documentFields: FieldDefinition[] = [
  { key: 'copies', label: 'Số lượng bản:', type: 'number', required: true },
  {
    key: 'delivery',
    label: 'Hình thức nhận kết quả',
    required: true,
    options: ['Bản giấy tại HC1C'],
  },
];
const catalog: Omit<RequestType, keyof ProcedurePolicy>[] = [
  ...[
    [
      'student-confirmation',
      'Đề nghị cấp văn bản xác nhận sinh viên',
      'Công tác sinh viên',
      [field('purpose', 'Nội dung đề nghị:')],
    ],
    ['military', 'Xác nhận hoãn NVQS', 'Công tác sinh viên', []],
    ['loan', 'Xác nhận SV vay vốn', 'Công tác sinh viên', []],
    ['conduct', 'Kết quả rèn luyện', 'Công tác sinh viên', [year, semester]],
    ['semester-transcript', 'Bảng điểm học kỳ', 'Đào tạo', [year, semester]],
    ['semester-transcript-en', 'Bảng điểm học kỳ (tiếng Anh)', 'Đào tạo', [year, semester]],
    ['year-transcript', 'Bảng điểm năm học', 'Đào tạo', [year]],
    ['year-transcript-en', 'Bảng điểm năm học (tiếng Anh)', 'Đào tạo', [year]],
    ['full-transcript', 'Bảng điểm quá trình', 'Đào tạo', []],
    ['full-transcript-en', 'Bảng điểm quá trình (tiếng Anh)', 'Đào tạo', []],
    ['completion', 'Xác nhận hoàn thành chương trình đào tạo', 'Đào tạo', []],
    ['graduated', 'Xác nhận tốt nghiệp (tiếng Việt)', 'Đào tạo', []],
    ['graduated-en', 'Xác nhận tốt nghiệp (tiếng Anh)', 'Đào tạo', []],
    ['equivalent-course', 'Xác nhận học phần tương đương', 'Đào tạo', [course]],
  ].map(
    ([id, name, department, fields]) =>
      ({
        id,
        name,
        department,
        category: categories[0],
        workflow: 'document',
        fields: [...(fields as FieldDefinition[]), ...documentFields],
        guidance:
          'Kiểm tra thông tin trước khi xác nhận nộp. Theo dõi các bước trình ký, đóng dấu và thông báo nhận kết quả.',
        estimate: 'Theo loại giấy và thông báo của đơn vị xử lý',
      }) as RequestType,
  ),
  {
    id: 'card',
    name: 'Đề nghị cấp lại thẻ SV & BIDV',
    category: categories[1],
    department: 'Công tác sinh viên',
    workflow: 'card',
    fields: [reason],
    guidance: 'Nêu rõ mất thẻ hoặc hư hỏng. Ảnh và lệ phí bổ sung theo hướng dẫn của chuyên viên.',
  },
  {
    id: 'tuition-delay',
    name: 'Đơn xin hoãn nộp học phí',
    category: categories[1],
    department: 'Công tác sinh viên',
    workflow: 'academic',
    fields: [reason, field('requestedDate', 'Ngày đề nghị gia hạn đến', 'date')],
    guidance:
      'Đơn vị tiếp nhận kiểm tra và chuyển đơn vị có thẩm quyền; nộp đơn chưa thay đổi hạn học phí.',
  },
  {
    id: 'language-certificate',
    name: 'Công nhận chứng chỉ ngoại ngữ',
    category: categories[1],
    department: 'Đào tạo',
    workflow: 'certificate',
    evidence: true,
    fields: [
      {
        key: 'examType',
        label: 'Loại bài thi',
        required: true,
        options: [
          'IELTS',
          'TOEIC Listening & Reading',
          'TOEIC 4 kỹ năng',
          'VSTEP',
          'TOEFL iBT',
          'Khác',
        ],
      },
      field('language', 'Ngoại ngữ'),
      ...certificateFields,
    ],
    guidance:
      'Tải bản quét rõ đầy đủ các mặt chứng chỉ. Ghi đúng số hiệu, đơn vị cấp và điểm. Chuyên viên kiểm tra tính xác thực và quy định áp dụng cho khóa học.',
    estimate: 'Tham khảo danh mục hồ sơ: 3 tuần; hạn cụ thể do chuyên viên xác nhận',
  },
  {
    id: 'it-certificate',
    name: 'Công nhận chứng chỉ CNTT',
    category: categories[1],
    department: 'Đào tạo',
    workflow: 'certificate',
    evidence: true,
    fields: [
      ...certificateFields,
      field('program', 'Chương trình chứng chỉ CNTT'),
      field('organizer', 'Đơn vị tổ chức thi'),
      field('level', 'Cấp độ / module'),
      field('lookupCode', 'Mã tra cứu (nếu có)', 'text', false),
    ],
    guidance:
      'Tải chứng chỉ CNTT và bảng kết quả/module nếu có. Không tự quy đổi chứng chỉ sang chuẩn đầu ra trước khi thẩm tra.',
    estimate: 'Tham khảo danh mục hồ sơ: 3 tuần; hạn cụ thể do chuyên viên xác nhận',
  },
  {
    id: 'exam-delay',
    name: 'Xét hoãn thi',
    category: categories[2],
    department: 'Đào tạo',
    workflow: 'academic',
    evidence: true,
    fields: [course, semester, field('examDate', 'Ngày thi', 'date'), reason],
    guidance:
      'Cần minh chứng lý do hoãn thi. Hồ sơ hợp lệ được trình cấp có thẩm quyền và cập nhật trạng thái thi sau quyết định.',
  },
  {
    id: 'extra-exam',
    name: 'Đăng ký thi bổ sung',
    category: categories[2],
    department: 'Đào tạo',
    workflow: 'academic',
    fields: [
      course,
      round,
      field('postponement', 'Số quyết định / mã hồ sơ hoãn thi được duyệt'),
      field('examDate', 'Ngày thi bổ sung', 'date'),
    ],
    guidance:
      'Chỉ tiếp nhận khi có hoãn thi hợp lệ và đợt đăng ký phù hợp đang mở. Chuyên viên phải đối chiếu trước khi trình duyệt.',
  },
  {
    id: 'regrade',
    name: 'Đề nghị xét phúc khảo bài thi',
    category: categories[2],
    department: 'Đào tạo',
    workflow: 'regrade',
    fields: [
      course,
      semester,
      field('publishedDate', 'Ngày công bố điểm', 'date'),
      field('originalScore', 'Điểm đã công bố', 'number'),
      round,
      reason,
    ],
    guidance:
      'Đối chiếu hạn nhận theo thông báo. Chuyên viên tiếp nhận/chuyển Khảo thí, không tự quyết định điểm phúc khảo.',
  },
  {
    id: 'leave',
    name: 'Xét ngừng học tạm thời',
    category: categories[2],
    department: 'Đào tạo',
    workflow: 'academic',
    evidence: true,
    fields: [reason, field('from', 'Từ học kỳ'), field('until', 'Đến học kỳ')],
    guidance:
      'Đính kèm minh chứng tương ứng: cá nhân, nghĩa vụ quân sự hoặc điều trị bệnh. Thời gian áp dụng theo quy định của khóa.',
  },
  {
    id: 'extend-leave',
    name: 'Gia hạn ngừng học',
    category: categories[2],
    department: 'Đào tạo',
    workflow: 'academic',
    evidence: true,
    fields: [parentDecision, reason, field('until', 'Gia hạn đến học kỳ')],
    guidance:
      'Phải liên kết quyết định ngừng học hợp lệ. Chuyên viên đối chiếu thời gian được phép theo khóa.',
  },
  {
    id: 'return',
    name: 'Xét trở lại học',
    category: categories[2],
    department: 'Đào tạo',
    workflow: 'academic',
    fields: [parentDecision, semester],
    guidance:
      'Chỉ cập nhật trạng thái học tập sau quyết định được phê duyệt; chuyên viên trả quyết định cho sinh viên.',
  },
  {
    id: 'graduation',
    name: 'Đăng ký xét công nhận tốt nghiệp',
    category: categories[2],
    department: 'Đào tạo',
    workflow: 'graduation',
    fields: [round, field('identity', 'Xác nhận thông tin nhân thân / thông tin cần đính chính')],
    guidance:
      'Theo đợt do Trường mở: rà soát điều kiện, tiếp nhận phản hồi, trình Hội đồng và ban hành quyết định. Đơn đăng ký không thay thế kết quả xét.',
  },
  {
    id: 'graduation-delay',
    name: 'Xét hoãn công nhận tốt nghiệp',
    category: categories[2],
    department: 'Đào tạo',
    workflow: 'academic',
    fields: [round, reason],
    guidance:
      'Hồ sơ hoãn công nhận tốt nghiệp được xét riêng với hồ sơ đăng ký công nhận tốt nghiệp.',
  },
  {
    id: 'second-program',
    name: 'Xét học chương trình 2 tại Trường',
    category: categories[2],
    department: 'Đào tạo',
    workflow: 'academic',
    fields: [field('program', 'Chương trình thứ hai'), round, reason],
    guidance:
      'Đối chiếu điều kiện học vụ theo khóa. Chương trình thứ hai chỉ được cập nhật sau quyết định.',
  },
  {
    id: 'scholarship',
    name: 'Phản hồi xét học bổng khuyến khích học tập',
    category: categories[2],
    department: 'Công tác sinh viên',
    workflow: 'evaluation',
    fields: [round, year, semester, reason],
    guidance:
      'Gửi phản hồi/bổ sung cho đợt xét và danh sách dự kiến do Trường công bố. Kết quả phải qua Hội đồng, quyết định và bộ phận tài chính.',
  },
  {
    id: 'withdrawal',
    name: 'Đề nghị thôi học tự nguyện',
    category: categories[3],
    department: 'Đào tạo',
    workflow: 'academic',
    evidence: true,
    fields: [reason, field('phone', 'Số điện thoại liên hệ')],
    guidance:
      'Đính kèm hồ sơ theo hướng dẫn của Trường. Chuyên viên kiểm tra nghĩa vụ liên quan trước khi trình quyết định; khác với buộc thôi học do học vụ.',
  },
  ...[
    ['office365', 'Hỗ trợ tài khoản Office365'],
    ['lms', 'Hỗ trợ tài khoản LMS'],
    ['portal-password', 'Hỗ trợ tài khoản cổng sinh viên'],
  ].map(
    ([id, name]) =>
      ({
        id,
        name,
        category: categories[4],
        department: 'Hỗ trợ CNTT',
        workflow: 'support',
        fields: [
          field('account', 'Tài khoản cần hỗ trợ'),
          {
            key: 'issueType',
            label: 'Loại sự cố',
            required: true,
            options: [
              'Quên mật khẩu',
              'Không đăng nhập được',
              'Sai thông tin tài khoản',
              'Chưa được cấp tài khoản',
              'Sự cố khác',
            ],
          },
          field('email', 'Email liên hệ', 'email'),
          reason,
        ],
        guidance:
          'Mô tả lỗi và đính kèm ảnh nếu có. Không gửi mật khẩu hoặc mã OTP. Xác minh danh tính qua kênh được Nhà trường hướng dẫn.',
      }) as RequestType,
  ),
];
export const requestTypes: RequestType[] = catalog.map((type) => ({
  ...type,
  ...procedurePolicy(type),
}));
export function getRequestFields(typeId: string, values: Record<string, string>) {
  const type = getRequestType(typeId);
  if (typeId !== 'language-certificate') return type.fields;
  const skills =
    values.examType === 'TOEIC Listening & Reading'
      ? ['listening', 'reading']
      : values.examType && values.examType !== 'Khác'
        ? ['listening', 'speaking', 'reading', 'writing']
        : [];
  const labels: Record<string, string> = {
    listening: 'Điểm nghe',
    speaking: 'Điểm nói',
    reading: 'Điểm đọc',
    writing: 'Điểm viết',
  };
  return [...type.fields, ...skills.map((key) => field(key, labels[key], 'number'))];
}
export function getRequestType(id: string) {
  const type = requestTypes.find((item) => item.id === id);
  if (!type) throw new Error('Loại hồ sơ không tồn tại.');
  return type;
}
export function nextStatus(typeId: string, status: RequestStatus) {
  const steps = requestSteps(typeId, status);
  const index = steps.indexOf(status);
  return index < 0 ? undefined : steps[index + 1];
}
export function requestSteps(typeId: string, status?: RequestStatus) {
  const type = getRequestType(typeId);
  // Keep records already on the old card/document path operable without rewriting their history.
  return type.workflow === 'card' && (status === 'signed' || status === 'sealed')
    ? workflows.document
    : workflows[type.workflow];
}
export const actionLabels: Partial<Record<RequestStatus, string>> = {
  received: 'Tiếp nhận hồ sơ',
  validating: 'Kiểm tra hồ sơ',
  verified: 'Ghi nhận kết quả thẩm tra',
  review: 'Trình xét duyệt',
  feedback: 'Đối chiếu và tiếp nhận phản hồi',
  council: 'Ghi nhận đã trình Hội đồng',
  regrading: 'Ghi nhận chuyển chấm phúc khảo',
  signed: 'Ghi nhận văn bản đã ký',
  sealed: 'Ghi nhận đóng dấu',
  decision: 'Ghi nhận quyết định',
  updated: 'Ghi nhận kết quả cập nhật',
  ready: 'Thông báo trả kết quả',
  completed: 'Xác nhận trả kết quả',
};
export function isOverdue(
  request: { dueDate?: string; status: RequestStatus },
  today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }),
) {
  return !!request.dueDate && request.dueDate < today && !closedStatuses.includes(request.status);
}
