import { describe, expect, it } from 'vitest';
import type { User } from '@/features/auth';
import type { CreateRequest, StudentRequest } from '../types/requests';
import {
  assertRead,
  validateAssignment,
  validateFiles,
  validateSubmission,
  validateTransition,
  transitionIssues,
  submissionIssues,
} from './requestRules';
import { isOverdue, nextStatus } from '../data/requestCatalog';

const student: User = { id: 's1', username: 's1', fullName: 'Sinh viên', role: 'student' };
const staff: User = {
  id: 'u-staff-1',
  username: 'staff01',
  fullName: 'Chuyên viên',
  role: 'staff',
};
const admin: User = { ...staff, id: 'admin', role: 'admin' };
const review = {
  verification: '',
  recognizedLevel: '',
  convertedScore: '',
  reference: '',
  internalNote: '',
};
const request: StudentRequest = {
  id: 'r1',
  revision: 1,
  typeId: 'it-certificate',
  student,
  assigneeId: staff.id,
  status: 'validating',
  createdAt: '',
  updatedAt: '',
  priority: 'normal',
  fields: {},
  note: '',
  attachments: [],
  events: [],
  review,
  result: '',
};
describe('request workflow boundaries', () => {
  it('requires original and campaign checks on their corresponding procedures', () => {
    const base = { ...review, identityChecked: true, evidenceChecked: true };
    expect(
      transitionIssues({ ...request, typeId: 'withdrawal' }, 'review', 'Kiểm tra', base, ''),
    ).toContain('Cần ghi nhận đã đối chiếu bản gốc.');
    expect(
      transitionIssues({ ...request, typeId: 'extra-exam' }, 'review', 'Kiểm tra', base, ''),
    ).toContain('Cần đối chiếu điều kiện và thời hạn của đợt áp dụng.');
  });
  it('blocks completion until recorded signing, sealing, pickup and actual delivery', () => {
    const doc = { ...request, typeId: 'loan', status: 'ready' as const };
    const ready = {
      ...review,
      deliveryMode: 'pickup' as const,
      pickupLocation: 'HC1C',
      pickupTime: 'Theo hẹn',
      pickupInstructions: 'Thẻ SV',
    };
    expect(
      transitionIssues(doc, 'completed', 'Trả', ready, 'Giấy đã có', [], true).length,
    ).toBeGreaterThan(0);
    const complete = {
      ...ready,
      signatureRef: 'SIGN-1',
      sealRef: 'SEAL-1',
      deliveryAcknowledged: true,
    };
    expect(transitionIssues(doc, 'completed', 'Trả', complete, 'Giấy đã có', [], true)).toEqual([]);
    expect(transitionIssues(doc, 'completed', 'Trả', complete, 'Giấy đã có', [], false)).toContain(
      'Xác nhận thao tác bên ngoài đã thực hiện và có căn cứ.',
    );
  });
  it('validates dynamic language skills without requiring unrelated TOEIC skills', () => {
    const data: CreateRequest = {
      typeId: 'language-certificate',
      fields: {
        examType: 'TOEIC Listening & Reading',
        language: 'Tiếng Anh',
        certificateName: 'TOEIC',
        certificateNumber: '001',
        issuer: 'Test',
        examDate: '2025-01-01',
        issueDate: '2025-01-02',
        score: '700',
        recognitionPurpose: 'Chuẩn đầu ra',
        listening: '350',
        reading: '350',
      },
      note: '',
      files: [new File(['%PDF'], 'proof.pdf', { type: 'application/pdf' })],
    };
    expect(submissionIssues(data)).toEqual({});
    data.fields.examType = 'IELTS';
    expect(submissionIssues(data)).toHaveProperty('speaking');
    expect(submissionIssues(data)).toHaveProperty('writing');
    data.fields.speaking = '-1';
    expect(submissionIssues(data).speaking).toContain('không âm');
  });
  it('limits student and specialist access to their own records', () => {
    expect(() => assertRead(student, request)).not.toThrow();
    expect(() => assertRead({ ...student, id: 's2' }, request)).toThrow('quyền');
    expect(() => assertRead({ ...staff, id: 'u-staff-4' }, request)).toThrow('quyền');
    expect(() => assertRead(admin, request)).not.toThrow();
  });
  it('requires admin assignment to the responsible department and valid deadline', () => {
    expect(() => validateAssignment(staff, request, staff.id, '2099-01-01')).toThrow('admin');
    expect(() => validateAssignment(admin, request, 'u-staff-2', '2099-01-01')).toThrow('đơn vị');
    expect(() => validateAssignment(admin, request, staff.id, '2000-01-01')).toThrow('hôm nay');
    expect(() => validateAssignment(admin, request, staff.id, '2099-01-01')).not.toThrow();
  });
  it('prevents skipped steps and writes by unassigned staff or admin', () => {
    expect(() => validateTransition(staff, request, 'completed', 'Done', review, '')).toThrow();
    expect(() => validateTransition(admin, request, 'verified', 'Done', review, '')).toThrow(
      'phân công',
    );
    expect(() =>
      validateTransition({ ...staff, id: 'u-staff-4' }, request, 'verified', 'Done', review, ''),
    ).toThrow('phân công');
  });
  it('requires evidence verification, document references and delivery instructions', () => {
    expect(() => validateTransition(staff, request, 'verified', 'Kiểm tra', review, '')).toThrow(
      'đối chiếu',
    );
    expect(() =>
      validateTransition(
        staff,
        request,
        'verified',
        'Kiểm tra',
        {
          ...review,
          identityChecked: true,
          evidenceChecked: true,
          verification: 'Đã đối chiếu đơn vị cấp',
          verificationStatus: 'valid',
          verificationChannel: 'Email đơn vị cấp',
          verificationDate: '2026-01-01',
          verificationRef: 'DEMO-REF',
          recognizedLevel: 'CNTT cơ bản',
        },
        '',
        [],
        true,
      ),
    ).not.toThrow();
    expect(() =>
      validateTransition(staff, { ...request, status: 'review' }, 'decision', 'Duyệt', review, ''),
    ).toThrow('văn bản');
    expect(() =>
      validateTransition(
        staff,
        { ...request, status: 'updated' },
        'ready',
        'Trả kết quả',
        review,
        '',
      ),
    ).toThrow('hướng dẫn');
  });
  it('requires public reasons and waits for student supplementation', () => {
    expect(() => validateTransition(staff, request, 'rejected', ' ', review, '')).toThrow(
      'phản hồi',
    );
    expect(() =>
      validateTransition(staff, request, 'supplement', 'Bổ sung mặt sau', review, ''),
    ).not.toThrow();
    expect(() =>
      validateTransition(
        staff,
        { ...request, status: 'supplement' },
        'verified',
        'Done',
        review,
        '',
      ),
    ).toThrow('Đang chờ');
  });
  it('checks certificate required fields, attachment and date ordering', () => {
    const input: CreateRequest = {
      typeId: 'it-certificate',
      note: '',
      files: [],
      fields: {
        certificateName: 'CNTT',
        certificateNumber: 'A1',
        issuer: 'DUT',
        examDate: '2020-01-01',
        issueDate: '2020-01-02',
        score: 'Đạt',
        recognitionPurpose: 'Chuẩn đầu ra',
        program: 'CNTT',
        organizer: 'DUT',
        level: 'Cơ bản',
      },
    };
    expect(() => validateSubmission(student, input)).toThrow('minh chứng');
    input.files = [new File(['%PDF'], 'proof.pdf', { type: 'application/pdf' })];
    expect(() => validateSubmission(student, input)).not.toThrow();
    input.fields.issueDate = '2019-12-31';
    expect(() => validateSubmission(student, input)).toThrow('Ngày cấp');
  });
  it('rejects unsupported files, mismatched MIME and oversized evidence', () => {
    expect(() => validateFiles([new File(['x'], 'bad.exe')])).toThrow('PDF');
    expect(() => validateFiles([new File(['x'], 'bad.pdf', { type: 'text/html' })])).toThrow('PDF');
    expect(() =>
      validateFiles([
        new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.pdf', { type: 'application/pdf' }),
      ]),
    ).toThrow('10MB');
  });
  it('counts overdue only for active requests and keeps document steps separate', () => {
    expect(isOverdue({ dueDate: '2026-10-01', status: 'completed' }, '2026-10-14')).toBe(false);
    expect(isOverdue({ dueDate: '2026-10-01', status: 'review' }, '2026-10-14')).toBe(true);
    expect(nextStatus('loan', 'signed')).toBe('sealed');
    expect(nextStatus('return', 'decision')).toBe('updated');
    expect(nextStatus('loan', 'rejected')).toBeUndefined();
  });
});
