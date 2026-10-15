import { requestTypes, workflows } from './requestCatalog';
import type { RequestStatus } from '../types/requests';

export const demoVersion = 3;
export interface DemoScenario {
  typeId: string;
  status: RequestStatus;
  unassigned?: boolean;
  resumeStatus?: RequestStatus;
  verification?: 'pending' | 'invalid';
}

// Keep the original 40 cases first so existing walkthroughs still work.
const legacyScenarios: [string, RequestStatus, boolean?][] = [
  ['loan', 'ready'],
  ['tuition-delay', 'received'],
  ['card', 'submitted', true],
  ['regrade', 'review'],
  ['student-confirmation', 'validating'],
  ['return', 'submitted', true],
  ['language-certificate', 'validating'],
  ['it-certificate', 'supplement'],
  ['language-certificate', 'verified'],
  ['it-certificate', 'review'],
  ['withdrawal', 'validating'],
  ['graduation', 'feedback'],
  ['scholarship', 'council'],
  ['office365', 'received'],
  ['lms', 'validating'],
  ['portal-password', 'supplement'],
  ['exam-delay', 'received'],
  ['leave', 'review'],
  ['extend-leave', 'decision'],
  ['extra-exam', 'submitted', true],
  ['second-program', 'updated'],
  ['graduation-delay', 'rejected'],
  ['military', 'signed'],
  ['full-transcript', 'sealed'],
  ['card', 'review'],
  ['student-confirmation', 'completed'],
  ['it-certificate', 'completed'],
  ['office365', 'completed'],
  ['return', 'cancelled'],
  ['regrade', 'regrading'],
  ['language-certificate', 'decision'],
  ['scholarship', 'supplement'],
  ['withdrawal', 'submitted', true],
  ...requestTypes
    .filter((t) =>
      [
        'semester-transcript',
        'semester-transcript-en',
        'year-transcript',
        'year-transcript-en',
        'full-transcript-en',
        'completion',
        'graduated',
      ].includes(t.id),
    )
    .map((t) => [t.id, 'received'] as [string, RequestStatus]),
];

export const demoScenarios: DemoScenario[] = [
  ...legacyScenarios.map(([typeId, status, unassigned]) => ({ typeId, status, unassigned })),
  ...requestTypes.flatMap((type): DemoScenario[] => [
    ...workflows[type.workflow].map((status) => ({
      typeId: type.id,
      status,
      unassigned: status === 'submitted',
    })),
    { typeId: type.id, status: 'submitted' },
    { typeId: type.id, status: 'supplement', resumeStatus: 'validating' },
    { typeId: type.id, status: 'rejected' },
    { typeId: type.id, status: 'cancelled', unassigned: true },
    ...(type.workflow === 'certificate'
      ? [
          { typeId: type.id, status: 'validating' as const, verification: 'pending' as const },
          { typeId: type.id, status: 'validating' as const, verification: 'invalid' as const },
          { typeId: type.id, status: 'supplement' as const, resumeStatus: 'verified' as const },
        ]
      : []),
  ]),
];
export const demoRecordCount = demoScenarios.length;
