import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useKanbanStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
      draggedItem.columnId = columnId;
    },
    drop: (draggedItem: any) => {
      moveTicket(draggedItem.id, draggedItem.columnId, columnId, index);
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={`relative ${isDragging ? 'opacity-50' : ''}`}>
      <Card>
        <CardContent className="p-2 text-sm flex justify-between items-center">
          <span>{ticket.title}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground"
            onClick={() => removeTicket(ticket.id, columnId)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};