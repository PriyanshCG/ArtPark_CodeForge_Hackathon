import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MarkerType, 
  useNodesState, 
  useEdgesState, 
  Handle, 
  Position 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Info, Layers, Maximize, MousePointer2 } from 'lucide-react';
import dagre from 'dagre';
import { getGapStatus, getGapColor } from '../data/mockData';

// Custom Node Component to maintain Stripe/Linear aesthetic
const SkillNode = ({ data }) => {
  const { skill, colors, isHighlighted } = data;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative group transition-all duration-300 transform
        ${isHighlighted ? 'scale-105 ring-4 ring-indigo-500/20' : 'opacity-80 grayscale-[0.2] hover:opacity-100 hover:grayscale-0'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Left} className="!bg-slate-300 w-2 h-2" />
      
      <div className={`p-4 rounded-2xl border-2 min-w-[200px] shadow-sm backdrop-blur-sm transition-all
        ${colors.bg} ${colors.border} ${isHighlighted ? 'shadow-indigo-500/20 shadow-xl' : 'shadow-slate-200/50'}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className={`text-base font-bold ${colors.text}`}>{skill.name}</span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Lvl {skill.yourLevel}/{skill.requiredLevel}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <div className="h-1 w-12 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min((skill.yourLevel / skill.requiredLevel) * 100, 100)}%` }}
                   className={`h-full ${nodeColorToBgIntensity(colors.dot)}`}
                />
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-1/2 -top-24 -translate-x-1/2 w-64 bg-slate-900 text-white p-4 rounded-2xl z-[100] shadow-2xl pointer-events-none"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-sm font-bold">{skill.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border border-white/20 capitalize`}>
                  {skill.category || 'Skill'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pb-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Your Level</span>
                  <span className="text-sm font-black text-amber-400">{skill.yourLevel}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Goal</span>
                  <span className="text-sm font-black text-emerald-400">{skill.requiredLevel}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                {getSkillInsight(skill)}
              </p>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <Handle type="source" position={Position.Right} className="!bg-slate-300 w-2 h-2" />
    </div>
  );
};

// Layout Helper
const nodeWidth = 240;
const nodeHeight = 100;

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 40 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

const isHorizontal = true;

const SkillGraph = ({ skills, graphData }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isReady, setIsReady] = useState(false);

  // Layout and Data processing
  useEffect(() => {
    if (!graphData || !skills || skills.length === 0) return;

    try {
      const skillLookup = Object.fromEntries(skills.map(s => [s.name.toLowerCase(), s]));

      const rawNodes = graphData.map((node) => {
        const skillRaw = skillLookup[node.id.toLowerCase()] || { name: node.id, requiredLevel: 0, yourLevel: 0 };
        const status = getGapStatus(skillRaw);
        const colors = getGapColor(status);
        
        return {
          id: node.id,
          type: 'skillNode',
          data: { 
            skill: skillRaw, 
            status, 
            colors,
            isHighlighted: false
          },
          position: { x: 0, y: 0 }
        };
      });

      const rawEdges = [];
      graphData.forEach(node => {
        node.dependsOn.forEach(depId => {
          rawEdges.push({
            id: `e-${depId}-${node.id}`,
            source: depId,
            target: node.id,
            animated: true,
            style: { stroke: '#cbd5e1', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#cbd5e1' }
          });
        });
      });

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges);
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setIsReady(true);
    } catch (err) {
      console.error("Layout failed:", err);
    }
  }, [graphData, skills, setNodes, setEdges]);

  const onNodeClick = useCallback((event, node) => {
    const reachableNodes = new Set();
    const findReachable = (id, dir) => {
      reachableNodes.add(id);
      edges.forEach(e => {
        if (dir === 'down' && e.source === id && !reachableNodes.has(e.target)) findReachable(e.target, dir);
        if (dir === 'up' && e.target === id && !reachableNodes.has(e.source)) findReachable(e.source, dir);
      });
    };
    
    findReachable(node.id, 'down');
    findReachable(node.id, 'up');

    setNodes((nds) => 
      nds.map((n) => ({
        ...n,
        data: { ...n.data, isHighlighted: reachableNodes.has(n.id) }
      }))
    );

    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        style: { 
          ...e.style, 
          stroke: reachableNodes.has(e.source) && reachableNodes.has(e.target) ? '#6366f1' : '#cbd5e1',
          strokeWidth: reachableNodes.has(e.source) && reachableNodes.has(e.target) ? 3 : 2
        },
        animated: reachableNodes.has(e.source) && reachableNodes.has(e.target)
      }))
    );
  }, [edges, setNodes, setEdges]);

  const nodeTypes = useMemo(() => ({ skillNode: SkillNode }), []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 mb-8 overflow-hidden relative flex flex-col" style={{ height: '750px' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-100">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Technical Dependency Graph</h3>
            <p className="text-sm text-slate-500 font-medium">Visualizing prerequisite chains for your target role</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-sm border border-slate-200">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
            <span className="text-[11px] font-bold text-slate-700">Mastered</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-sm border border-slate-200">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
            <span className="text-[11px] font-bold text-slate-700">Weak</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-sm border border-slate-200">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
            <span className="text-[11px] font-bold text-slate-700">Missing</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 overflow-hidden min-h-[500px]">
        {!isReady || nodes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
             <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
             <p className="text-sm font-medium">Calculating spatial layout...</p>
          </div>
        ) : (
          <div className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.1}
              maxZoom={2}
              className="rounded-2xl"
              // Ensure we re-fit when nodes change
              onLoad={(instance) => instance.fitView()}
            >
              <Background color="#cbd5e1" gap={20} size={1} />
              <Controls className="!bg-white !border-slate-200 !shadow-lg rounded-xl" />
            </ReactFlow>

            <div className="absolute top-4 left-4 z-10 flex gap-2">
               <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 shadow-sm">
                  <MousePointer2 className="w-3 h-3" />
                  Graph Ready
               </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400 font-medium">
         <Layers className="w-4 h-4 opacity-50" />
         Auto-layouts optimized for {nodes?.length || 0} technical competencies
      </div>
    </div>
  );
};

// Utilities
function nodeColorToBgIntensity(dotClass) {
   if (dotClass === 'bg-emerald-500') return 'bg-emerald-500/80';
   if (dotClass === 'bg-amber-500') return 'bg-amber-500/80';
   return 'bg-rose-500/80';
}

function getSkillInsight(skill) {
   const diff = skill.requiredLevel - skill.yourLevel;
   if (diff <= 0) return "You've fully satisfied this requirement. Ready to mentor!";
   if (skill.yourLevel === 0) return "Not detected in your background. High-priority prerequisite.";
   return `Need ${diff} more levels to reach proficiency. Keep practicing.`;
}

export default SkillGraph;
