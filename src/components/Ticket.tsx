import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useKanbanStore } from '@/store';
import { X } from 'lucide-react';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export const Ticket = ({ ticket, columnId, index }: { ticket: { id: string; title: string }; columnId: string; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const moveTicket = useKanbanStore(s => s.moveTicket);
  const removeTicket = useKanbanStore(s => s.removeTicket);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TICKET',
    item: { id: ticket.id, columnId, index },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  }), [ticket.id, columnId, index]);

  const [, drop] = useDrop({
    accept: 'TICKET',
    hover: (draggedItem: any, monitor) => {
      if (!ref.current || draggedItem.id === ticket.id) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      ) {
        return;
      }

      draggedItem.index = hoverIndex;
    },
    drop: (draggedItem: any) => {
      moveTicket(draggedItem.id, draggedItem.columnId, columnId, index);
      draggedItem.columnId = columnId; // only update after moveTicket
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={`relative ${isDragging ? 'opacity-50' : ''}`}>
      <Card className="bg-gradient-to-br from-primary to-secondary shadow-card border border-blue-300 dark:bg-darkBg dark:border-blue-700 transition-all">
        <CardContent className="p-3 text-sm flex justify-between items-center text-white">
          <span className="font-semibold text-header">{ticket.title}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-white hover:text-red-500"
            onClick={() => removeTicket(ticket.id, columnId)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};