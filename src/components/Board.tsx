import { useKanbanStore } from '@/store';
import { Column } from './Column';

export const Board = () => {
  const columns = useKanbanStore(s => s.columns);
  return (
      <div className="flex">
        {columns.map(column => <Column key={column.id} column={column} />)}
      </div>
  );
};