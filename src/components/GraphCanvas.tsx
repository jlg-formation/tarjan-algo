import React, { useCallback } from "react";
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
  type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { useGraphStore } from "../store/graphStore";

export default function GraphCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const editMode = useGraphStore((s) => s.editMode);
  const getNextNodeId = useGraphStore((s) => s.getNextNodeId);
  const setEditMode = useGraphStore((s) => s.setEditMode);
  const selectedNodeForEdge = useGraphStore((s) => s.selectedNodeForEdge);
  const setSelectedNodeForEdge = useGraphStore((s) => s.setSelectedNodeForEdge);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      if (editMode !== "addNode") return;

      const bounds = (event.target as HTMLElement).getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      const newNode: Node = {
        id: getNextNodeId(),
        data: { label: `N${nodes.length + 1}` },
        position: { x, y },
      };

      setNodes((nds) => nds.concat(newNode));
      setEditMode("none");
    },
    [editMode, getNextNodeId, setNodes, setEditMode, nodes.length]
  );

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (editMode === "addEdgeStep1") {
        setSelectedNodeForEdge(node.id);
        setEditMode("addEdgeStep2");
      } else if (editMode === "addEdgeStep2" && selectedNodeForEdge) {
        if (selectedNodeForEdge !== node.id) {
          const newEdge: Edge = {
            id: `e-${selectedNodeForEdge}-${node.id}`,
            source: selectedNodeForEdge,
            target: node.id,
          };
          setEdges((eds) => [...eds, newEdge]);
        }
        setSelectedNodeForEdge(null);
        setEditMode("none");
      }
    },
    [
      editMode,
      selectedNodeForEdge,
      setEdges,
      setEditMode,
      setSelectedNodeForEdge,
    ]
  );

  return (
    <div
      className="w-full h-full bg-white rounded shadow"
      onClick={handleCanvasClick}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Background gap={12} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
