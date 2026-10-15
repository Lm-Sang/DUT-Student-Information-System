import { useState } from 'react';
import { getRequestType, isOverdue } from '../data/requestCatalog';
import { inQueue, requestState, type RequestQueue } from '../data/requestState';
import type { StudentRequest } from '../types/requests';

export function useRequestWorkspace(requests: StudentRequest[]) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [typeId, setTypeId] = useState('');
  const [status, setStatus] = useState('');
  const [owner, setOwner] = useState('');
  const [department, setDepartment] = useState('');
  const [queue, setQueue] = useState<RequestQueue>('all');
  const [sort, setSort] = useState('due');
  const filtered = requests
    .filter((r) => {
      const type = getRequestType(r.typeId);
      return (
        (!query ||
          `${r.id} ${r.student.fullName} ${r.student.studentId} ${type.name}`
            .toLocaleLowerCase('vi')
            .includes(query.toLocaleLowerCase('vi'))) &&
        (!category || type.category === category) &&
        (!typeId || r.typeId === typeId) &&
        (!status || r.status === status) &&
        (!owner || r.assigneeId === owner) &&
        (!department || type.department === department) &&
        inQueue(r, queue)
      );
    })
    .sort((a, b) =>
      sort === 'newest'
        ? b.createdAt.localeCompare(a.createdAt)
        : sort === 'updated'
          ? b.updatedAt.localeCompare(a.updatedAt)
          : sort === 'priority'
            ? Number(b.priority === 'urgent') - Number(a.priority === 'urgent') ||
              (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999')
            : Number(requestState(a).closed) - Number(requestState(b).closed) ||
              (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'),
    );
  const attention = requests
    .filter(
      (r) => !requestState(r).closed && (!r.assigneeId || isOverdue(r) || r.priority === 'urgent'),
    )
    .sort(
      (a, b) =>
        Number(isOverdue(b)) - Number(isOverdue(a)) ||
        Number(!b.assigneeId) - Number(!a.assigneeId) ||
        (a.dueDate ?? '').localeCompare(b.dueDate ?? ''),
    )
    .slice(0, 5);
  const recent = requests
    .flatMap((r) =>
      r.events.filter((event) => event.kind !== 'seed').map((event) => ({ request: r, event })),
    )
    .sort((a, b) => b.event.at.localeCompare(a.event.at))
    .slice(0, 4);
  const reset = () => {
    setQuery('');
    setCategory('');
    setTypeId('');
    setStatus('');
    setOwner('');
    setDepartment('');
    setQueue('all');
    setSort('due');
  };
  return {
    query,
    setQuery,
    category,
    setCategory,
    typeId,
    setTypeId,
    status,
    setStatus,
    owner,
    setOwner,
    department,
    setDepartment,
    queue,
    setQueue,
    sort,
    setSort,
    filtered,
    attention,
    recent,
    reset,
  };
}
