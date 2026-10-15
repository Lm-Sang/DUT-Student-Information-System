import type { StudentRequest } from '../types/requests';

const storageError = () =>
  new Error('Không lưu được hồ sơ. Bộ nhớ có thể đã đầy; dữ liệu chưa được thay đổi.');
export interface RequestStore {
  list(): Promise<StudentRequest[]>;
  add(request: StudentRequest): Promise<void>;
  mutate(id: string, revision: number, edit: (request: StudentRequest) => void): Promise<void>;
  seed(records: StudentRequest[], reset: boolean): Promise<void>;
  close(): Promise<void>;
}

/** All record changes and demo metadata commit together. Never imports legacy localStorage. */
export function createRequestStore(options: {
  name?: string;
  factory?: IDBFactory;
  initial: () => StudentRequest[];
}): RequestStore {
  let database: Promise<IDBDatabase> | undefined;
  function open() {
    if (database) return database;
    database = new Promise<IDBDatabase>((resolve, reject) => {
      const factory = options.factory ?? globalThis.indexedDB;
      if (!factory) {
        reject(new Error('Trình duyệt không hỗ trợ lưu hồ sơ IndexedDB.'));
        return;
      }
      const request = factory.open(options.name ?? 'dut-request-workflow', 2);
      let abandoned = false;
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
        if (event.oldVersion === 0) {
          const store = db.createObjectStore('requests', { keyPath: 'id' });
          const records = options.initial();
          records.forEach((r) => store.add(r));
          const versions = [...new Set(records.flatMap((r) => (r.demo ? [r.demo.version] : [])))];
          request.transaction!.objectStore('meta').put({ key: 'demo', versions });
        }
        // Existing databases are upgraded structurally only; no reseeding or record reclassification.
      };
      request.onsuccess = () => {
        const db = request.result;
        if (abandoned) {
          db.close();
          return;
        }
        db.onversionchange = () => {
          db.close();
          database = undefined;
        };
        resolve(db);
      };
      request.onerror = () => {
        database = undefined;
        reject(new Error('Không thể mở bộ nhớ hồ sơ. Kiểm tra quyền lưu dữ liệu của trình duyệt.'));
      };
      request.onblocked = () => {
        abandoned = true;
        database = undefined;
        reject(new Error('Đóng các tab phiên bản cũ rồi tải lại để nâng cấp bộ nhớ.'));
      };
    });
    return database;
  }
  async function write(
    run: (store: IDBObjectStore, meta: IDBObjectStore, fail: (error: unknown) => void) => void,
  ) {
    const db = await open();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(['requests', 'meta'], 'readwrite');
      let failure: unknown;
      const fail = (error: unknown) => {
        failure = error;
        tx.abort();
      };
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(failure ?? storageError());
      tx.onerror = () => {
        /* Abort reports the error once; keep atomic rollback. */
      };
      try {
        run(tx.objectStore('requests'), tx.objectStore('meta'), fail);
      } catch (error) {
        fail(error instanceof DOMException ? storageError() : error);
      }
    });
  }
  return {
    async list() {
      const db = await open();
      return new Promise<StudentRequest[]>((resolve, reject) => {
        const tx = db.transaction('requests');
        const get = tx.objectStore('requests').getAll();
        tx.oncomplete = () => resolve(get.result);
        tx.onabort = () => reject(new Error('Không đọc được danh sách hồ sơ.'));
      });
    },
    add: (request) =>
      write((store) => {
        store.add(request);
      }),
    mutate: (id, revision, edit) =>
      write((store, _meta, fail) => {
        const get = store.get(id);
        get.onsuccess = () => {
          try {
            const current = get.result as StudentRequest | undefined;
            if (!current)
              throw new Error('Không tìm thấy hồ sơ. Hồ sơ mẫu có thể vừa được đặt lại.');
            if (current.revision !== revision)
              throw new Error('Hồ sơ vừa được cập nhật ở tab khác. Hãy tải lại trước khi lưu.');
            edit(current);
            current.revision++;
            store.put(current);
          } catch (error) {
            fail(error instanceof DOMException ? storageError() : error);
          }
        };
      }),
    seed: (records, reset) =>
      write((store, meta, fail) => {
        const get = meta.get('demo');
        get.onsuccess = () => {
          const version = records[0]?.demo?.version;
          if (!version || records.some((r) => r.demo?.version !== version || !r.demo.batch)) {
            fail(new Error('Bộ mẫu không hợp lệ. Dữ liệu hiện có được giữ nguyên.'));
            return;
          }
          // Accept old metadata without mutating its records. Loading is additive; only reset deletes.
          const versions: number[] =
            get.result?.versions ?? (get.result?.version ? [get.result.version] : []);
          if (!reset && versions.includes(version)) {
            fail(new Error(`Bộ dữ liệu mẫu v${version} đã được nạp. Không tạo bản trùng.`));
            return;
          }
          const cursor = store.openCursor();
          cursor.onsuccess = () => {
            const item = cursor.result;
            if (item) {
              // Only explicit markers created by this module are eligible, never ID prefixes.
              if (reset && item.value.demo?.version && item.value.demo?.batch) item.delete();
              item.continue();
            } else {
              try {
                records.forEach((r) => store.add(r));
                meta.put({
                  key: 'demo',
                  versions: reset ? [version] : [...versions, version],
                  batch: records[0]?.demo?.batch,
                });
              } catch (error) {
                fail(error);
              }
            }
          };
        };
      }),
    async close() {
      if (database) (await database).close();
      database = undefined;
    },
  };
}
