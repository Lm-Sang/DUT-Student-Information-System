import type { ScheduleItem } from '../types';
import { EmptyState } from '@/shared/ui/FeedbackStates';
import { Table } from '@/shared/ui/Table';
export function ScheduleTable({ title, items }: { title: string; items: ScheduleItem[] }) {
  if (!items.length) return <EmptyState message="Chưa có lịch được công bố." />;
  return (
    <Table label={title}>
      <thead>
        <tr>
          <th>Học phần</th>
          <th>Ngày</th>
          <th>Thời gian</th>
          <th>Phòng</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td className="font-medium">{item.title}</td>
            <td>{item.day}</td>
            <td>{item.time}</td>
            <td>{item.room}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
