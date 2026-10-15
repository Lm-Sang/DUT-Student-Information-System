import { demoStudentAccounts } from '@/shared/config/demoAccounts';
import { demoScenarios, demoVersion } from '../data/demoScenarios';
import {
  getRequestFields,
  getRequestType,
  staffMembers,
  workflows,
  statusLabels,
} from '../data/requestCatalog';
import type { Attachment, StudentRequest } from '../types/requests';
import { seedReview } from './review.mock';
import { demoPdf } from './evidence.mock';
import { evidenceImages } from './imageEvidence.mock';

export function seedRequests(): StudentRequest[] {
  const now = new Date();
  const batch = crypto.randomUUID();
  const date = (offset: number) => new Date(now.getTime() + offset * 86400000).toISOString();
  return demoScenarios.map(({ typeId, status, unassigned, resumeStatus, verification }, index) => {
    const type = getRequestType(typeId);
    const fields: Record<string, string> = {
      examType: [
        'IELTS',
        'TOEIC Listening & Reading',
        'TOEIC 4 kỹ năng',
        'VSTEP',
        'TOEFL iBT',
        'Khác',
      ][index % 6],
    };
    for (const field of getRequestFields(typeId, fields)) {
      fields[field.key] =
        fields[field.key] ??
        field.options?.[0] ??
        (field.type === 'date'
          ? date(-30).slice(0, 10)
          : field.type === 'number'
            ? '1'
            : `${field.label.replace(/:$/, '')} — dữ liệu mẫu`);
    }
    const examples: Record<string, string> = {
      year: '2026–2027',
      semester: 'Học kỳ 1',
      round: 'Đợt xét tháng 10/2026 (mẫu)',
      course: [
        '1022100 – Lập trình hướng đối tượng',
        '0011100 – Giải tích 1',
        '1023500 – Cơ sở dữ liệu',
      ][index % 3],
      reason: `Đề nghị ${type.name.toLocaleLowerCase('vi')} theo hồ sơ đính kèm (tình huống mẫu).`,
      purpose: ['Nộp hồ sơ thực tập', 'Hoàn thiện hồ sơ học bổng', 'Bổ sung hồ sơ cá nhân'][
        index % 3
      ],
      phone: '0900000000',
      requestedDate: date(30).slice(0, 10),
      from: 'Học kỳ 1, năm học 2026–2027',
      until: 'Học kỳ 2, năm học 2026–2027',
      parentDecision: `DEMO-QD-${index + 1}`,
      copies: String(1 + (index % 3)),
    };
    for (const field of getRequestFields(typeId, fields)) {
      if (!field.options && examples[field.key]) fields[field.key] = examples[field.key];
    }
    if (type.workflow === 'support')
      Object.assign(fields, {
        account: `demo.student${index}@example.edu.vn`,
        email: `demo.contact${index}@example.com`,
        reason: 'Không thể đăng nhập sau khi thay đổi thiết bị; cần hướng dẫn xác minh danh tính.',
      });
    if (type.workflow === 'certificate')
      Object.assign(fields, {
        certificateName:
          typeId === 'it-certificate' ? 'Ứng dụng CNTT cơ bản (mẫu)' : fields.examType,
        certificateNumber: `DEMO-CC-${index}`,
        issuer: 'Đơn vị cấp giả lập',
        examDate: date(-50).slice(0, 10),
        issueDate: date(-40).slice(0, 10),
        expiryDate: date(320).slice(0, 10),
        score: 'Đạt (mẫu)',
        language: 'Tiếng Anh',
        program: 'Ứng dụng CNTT',
        organizer: 'Trung tâm giả lập',
        level: 'Cơ bản',
        lookupCode: `DEMO-${index}`,
      });
    if (typeId === 'language-certificate') {
      const scores: Record<string, string[]> = {
        IELTS: ['6.5', '7', '6', '6.5', '6.5'],
        'TOEIC Listening & Reading': ['750', '400', '0', '350', '0'],
        'TOEIC 4 kỹ năng': ['750; nói 150; viết 140', '400', '150', '350', '140'],
        VSTEP: ['6.5', '7', '6', '6.5', '6.5'],
        'TOEFL iBT': ['90', '24', '22', '23', '21'],
        Khác: ['Đạt theo chứng chỉ mẫu'],
      };
      const values = scores[fields.examType];
      ['score', 'listening', 'speaking', 'reading', 'writing'].forEach((key, i) => {
        if (key in fields) fields[key] = values[i] ?? '';
      });
    }
    const ext = ['pdf', 'png', 'jpg'][index % 3];
    const blob =
      ext === 'pdf'
        ? demoPdf(`Record ${index + 1}`)
        : new Blob(
            [Uint8Array.from(atob(evidenceImages[ext as 'png' | 'jpg']), (c) => c.charCodeAt(0))],
            { type: ext === 'png' ? 'image/png' : 'image/jpeg' },
          );
    const attachments: Attachment[] = [
      {
        id: crypto.randomUUID(),
        name: `minh-chung-mau-${index + 1}.${ext}`,
        size: blob.size,
        type: blob.type,
        blob,
        purpose: 'evidence',
        artifactKind: 'evidence',
        addedAt: date(0),
      },
    ];
    const isResult = ['ready', 'completed'].includes(status);
    if (isResult || (type.workflow === 'certificate' && ['decision', 'updated'].includes(status))) {
      const resultBlob = demoPdf('Result - reference copy only');
      attachments.push({
        id: crypto.randomUUID(),
        name: 'ket-qua-mau-tham-khao.pdf',
        size: resultBlob.size,
        type: resultBlob.type,
        blob: resultBlob,
        purpose: 'result',
        artifactKind: 'reference-copy',
        addedAt: date(0),
      });
    }
    const eligible = (index < 40 ? staffMembers.slice(0, 4) : staffMembers).filter(
      (s) => s.department === type.department,
    );
    const assigneeId = unassigned ? undefined : eligible[index % eligible.length].id;
    return {
      id: `YC-DEMO-${String(index + 1).padStart(3, '0')}-${batch.slice(0, 8).toUpperCase()}`,
      revision: 1,
      typeId,
      student:
        index < 4 || [6, 7, 10, 13, 15, 25, 32].includes(index)
          ? demoStudentAccounts[0]
          : demoStudentAccounts[1 + (index % (index < 40 ? 3 : demoStudentAccounts.length - 1))],
      status,
      assigneeId,
      demo: { version: demoVersion, batch },
      createdAt: date(-3 - (index % 18)),
      updatedAt: date(0),
      dueDate: date(index % 5 === 0 ? -2 : index % 3 === 0 ? 1 : 5).slice(0, 10),
      priority: index % 7 === 0 ? 'urgent' : 'normal',
      fields,
      note: `Hồ sơ giả lập: ${type.name} — ${statusLabels[status]}. Không phải yêu cầu thật.`,
      attachments,
      ...(status === 'supplement'
        ? {
            resumeStatus: resumeStatus ?? 'validating',
            supplementMessage:
              type.workflow === 'certificate'
                ? 'Bổ sung bản chụp đủ các mặt chứng chỉ, rõ số hiệu và kết quả từng kỹ năng/module.'
                : type.workflow === 'support'
                  ? 'Bổ sung ảnh lỗi và email liên hệ. Không gửi mật khẩu hoặc mã OTP.'
                  : 'Vui lòng bổ sung bản chụp rõ thông tin và giải trình nội dung chưa khớp.',
          }
        : {}),
      review: seedReview(
        type,
        status === 'supplement' ? (resumeStatus ?? 'validating') : status,
        date(-1).slice(0, 10),
        `DEMO-${index + 1}`,
        verification,
      ),
      result: isResult
        ? 'Kết quả mẫu đã sẵn sàng. Xem hướng dẫn nhận; bản tải xuống chỉ dùng tham khảo.'
        : '',
      events: [
        {
          id: crypto.randomUUID(),
          at: date(0),
          actor: `Hệ thống demo v${demoVersion}`,
          kind: 'seed',
          visibility: 'public',
          status,
          message: `Nhập hồ sơ mẫu tại bước “${statusLabels[status]}”. Không có lịch sử thực hiện các bước trước. Quy trình gồm ${workflows[type.workflow].length} bước.${status === 'rejected' ? ' Lý do mẫu: hồ sơ không đáp ứng điều kiện của đợt xét sau khi đối chiếu.' : status === 'cancelled' ? ' Lý do mẫu: sinh viên nộp nhầm loại đề nghị.' : ''}`,
        },
      ],
    };
  });
}
