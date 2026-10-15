// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { demoStaffAccounts, demoStudentAccounts } from '@/shared/config/demoAccounts';
import { seedRequests } from '../mocks/requests.mock';
import { demoRecordCount } from '../data/demoScenarios';
import {
  closedStatuses,
  getRequestType,
  nextStatus,
  requestTypes,
  staffMembers,
  workflows,
} from '../data/requestCatalog';
import { submissionIssues, transitionIssues, validateAssignment } from './requestRules';
import { requestState } from '../data/requestState';

const records = seedRequests();
describe('expanded demo coverage', () => {
  it('covers every step and branch of every catalog procedure with valid student submissions', () => {
    expect(records.length).toBe(demoRecordCount);
    expect(new Set(records.map((r) => r.id)).size).toBe(records.length);
    for (const type of requestTypes) {
      const cases = records.filter((r) => r.typeId === type.id);
      for (const status of [...workflows[type.workflow], 'supplement', 'rejected', 'cancelled']) {
        expect(
          cases.some((r) => r.status === status),
          `${type.id}: ${status}`,
        ).toBe(true);
      }
      expect(cases.some((r) => r.status === 'submitted' && !r.assigneeId)).toBe(true);
      expect(cases.some((r) => r.status === 'submitted' && r.assigneeId)).toBe(true);
    }
    for (const r of records) {
      const files = r.attachments
        .filter((a) => a.purpose === 'evidence')
        .map((a) => new File([a.blob], a.name, { type: a.type }));
      expect(
        submissionIssues({ typeId: r.typeId, fields: r.fields, note: r.note, files }),
        r.id,
      ).toEqual({});
      expect(demoStudentAccounts.some((s) => s.id === r.student.id)).toBe(true);
      if (r.assigneeId) {
        expect(staffMembers.find((s) => s.id === r.assigneeId)?.department).toBe(
          getRequestType(r.typeId).department,
        );
      }
    }
  });
  it('gives every login work to test and same-department colleagues for reassignment', () => {
    const admin = { id: 'admin', fullName: 'Admin', username: 'admin01', role: 'admin' as const };
    for (const s of demoStaffAccounts) {
      const own = records.filter(
        (r) => r.assigneeId === s.id && !closedStatuses.includes(r.status),
      );
      expect(own.length, s.username).toBeGreaterThan(0);
      const colleagues = staffMembers.filter((c) => c.department === s.department && c.id !== s.id);
      expect(colleagues.length).toBeGreaterThan(0);
      expect(() => validateAssignment(admin, own[0], colleagues[0].id, '2099-01-01')).not.toThrow();
    }
    for (const student of demoStudentAccounts) {
      expect(
        records.some((r) => r.student.id === student.id),
        student.username,
      ).toBe(true);
    }
  });
  it('provides certificate variants and external verification cases without inventing conversions', () => {
    const languages = records.filter((r) => r.typeId === 'language-certificate');
    expect(new Set(languages.map((r) => r.fields.examType)).size).toBe(6);
    for (const typeId of ['language-certificate', 'it-certificate']) {
      const cases = records.filter((r) => r.typeId === typeId);
      const pending = cases.find((r) => r.review.verificationStatus === 'pending')!;
      expect(requestState(pending).external).toBe(true);
      const invalid = cases.find((r) => r.review.verificationStatus === 'invalid')!;
      expect(
        transitionIssues(invalid, 'verified', 'Test', invalid.review, '', [], true).join(' '),
      ).toContain('xác minh hợp lệ');
      expect(cases.every((r) => !r.review.convertedScore)).toBe(true);
    }
  });
  it('can finish each procedure from its ready case using the seeded result and explicit delivery acknowledgment', () => {
    for (const type of requestTypes) {
      const r = records.find((r) => r.typeId === type.id && r.status === 'ready')!;
      expect(nextStatus(type.id, r.status)).toBe('completed');
      expect(
        transitionIssues(
          r,
          'completed',
          'Đã bàn giao kết quả mẫu',
          { ...r.review, deliveryAcknowledged: true },
          r.result,
          [],
          true,
        ),
        type.id,
      ).toEqual([]);
    }
  });
});
