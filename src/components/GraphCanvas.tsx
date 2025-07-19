// src/components/GraphCanvas.tsx
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "N1" },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    data: { label: "N2" },
    position: { x: 300, y: 100 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "default",
  },
];

export default function GraphCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (connection: Connection) =>
    setEdges((eds) => addEdge(connection, eds));

  return (
    <div className="w-full h-full bg-white rounded shadow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background gap={12} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
