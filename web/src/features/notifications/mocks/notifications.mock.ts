import type { NotificationItem } from '../types';

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'University opening ceremony',
    content: 'Opening ceremony will be held at the main hall on Sept 05.',
    date: '2026-08-01',
    category: 'announcement',
  },
  {
    id: 'n2',
    title: 'Course registration deadline',
    content: 'Students must complete registration before Aug 30.',
    date: '2026-08-15',
    category: 'academic',
  },
];
