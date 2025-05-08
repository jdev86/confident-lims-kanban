import { createFileRoute } from "@tanstack/react-router";
import { Board } from "@/components/Board";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<DndProvider backend={HTML5Backend}>
		  <div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
			<Board />
		  </div>
		</DndProvider>
	)
}
