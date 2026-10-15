import type { User } from '@/features/auth';

export type Department = 'Đào tạo' | 'Công tác sinh viên' | 'Hỗ trợ CNTT';
export type RequestStatus =
  | 'submitted'
  | 'received'
  | 'validating'
  | 'supplement'
  | 'review'
  | 'feedback'
  | 'council'
  | 'regrading'
  | 'signed'
  | 'sealed'
  | 'verified'
  | 'decision'
  | 'updated'
  | 'ready'
  | 'completed'
  | 'rejected'
  | 'cancelled';
export type Workflow =
  | 'document'
  | 'academic'
  | 'certificate'
  | 'support'
  | 'regrade'
  | 'evaluation'
  | 'graduation'
  | 'card';
export interface ProcedurePolicy {
  submissionMode: 'online' | 'direct' | 'hybrid';
  evidenceMode: 'online' | 'physical' | 'mixed';
  processingMode: 'internal' | 'external' | 'mixed';
  resultDeliveryMode: 'digital' | 'pickup' | 'announcement' | 'configured';
  requiresOriginalVerification: boolean;
  requiresApprovalRecord: boolean;
  requiresSignatureRecord: boolean;
  requiresSealRecord: boolean;
  requiresPickup: boolean;
  requiresCampaign: boolean;
  policyNote: string;
  source: string;
}
export interface FieldDefinition {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'email' | 'number';
  required?: boolean;
  options?: string[];
}
export interface RequestType extends ProcedurePolicy {
  id: string;
  name: string;
  category: string;
  department: Department;
  workflow: Workflow;
  fields: FieldDefinition[];
  evidence?: boolean;
  guidance: string;
  estimate?: string;
}
export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  blob: Blob;
  addedAt: string;
  purpose: 'evidence' | 'result';
  artifactKind?: 'evidence' | 'reference-copy';
}
export interface RequestEvent {
  id: string;
  at: string;
  actor: string;
  status: RequestStatus;
  message: string;
  kind?: 'seed' | 'submit' | 'transition' | 'assignment' | 'review' | 'supplement' | 'cancel';
  visibility?: 'public' | 'internal';
  actorId?: string;
  fromStatus?: RequestStatus;
  changes?: { field: string; before: string; after: string }[];
}
export interface ReviewData {
  verification: string;
  recognizedLevel: string;
  convertedScore: string;
  reference: string;
  internalNote: string;
  identityChecked?: boolean;
  evidenceChecked?: boolean;
  originalRequired?: boolean;
  originalChecked?: boolean;
  verificationStatus?: string;
  verificationChannel?: string;
  verificationDate?: string;
  verificationRef?: string;
  conversionBasis?: string;
  recommendation?: string;
  reviewer?: string;
  decisionOutcome?: string;
  decisionDate?: string;
  academicUpdate?: string;
  signatureRef?: string;
  sealRef?: string;
  campaignChecked?: boolean;
  externalReference?: string;
  deliveryMode?: 'digital' | 'pickup' | 'announcement';
  pickupLocation?: string;
  pickupTime?: string;
  pickupInstructions?: string;
  announcementUrl?: string;
  deliveryAcknowledged?: boolean;
  responseDraft?: string;
}
export interface StudentRequest {
  id: string;
  revision: number;
  typeId: string;
  student: Pick<User, 'id' | 'fullName' | 'studentId' | 'className'>;
  status: RequestStatus;
  resumeStatus?: RequestStatus;
  supplementMessage?: string;
  createdAt: string;
  updatedAt: string;
  assigneeId?: string;
  dueDate?: string;
  priority: 'normal' | 'urgent';
  fields: Record<string, string>;
  note: string;
  attachments: Attachment[];
  events: RequestEvent[];
  review: ReviewData;
  result: string;
  demo?: { version: number; batch: string };
  waitingFor?: 'external';
}
export interface CreateRequest {
  typeId: string;
  fields: Record<string, string>;
  note: string;
  files: File[];
}
export interface StaffMember {
  id: string;
  username: string;
  name: string;
  department: Department;
}
