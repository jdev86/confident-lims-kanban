import { nanoid } from 'nanoid';
import { create } from 'zustand';

type Ticket = { id: string; title: string };
type Column = { id: string; title: string; tickets: Ticket[] };

type KanbanStore = {
  columns: Column[];
  addTicket: (columnId: string, title: string) => void;
  moveTicket: (ticketId: string, fromColumnId: string, toColumnId: string, index: number) => void;
  removeTicket: (ticketId: string, columnId: string) => void;
};

export const useKanbanStore = create<KanbanStore>((set) => ({
  columns: [
    { id: 'todo', title: 'To Do', tickets: [] },
    { id: 'inprogress', title: 'In Progress', tickets: [] },
    { id: 'done', title: 'Done', tickets: [] },
  ],
  addTicket: (columnId, title) => set(state => {
    const ticket = { id: nanoid(), title };
    return {
      columns: state.columns.map(col =>
        col.id === columnId ? { ...col, tickets: [...col.tickets, ticket] } : col
      )
    };
  }),
  moveTicket: (ticketId, fromColumnId, toColumnId, index) => set(state => {
    if (fromColumnId === toColumnId) {
      console.log(`Moving FROM ticket ${ticketId} from ${fromColumnId} to ${toColumnId} at index ${index}`);

      return {
        columns: state.columns.map(col => {
          if (col.id !== fromColumnId) return col;
          const ticket = col.tickets.find(t => t.id === ticketId);
          if (!ticket) return col;
  
          const filtered = col.tickets.filter(t => t.id !== ticketId);
          const updated = [...filtered.slice(0, index), ticket, ...filtered.slice(index)];
          return { ...col, tickets: updated };
        })
      };
    } else {
      console.log(`Moving ELSE ticket ${ticketId} from ${fromColumnId} to ${toColumnId} at index ${index}`);

      let ticketToMove: Ticket | undefined;
      const updatedColumns = state.columns.map(col => {
        if (col.id === fromColumnId) {
          const ticket = col.tickets.find(t => t.id === ticketId);
          if (!ticket) return col;
          ticketToMove = ticket;
          return { ...col, tickets: col.tickets.filter(t => t.id !== ticketId) };
        }
        return col;
      });
  
      if (!ticketToMove) return state;
  
      return {
        columns: updatedColumns.map(col => {
          if (col.id === toColumnId) {
            const updated = [...col.tickets];
            updated.splice(index, 0, ticketToMove!);
            return { ...col, tickets: updated };
          }
          return col;
        })
      };
    }
  }),
  removeTicket: (ticketId, columnId) => set(state => {
    return {
      columns: state.columns.map(col =>
        col.id === columnId ? { ...col, tickets: col.tickets.filter(t => t.id !== ticketId) } : col
      )
    };
  })
}));