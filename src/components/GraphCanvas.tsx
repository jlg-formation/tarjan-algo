import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  type Node as RFNode,
  type NodeMouseHandler,
  type NodeChange,
  type EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { useGraphStore } from "../store/graphStore";
import { useAlgoStore } from "../store/algoState";
import { shallow } from "zustand/shallow";

const sccColors = [
  "#fca5a5",
  "#6ee7b7",
  "#93c5fd",
  "#fcd34d",
  "#e879f9",
  "#a3e635",
];

export default function GraphCanvas() {
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const setGraphNodes = useGraphStore((s) => s.setNodes);
  const setGraphEdges = useGraphStore((s) => s.setEdges);
  const addGraphNode = useGraphStore((s) => s.addNode);
  const addGraphEdge = useGraphStore((s) => s.addEdge);
  const editMode = useGraphStore((s) => s.editMode);
  const getNextNodeId = useGraphStore((s) => s.getNextNodeId);
  const setEditMode = useGraphStore((s) => s.setEditMode);
  const selectedNodeForEdge = useGraphStore((s) => s.selectedNodeForEdge);
  const setSelectedNodeForEdge = useGraphStore((s) => s.setSelectedNodeForEdge);
  const editable = useGraphStore((s) => s.editable);

  const algo = useAlgoStore(
    (s) => ({
      indexMap: s.indexMap,
      onStackMap: s.onStackMap,
      sccs: s.sccs,
    }),
    shallow,
  );

  const getNodeColor = useCallback(
    (id: string) => {
      const sccIndex = algo.sccs.findIndex((s) => s.includes(id));
      if (sccIndex !== -1) {
        return sccColors[sccIndex % sccColors.length];
      }
      if (algo.onStackMap.get(id)) {
        return "#bfdbfe"; // blue
      }
      if (algo.indexMap.has(id)) {
        return "#fde68a"; // yellow
      }
      return "#d1d5db"; // gray
    },
    [algo],
  );

  const rfNodes: RFNode<{ label: string }>[] = useMemo(
    () =>
      nodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: { label: n.label },
        draggable: editable,
        style: { backgroundColor: getNodeColor(n.id) },
      })),
    [nodes, editable, getNodeColor],
  );

  const rfEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.from,
        target: e.to,
      })),
    [edges],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const currentRf = nodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: { label: n.label },
      }));
      const updatedRf = applyNodeChanges(changes, currentRf);
      const updatedGraph = updatedRf.map((n) => ({
        id: n.id,
        label: n.data.label,
        position: n.position,
      }));
      setGraphNodes(updatedGraph);
    },
    [nodes, setGraphNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const currentRf = edges.map((e) => ({
        id: e.id,
        source: e.from,
        target: e.to,
      }));
      const updatedRf = applyEdgeChanges(changes, currentRf);
      const updatedGraph = updatedRf.map((e) => ({
        id: e.id,
        from: e.source,
        to: e.target,
      }));
      setGraphEdges(updatedGraph);
    },
    [edges, setGraphEdges],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      addGraphEdge({
        id: `e-${connection.source}-${connection.target}`,
        from: connection.source,
        to: connection.target,
      });
    },
    [addGraphEdge],
  );

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      if (editMode !== "addNode") return;

      const bounds = (event.target as HTMLElement).getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      addGraphNode({
        id: getNextNodeId(),
        label: `N${nodes.length + 1}`,
        position: { x, y },
      });
      setEditMode("none");
    },
    [editMode, getNextNodeId, addGraphNode, setEditMode, nodes.length],
  );

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (editMode === "addEdgeStep1") {
        setSelectedNodeForEdge(node.id);
        setEditMode("addEdgeStep2");
      } else if (editMode === "addEdgeStep2" && selectedNodeForEdge) {
        if (selectedNodeForEdge !== node.id) {
          addGraphEdge({
            id: `e-${selectedNodeForEdge}-${node.id}`,
            from: selectedNodeForEdge,
            to: node.id,
          });
        }
        setSelectedNodeForEdge(null);
        setEditMode("none");
      }
    },
    [
      editMode,
      selectedNodeForEdge,
      addGraphEdge,
      setEditMode,
      setSelectedNodeForEdge,
    ],
  );

  return (
    <div
      className="w-full h-full bg-white rounded shadow"
      onClick={handleCanvasClick}
    >
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
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
