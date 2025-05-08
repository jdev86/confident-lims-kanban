import { create } from 'zustand';
import { nanoid } from 'nanoid';

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
    const sourceColumn = state.columns.find(c => c.id === fromColumnId);
    const targetColumn = state.columns.find(c => c.id === toColumnId);
    if (!sourceColumn || !targetColumn) return state;
  
    const ticketIndex = sourceColumn.tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) return state;
  
    const [ticket] = sourceColumn.tickets.splice(ticketIndex, 1);
  
    if (fromColumnId === toColumnId) {
      sourceColumn.tickets.splice(index, 0, ticket);
      return {
        columns: state.columns.map(col =>
          col.id === fromColumnId ? { ...col, tickets: [...sourceColumn.tickets] } : col
        )
      };
    } else {
      targetColumn.tickets.splice(index, 0, ticket);
      return {
        columns: state.columns.map(col => {
          if (col.id === fromColumnId) return { ...col, tickets: [...sourceColumn.tickets] };
          if (col.id === toColumnId) return { ...col, tickets: [...targetColumn.tickets] };
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