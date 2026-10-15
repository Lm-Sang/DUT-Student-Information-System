// @vitest-environment node
import { demoRecordCount, demoVersion } from '../data/demoScenarios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import type { User } from '@/features/auth';
import { createRequestStore, type RequestStore } from '../storage/requestStore';
import { createRequestsService } from './requests.service';
import { seedRequests } from '../mocks/requests.mock';
import { requestTypes, staffMembers } from '../data/requestCatalog';
import { workflows } from '../data/requestCatalog';
import { seedReview } from '../mocks/review.mock';
import { demoStaffAccounts, demoStudentAccounts } from '@/shared/config/demoAccounts';
import type { StudentRequest } from '../types/requests';

const student: User = {
  id: 'u-student-1',
  username: 'student01',
  fullName: 'Sinh viên test',
  role: 'student',
};
const admin: User = { id: 'u-admin-1', username: 'admin01', fullName: 'Admin', role: 'admin' };
const staff: User = {
  id: 'u-staff-2',
  username: 'staff02',
  fullName: 'Chuyên viên',
  role: 'staff',
};
const stores: RequestStore[] = [];
const setup = (seed = false) => {
  const store = createRequestStore({
    factory: new IDBFactory(),
    initial: seed ? seedRequests : () => [],
  });
  stores.push(store);
  const changed = vi.fn();
  return { store, service: createRequestsService(store, changed), changed };
};
const input = () => ({
  typeId: 'student-confirmation',
  fields: { purpose: 'Thực tập', copies: '1', delivery: 'Bản giấy tại HC1C' },
  note: '',
  files: [new File(['%PDF-test-actual-bytes'], 'proof.pdf', { type: 'application/pdf' })],
});
afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(stores.splice(0).map((s) => s.close()));
});

describe('transactional case service', () => {
  it.each(requestTypes)(
    'processes $id from submission to completion with a new specialist account',
    async (type) => {
      const { service } = setup();
      const sample = seedRequests().find((r) => r.typeId === type.id)!;
      const owner = demoStudentAccounts[11];
      const processor = demoStaffAccounts.slice(4).find((s) => s.department === type.department)!;
      const id = await service.create(owner, {
        typeId: type.id,
        fields: sample.fields,
        note: 'Full workflow test',
        files: sample.attachments
          .filter((a) => a.purpose === 'evidence')
          .map((a) => new File([a.blob], a.name, { type: a.type })),
      });
      let r = (await service.list(admin))[0];
      await service.assign(
        admin,
        r,
        processor.id,
        '2099-01-01',
        'normal',
        'Phân công tài khoản mở rộng',
      );
      const resultFile = new File(['%PDF-1.4\nreference only'], 'reference.pdf', {
        type: 'application/pdf',
      });
      for (const status of workflows[type.workflow].slice(1)) {
        r = (await service.list(processor))[0];
        const review = seedReview(type, 'completed', '2026-01-01', 'DEMO-TEST');
        await service.transition(
          processor,
          r,
          status,
          'Phản hồi công khai mẫu',
          review,
          'Kết quả và hướng dẫn nhận mẫu',
          status === 'decision' || status === 'ready' ? [resultFile] : [],
          true,
        );
        const visible = (await service.list(owner))[0];
        expect(visible.status).toBe(status);
        expect(visible.events.at(-1)?.message).toBe('Phản hồi công khai mẫu');
      }
      const final = (await service.list(admin))[0];
      expect(final.id).toBe(id);
      expect(final.status).toBe('completed');
      expect(final.assigneeId).toBe(processor.id);
      expect(final.events.filter((e) => e.kind === 'transition')).toHaveLength(
        workflows[type.workflow].length - 1,
      );
    },
  );
  it('adds v3 to a v2 database without losing edited demos, user records or audit; concurrent loads deduplicate', async () => {
    const factory = new IDBFactory();
    const old = seedRequests()
      .slice(0, 40)
      .map((r) => ({ ...r, demo: { ...r.demo!, version: 2 } }));
    old[0].revision = 7;
    old[0].review.internalNote = 'Work already performed';
    const created: StudentRequest = { ...old[0], id: 'user-created', demo: undefined };
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const open = factory.open('v2-existing', 2);
      open.onupgradeneeded = () => {
        const records = open.result.createObjectStore('requests', { keyPath: 'id' });
        [...old, created].forEach((r) => records.add(r));
        open.result.createObjectStore('meta', { keyPath: 'key' }).put({ key: 'demo', version: 2 });
      };
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    db.close();
    const store = createRequestStore({ factory, name: 'v2-existing', initial: seedRequests });
    stores.push(store);
    expect(await store.list()).toHaveLength(41);
    const service = createRequestsService(store);
    const attempts = await Promise.allSettled([
      service.demo(admin, false, true),
      service.demo(admin, false, true),
    ]);
    expect(attempts.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    let all = await store.list();
    expect(all).toHaveLength(41 + demoRecordCount);
    expect(all.find((r) => r.id === old[0].id)).toEqual(old[0]);
    expect(all.find((r) => r.id === created.id)).toEqual(created);
    await store.close();
    await expect(service.demo(admin, false, true)).rejects.toThrow('đã được nạp');
    await service.demo(admin, true, true);
    all = await store.list();
    expect(all).toHaveLength(demoRecordCount + 1);
    expect(all.some((r) => r.demo?.version === 2)).toBe(false);
    expect(all.find((r) => r.id === created.id)).toEqual(created);
  });
  it('upgrades v1 without replacing or automatically seeding existing records', async () => {
    const factory = new IDBFactory();
    const original = { ...seedRequests()[0], id: 'legacy-user-record', demo: undefined };
    const legacy = await new Promise<IDBDatabase>((resolve, reject) => {
      const open = factory.open('legacy-test', 1);
      open.onupgradeneeded = () =>
        open.result.createObjectStore('requests', { keyPath: 'id' }).add(original);
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    legacy.close();
    const store = createRequestStore({ factory, name: 'legacy-test', initial: seedRequests });
    stores.push(store);
    const service = createRequestsService(store);
    expect(await store.list()).toHaveLength(1);
    await service.demo(admin, false, true);
    const after = await store.list();
    expect(after).toHaveLength(demoRecordCount + 1);
    expect(after.find((r) => r.id === original.id)?.events).toEqual(original.events);
    await service.demo(admin, true, true);
    expect((await store.list()).find((r) => r.id === original.id)?.revision).toBe(
      original.revision,
    );
  });
  it('rolls back a failed demo reset including deletions and metadata', async () => {
    const { service } = setup(true);
    const before = await service.list(admin);
    vi.spyOn(IDBObjectStore.prototype, 'add').mockImplementationOnce(() => {
      throw new DOMException('Full', 'QuotaExceededError');
    });
    await expect(service.demo(admin, true, true)).rejects.toThrow();
    expect((await service.list(admin)).map((r) => r.id)).toEqual(before.map((r) => r.id));
    await expect(service.demo(admin, false, true)).rejects.toThrow('đã được nạp');
  });
  it('creates once, stores exact bytes, and preserves Blob after database reopen', async () => {
    const { store, service } = setup();
    const id = await service.create(student, input());
    await store.close();
    const [record] = await service.list(student);
    expect(record.id).toBe(id);
    expect(record.attachments[0].blob).toBeInstanceOf(Blob);
    expect(await record.attachments[0].blob.text()).toBe('%PDF-test-actual-bytes');
    expect(record.events).toHaveLength(1);
    expect(record.events[0].kind).toBe('submit');
  });
  it('seeds the current varied dataset with explicit markers, actual bytes and only import history', async () => {
    const { service, store } = setup(true);
    const all = await service.list(admin);
    expect(all).toHaveLength(demoRecordCount);
    expect(
      new Set(all.map((r) => requestTypes.find((t) => t.id === r.typeId)!.category)).size,
    ).toBe(5);
    for (const person of staffMembers)
      expect(all.some((r) => r.assigneeId === person.id)).toBe(true);
    expect(new Set(all.flatMap((r) => r.attachments.map((a) => a.type)))).toEqual(
      new Set(['application/pdf', 'image/jpeg', 'image/png']),
    );
    for (const r of all) {
      expect(r.demo?.version).toBe(demoVersion);
      expect(r.events).toHaveLength(1);
      expect(r.events[0].kind).toBe('seed');
      expect(r.attachments[0].blob.size).toBeGreaterThan(100);
    }
    await store.close();
    expect(await service.list(admin)).toHaveLength(demoRecordCount);
    await expect(service.demo(admin, false, true)).rejects.toThrow('đã được nạp');
    expect(await service.list(admin)).toHaveLength(demoRecordCount);
  });
  it('reset removes only marked demo records and rejects old snapshots', async () => {
    const { store, service } = setup(true);
    const id = await service.create(student, input());
    const old = (await service.list(admin))[0];
    const legacy: StudentRequest = { ...old, id: 'YC-DEMO-UNMARKED', demo: undefined };
    await store.add(legacy);
    await expect(service.demo(staff, true, true)).rejects.toThrow('admin');
    await expect(service.demo(admin, true, false)).rejects.toThrow('xác nhận');
    const marked = (await service.list(admin)).find((r) => r.demo)!;
    await service.demo(admin, true, true);
    const all = await service.list(admin);
    expect(all).toHaveLength(demoRecordCount + 2);
    expect(all.some((r) => r.id === id)).toBe(true);
    expect(all.some((r) => r.id === legacy.id)).toBe(true);
    await expect(
      service.assign(admin, marked, marked.assigneeId ?? staff.id, '2099-01-01', 'normal', 'Stale'),
    ).rejects.toThrow('Không tìm');
  });
  it('serializes concurrent edits; losing revision cannot overwrite', async () => {
    const { service, changed } = setup();
    await service.create(student, input());
    const r = (await service.list(admin))[0];
    const results = await Promise.allSettled([
      service.assign(admin, r, staff.id, '2099-01-01', 'normal', 'A'),
      service.assign(admin, r, staff.id, '2099-01-02', 'urgent', 'B'),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect((await service.list(admin))[0].revision).toBe(2);
    expect(changed).toHaveBeenCalledTimes(2);
  });
  it('rolls back record and audit on quota failure and does not notify', async () => {
    const { service, changed } = setup();
    await service.create(student, input());
    const before = (await service.list(admin))[0];
    vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementationOnce(() => {
      throw new DOMException('Full', 'QuotaExceededError');
    });
    await expect(
      service.assign(admin, before, staff.id, '2099-01-01', 'normal', 'Assign'),
    ).rejects.toThrow('chưa được thay đổi');
    const after = (await service.list(admin))[0];
    expect(after.revision).toBe(before.revision);
    expect(after.events).toEqual(before.events);
    expect(after.assigneeId).toBeUndefined();
    expect(changed).toHaveBeenCalledTimes(1);
  });
  it('enforces role boundaries, reassignment revokes former specialist, private audit stays private', async () => {
    const { service } = setup();
    const data = {
      ...input(),
      typeId: 'full-transcript',
      fields: { copies: '1', delivery: 'Bản giấy tại HC1C' },
    };
    await service.create(student, data);
    let r = (await service.list(admin))[0];
    const former: User = { ...staff, id: 'u-staff-1' };
    const replacement: User = { ...staff, id: 'u-staff-4' };
    await service.assign(admin, r, former.id, '2099-01-01', 'normal', 'private assignment reason');
    r = (await service.list(admin))[0];
    await service.saveReview(former, r, {
      ...r.review,
      internalNote: 'PRIVATE',
      verification: 'PRIVATE VERIFICATION',
      recommendation: 'PRIVATE RECOMMENDATION',
    });
    r = (await service.list(admin))[0];
    await service.assign(admin, r, replacement.id, '2099-01-02', 'urgent', 'private reassignment');
    expect(await service.list(former)).toHaveLength(0);
    await expect(
      service.transition(
        former,
        (await service.list(admin))[0],
        'received',
        'Tiếp nhận',
        r.review,
        '',
        [],
      ),
    ).rejects.toThrow('phân công');
    await expect(
      service.transition(
        admin,
        (await service.list(admin))[0],
        'received',
        'Tiếp nhận',
        r.review,
        '',
        [],
      ),
    ).rejects.toThrow('phân công');
    expect(await service.list({ ...student, id: 'other' })).toHaveLength(0);
    const dto = JSON.stringify(await service.list(student));
    expect(dto).not.toContain('PRIVATE');
    expect(dto).not.toContain('private assignment');
    expect(dto).not.toContain('private reassignment');
    const audit = (await service.list(admin))[0].events.filter((e) => e.visibility === 'internal');
    expect(audit.at(-1)?.changes?.[0]).toMatchObject({
      before: 'Nguyễn Minh Anh',
      after: 'Phạm Ngọc Lan',
    });
  });
  it('supplements append bytes and resume only at the paused step; cancellation retains audit', async () => {
    const { service } = setup();
    await service.create(student, input());
    const fresh = async () => (await service.list(admin))[0];
    await service.assign(admin, await fresh(), staff.id, '2099-01-01', 'normal', 'Assign');
    let r = await fresh();
    await service.transition(staff, r, 'received', 'Tiếp nhận', r.review, '', []);
    r = await fresh();
    await service.transition(staff, r, 'supplement', 'Cần ảnh rõ', r.review, '', []);
    r = await fresh();
    await service.saveReview(staff, r, { ...r.review, internalNote: 'private' });
    expect((await fresh()).supplementMessage).toBe('Cần ảnh rõ');
    r = await fresh();
    await service.supplement(student, r, 'Đã gửi lại', [
      new File(['more'], 'more.png', { type: 'image/png' }),
    ]);
    r = await fresh();
    expect(r.status).toBe('received');
    expect(r.attachments).toHaveLength(2);
    expect(await r.attachments[1].blob.text()).toBe('more');
    await expect(service.cancel(student, r, 'Không cần')).rejects.toThrow('chưa tiếp nhận');
    const id = await service.create(student, input());
    const pending = (await service.list(student)).find((r) => r.id === id)!;
    await service.cancel(student, pending, 'Tạo nhầm');
    expect((await service.list(student)).find((r) => r.id === id)?.events.at(-1)?.kind).toBe(
      'cancel',
    );
  });
  it('does not publish draft result files or internal review to students', async () => {
    const { service, store } = setup();
    await service.create(student, input());
    const r = (await service.list(admin))[0];
    await store.mutate(r.id, r.revision, (current) => {
      current.result = 'draft secret';
      current.attachments.push({ ...current.attachments[0], id: 'draft-file', purpose: 'result' });
      current.review.reference = 'draft authority';
    });
    const visible = (await service.list(student))[0];
    expect(visible.result).toBe('');
    expect(visible.review.reference).toBe('');
    expect(visible.attachments).toHaveLength(1);
  });
  it('saves response and result drafts with actual files without publishing before release', async () => {
    const { service } = setup();
    await service.create(student, input());
    let r = (await service.list(admin))[0];
    await service.assign(admin, r, staff.id, '2099-01-01', 'normal', 'Assign');
    r = (await service.list(admin))[0];
    await service.saveReview(
      staff,
      r,
      { ...r.review, responseDraft: 'PRIVATE DRAFT RESPONSE' },
      'PRIVATE DRAFT RESULT',
      [new File(['draft-file'], 'draft.pdf', { type: 'application/pdf' })],
    );
    r = (await service.list(admin))[0];
    expect(r.review.responseDraft).toBe('PRIVATE DRAFT RESPONSE');
    expect(await r.attachments.at(-1)!.blob.text()).toBe('draft-file');
    expect(JSON.stringify(await service.list(student))).not.toContain('PRIVATE DRAFT');
    await service.transition(staff, r, 'received', 'Đã tiếp nhận', r.review, r.result, []);
    expect((await service.list(admin))[0].review.responseDraft).toBeUndefined();
  });
});
