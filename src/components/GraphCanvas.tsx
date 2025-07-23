import React, { useCallback, useMemo, useEffect } from "react";
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
import type { GraphNode } from "../store/graphStore";
import { useAlgoStore } from "../store/algoState";
import { useShallow } from "zustand/react/shallow";

const sccClasses = [
  "bg-red-300",
  "bg-green-300",
  "bg-purple-300",
  "bg-yellow-300",
  "bg-pink-300",
  "bg-lime-300",
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

  const { indexMap, onStackMap, sccs } = useAlgoStore(
    useShallow((s) => ({
      indexMap: s.indexMap,
      onStackMap: s.onStackMap,
      sccs: s.sccs,
    })),
  );
  const updateStatuses = useGraphStore((s) => s.updateNodeStatuses);

  useEffect(() => {
    updateStatuses({ indexMap, onStackMap, sccs });
  }, [indexMap, onStackMap, sccs, updateStatuses]);

  const baseClass = "text-xs rounded px-2 py-1";
  const getNodeClass = useCallback(
    (n: GraphNode) => {
      if (n.status.sccIndex !== null) {
        return `${baseClass} ${
          sccClasses[n.status.sccIndex % sccClasses.length]
        }`;
      }
      if (n.status.onStack) return `${baseClass} bg-blue-300`;
      if (n.status.visited) return `${baseClass} bg-yellow-300`;
      return `${baseClass} bg-gray-300`;
    },
    [nodes],
  );

  const rfNodes: RFNode<{ label: string }>[] = useMemo(
    () =>
      nodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: { label: n.label },
        draggable: editable,
        className: getNodeClass(n),
      })),
    [nodes, editable, getNodeClass],
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
      const equal =
        updatedGraph.length === nodes.length &&
        updatedGraph.every(
          (n, i) =>
            n.id === nodes[i].id &&
            n.label === nodes[i].label &&
            n.position.x === nodes[i].position.x &&
            n.position.y === nodes[i].position.y,
        );
      if (!equal) {
        setGraphNodes(updatedGraph);
      }
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
      const equal =
        updatedGraph.length === edges.length &&
        updatedGraph.every(
          (e, i) =>
            e.id === edges[i].id &&
            e.from === edges[i].from &&
            e.to === edges[i].to,
        );
      if (!equal) {
        setGraphEdges(updatedGraph);
      }
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
