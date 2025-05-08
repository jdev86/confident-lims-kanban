import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useKanbanStore } from '@/store';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Ticket } from './Ticket';

export const Column = ({ column }: { column: { id: string; title: string; tickets: any[] } }) => {
  const [newTitle, setNewTitle] = useState('');
  const addTicket = useKanbanStore(s => s.addTicket);
  const moveTicket = useKanbanStore(s => s.moveTicket);

  const [, drop] = useDrop({
    accept: 'TICKET',
    drop: (item: { id: string; columnId: string; index: number }) => {
      if (item.columnId !== column.id) {
        moveTicket(item.id, item.columnId, column.id, column.tickets.length);
        item.columnId = column.id;
        item.index = column.tickets.length;
      }
    }
  });

  return (
    <div className="w-72 p-4 space-y-2">
      <Card ref={drop}>
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg mb-2">{column.title}</h2>
          {column.tickets.map((ticket, idx) => (
            <Ticket key={ticket.id} ticket={ticket} columnId={column.id} index={idx} />
          ))}
          <form onSubmit={e => { e.preventDefault(); addTicket(column.id, newTitle); setNewTitle(''); }} className="mt-2 space-y-2">
            <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New ticket..." />
            <Button type="submit" size="sm" disabled={!newTitle}>Add</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};