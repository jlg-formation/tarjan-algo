import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { select } from "d3-selection";
import { drag as d3Drag } from "d3-drag";
import {
  useGraphStore,
  type GraphNode,
  type GraphEdge,
} from "../store/graphStore";
import { useAlgoStore } from "../store/algoState";
import { useShallow } from "zustand/react/shallow";

interface DragEventLike {
  x: number;
  y: number;
}

export default function GraphCanvas() {
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const setGraphNodes = useGraphStore((s) => s.setNodes);
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

  const baseClass = "stroke-black stroke-2";
  const selectedNodes = useGraphStore((s) => s.selectedNodes);
  const toggleNodeSelection = useGraphStore((s) => s.toggleNodeSelection);
  const getNodeClass = useCallback(
    (n: GraphNode) =>
      selectedNodes.includes(n.id)
        ? `${baseClass} fill-gray-300`
        : `${baseClass} fill-white`,
    [selectedNodes],
  );

  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleNodeClick = useCallback(
    (id: string) => {
      if (editMode === "addEdgeStep1") {
        setSelectedNodeForEdge(id);
        setEditMode("addEdgeStep2");
      } else if (editMode === "addEdgeStep2" && selectedNodeForEdge) {
        if (selectedNodeForEdge !== id) {
          addGraphEdge({
            id: `e-${selectedNodeForEdge}-${id}`,
            from: selectedNodeForEdge,
            to: id,
          });
        }
        setSelectedNodeForEdge(null);
        setEditMode("none");
      } else if (editable && editMode === "none") {
        toggleNodeSelection(id);
      }
    },
    [
      editMode,
      selectedNodeForEdge,
      addGraphEdge,
      setEditMode,
      setSelectedNodeForEdge,
      editable,
      toggleNodeSelection,
    ],
  );

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!editable || editMode !== "none") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      addGraphNode({
        id: getNextNodeId(),
        label: `N${nodes.length + 1}`,
        position: { x, y },
      });
    },
    [editable, editMode, getNextNodeId, addGraphNode, nodes.length],
  );

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svg = select(svgEl);
    svg.selectAll("*").remove();

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#555");

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    svg
      .append("g")
      .attr("class", "edges")
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", "#666")
      .attr("marker-end", "url(#arrow)")
      .attr("x1", (d: GraphEdge) => nodeMap.get(d.from)?.position.x ?? 0)
      .attr("y1", (d: GraphEdge) => nodeMap.get(d.from)?.position.y ?? 0)
      .attr("x2", (d: GraphEdge) => nodeMap.get(d.to)?.position.x ?? 0)
      .attr("y2", (d: GraphEdge) => nodeMap.get(d.to)?.position.y ?? 0);

    const dragBehaviour = d3Drag().on(
      "drag",
      (event: DragEventLike, d: GraphNode) => {
        if (!editable) return;
        const updated = nodes.map((n) =>
          n.id === d.id ? { ...n, position: { x: event.x, y: event.y } } : n,
        );
        setGraphNodes(
          updated.map((node) => {
            const { status, ...rest } = node;
            void status;
            return rest;
          }),
        );
      },
    );

    const nodeGroups = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("g.node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .attr(
        "transform",
        (d: GraphNode) => `translate(${d.position.x},${d.position.y})`,
      )
      .call(dragBehaviour)
      .on("click", (event: React.MouseEvent<SVGGElement>, d: GraphNode) => {
        event.stopPropagation();
        handleNodeClick(d.id);
      });

    nodeGroups
      .append("circle")
      .attr("r", 20)
      .attr("class", (d: GraphNode) => getNodeClass(d));

    nodeGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .text((d: GraphNode) => d.label);
  }, [nodes, edges, editable, getNodeClass, handleNodeClick, setGraphNodes]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full bg-white rounded shadow"
      onClick={handleCanvasClick}
    />
  );
}
