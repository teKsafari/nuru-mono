"use client"

import { useCallback } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  Handle,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

// Custom node components
function CodeBlockNode({ data }: { data: { label: string; code?: string } }) {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-cyan-500 bg-cyan-950/50 text-cyan-300 min-w-[140px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-cyan-500" />
      <div className="font-semibold text-sm mb-1">{data.label}</div>
      {data.code && <pre className="text-xs text-cyan-400/80 font-mono">{data.code}</pre>}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-cyan-500" />
    </div>
  )
}

function ProcessNode({ data }: { data: { label: string; subtitle?: string } }) {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-emerald-500 bg-emerald-950/50 text-emerald-300 min-w-[120px] text-center">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-emerald-500" />
      <div className="font-semibold text-sm">{data.label}</div>
      {data.subtitle && <div className="text-xs text-emerald-400/80 mt-1">{data.subtitle}</div>}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-emerald-500" />
    </div>
  )
}

function OutputNode({ data }: { data: { label: string; subtitle?: string } }) {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-amber-500 bg-amber-950/50 text-amber-300 min-w-[120px] text-center">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-amber-500" />
      <div className="font-semibold text-sm">{data.label}</div>
      {data.subtitle && <div className="text-xs text-amber-400/80 mt-1">{data.subtitle}</div>}
    </div>
  )
}

const nodeTypes = {
  codeBlock: CodeBlockNode,
  process: ProcessNode,
  output: OutputNode,
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "codeBlock",
    position: { x: 50, y: 100 },
    data: { label: "code", code: "package main\nfunc main(){...}" },
  },
  {
    id: "2",
    type: "process",
    position: { x: 280, y: 100 },
    data: { label: "compiler", subtitle: "go build" },
  },
  {
    id: "3",
    type: "output",
    position: { x: 480, y: 100 },
    data: { label: "executable", subtitle: "./hello" },
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#22d3d1" } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "#22d3d1" } },
]

export function SimulationPanel() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#22d3d1" } }, eds)),
    [setEdges],
  )

  return (
    <div className="h-full w-full bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-950"
      >
        <Background color="#334155" gap={20} />
        <Controls className="bg-slate-800 border-slate-700 text-slate-300 [&>button]:bg-slate-800 [&>button]:border-slate-700 [&>button]:text-slate-300 [&>button:hover]:bg-slate-700" />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "codeBlock":
                return "#06b6d4"
              case "process":
                return "#10b981"
              case "output":
                return "#f59e0b"
              default:
                return "#64748b"
            }
          }}
          className="bg-slate-900 border-slate-700"
        />
      </ReactFlow>
    </div>
  )
}
