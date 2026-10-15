import { useState } from 'react';
interface Draft {
  fields: Record<string, string>;
  files: File[];
  note: string;
}
// Tab-local draft cache retains File objects during navigation; never shares identity across tabs.
const sessions = new Map<string, Record<string, Draft>>();
const blank = (): Draft => ({
  fields: { copies: '1', delivery: 'Bản giấy tại HC1C' },
  files: [],
  note: '',
});
export function useRequestDraft(userId: string, typeId: string) {
  const [drafts, setDrafts] = useState(() => sessions.get(userId) ?? {});
  const draft = drafts[typeId] ?? blank();
  function update(patch: Partial<Draft>) {
    setDrafts((all) => {
      const next = { ...all, [typeId]: { ...(all[typeId] ?? blank()), ...patch } };
      sessions.set(userId, next);
      return next;
    });
  }
  return { ...draft, update, clear: () => update(blank()) };
}
