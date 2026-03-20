import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Layers, MousePointer2, Sun, Moon } from 'lucide-react';
import dagre from 'dagre';
import { getGapStatus } from '../data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// Theme Tokens
// ─────────────────────────────────────────────────────────────────────────────

const THEMES = {
  dark: {
    // Container
    containerBg:     '#111111',
    containerBorder: '#222222',
    containerShadow: '0 0 0 1px #1A1A1A, 0 24px 60px rgba(0,0,0,0.5)',
    // Canvas
    canvasBg:        '#0D0D0D',
    canvasBorder:    '#1E1E1E',
    gridColor:       '#2A2A2A',
    gridOpacity:     0.5,
    // Text
    titleColor:      '#EAEAEA',
    subtitleColor:   '#6B7280',
    footerColor:     '#374151',
    // Badge / hint
    badgeBg:         '#1A1A1A',
    badgeBorder:     '#2A2A2A',
    badgeText:       '#6B7280',
    // Legend pill
    legendBg:        '#1A1A1A',
    legendBorder:    '#2A2A2A',
    legendItemBg:    '#0D0D0D',
    legendItemText:  '#9CA3AF',
    // Spinner
    spinnerTrack:    '#2A2A2A',
    spinnerHead:     '#6366F1',
    spinnerText:     '#4B5563',
    // Controls
    ctrlBg:          '#1A1A1A',
    ctrlBorder:      '#2A2A2A',
    ctrlShadow:      '0 4px 12px rgba(0,0,0,0.4)',
    // Toggle button
    toggleBg:        '#1A1A1A',
    toggleBorder:    '#3A3A3A',
    toggleColor:     '#9CA3AF',
    toggleHoverBg:   '#2A2A2A',
    // Edge defaults
    edgeDefault:     '#4A4A4A',
    edgeActive:      '#6366F1',
    edgeActiveShadow: 'drop-shadow(0 0 4px rgba(99,102,241,0.6))',
    // Tooltip
    tooltipBg:       '#0D0D0D',
    tooltipDivider:  '#2A2A2A',
    tooltipArrowBg:  '#0D0D0D',
    tooltipLvlColor: '#F59E0B',
    tooltipGoalColor:'#10B981',
    tooltipMutedText:'#6B7280',
    // Progress bar track
    barTrack:        '#1A1A1A',
    // Node status colors
    nodeColors: {
      matched: {
        bg: '#0D2818', border: '#10B981', text: '#6EE7B7',
        dot: '#10B981', glow: 'rgba(16,185,129,0.35)',
        barFill: '#10B981', badge: '#064E3B', badgeText: '#6EE7B7',
      },
      weak: {
        bg: '#2C1A00', border: '#F59E0B', text: '#FCD34D',
        dot: '#F59E0B', glow: 'rgba(245,158,11,0.35)',
        barFill: '#F59E0B', badge: '#451A03', badgeText: '#FCD34D',
      },
      missing: {
        bg: '#2A0A0A', border: '#EF4444', text: '#FCA5A5',
        dot: '#EF4444', glow: 'rgba(239,68,68,0.35)',
        barFill: '#EF4444', badge: '#450A0A', badgeText: '#FCA5A5',
      },
      default: {
        bg: '#2A2A2A', border: '#3A3A3A', text: '#EAEAEA',
        dot: '#6B7280', glow: 'rgba(107,114,128,0.2)',
        barFill: '#6B7280', badge: '#1A1A1A', badgeText: '#9CA3AF',
      },
    },
  },

  light: {
    // Container
    containerBg:     '#FFFFFF',
    containerBorder: '#E5E7EB',
    containerShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)',
    // Canvas
    canvasBg:        '#F8F9FB',
    canvasBorder:    '#E5E7EB',
    gridColor:       '#D1D5DB',
    gridOpacity:     0.6,
    // Text
    titleColor:      '#111827',
    subtitleColor:   '#6B7280',
    footerColor:     '#9CA3AF',
    // Badge / hint
    badgeBg:         '#F3F4F6',
    badgeBorder:     '#E5E7EB',
    badgeText:       '#6B7280',
    // Legend pill
    legendBg:        '#F3F4F6',
    legendBorder:    '#E5E7EB',
    legendItemBg:    '#FFFFFF',
    legendItemText:  '#374151',
    // Spinner
    spinnerTrack:    '#E5E7EB',
    spinnerHead:     '#6366F1',
    spinnerText:     '#9CA3AF',
    // Controls
    ctrlBg:          '#FFFFFF',
    ctrlBorder:      '#E5E7EB',
    ctrlShadow:      '0 2px 8px rgba(0,0,0,0.08)',
    // Toggle button
    toggleBg:        '#F3F4F6',
    toggleBorder:    '#E5E7EB',
    toggleColor:     '#6B7280',
    toggleHoverBg:   '#E5E7EB',
    // Edge defaults
    edgeDefault:     '#D1D5DB',
    edgeActive:      '#6366F1',
    edgeActiveShadow: 'drop-shadow(0 0 3px rgba(99,102,241,0.45))',
    // Tooltip
    tooltipBg:       '#1F2937',
    tooltipDivider:  '#374151',
    tooltipArrowBg:  '#1F2937',
    tooltipLvlColor: '#F59E0B',
    tooltipGoalColor:'#10B981',
    tooltipMutedText:'#9CA3AF',
    // Progress bar track
    barTrack:        '#E5E7EB',
    // Node status colors
    nodeColors: {
      matched: {
        bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46',
        dot: '#10B981', glow: 'rgba(16,185,129,0.15)',
        barFill: '#10B981', badge: '#D1FAE5', badgeText: '#065F46',
      },
      weak: {
        bg: '#FFFBEB', border: '#FCD34D', text: '#92400E',
        dot: '#F59E0B', glow: 'rgba(245,158,11,0.15)',
        barFill: '#F59E0B', badge: '#FEF3C7', badgeText: '#92400E',
      },
      missing: {
        bg: '#FFF1F2', border: '#FCA5A5', text: '#991B1B',
        dot: '#EF4444', glow: 'rgba(239,68,68,0.15)',
        barFill: '#EF4444', badge: '#FFE4E6', badgeText: '#991B1B',
      },
      default: {
        bg: '#F9FAFB', border: '#E5E7EB', text: '#374151',
        dot: '#9CA3AF', glow: 'rgba(156,163,175,0.15)',
        barFill: '#9CA3AF', badge: '#F3F4F6', badgeText: '#6B7280',
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getNodeColors(status, theme) {
  const map = THEMES[theme].nodeColors;
  return map[status] || map.default;
}

function getSkillInsight(skill) {
  const diff = skill.requiredLevel - skill.yourLevel;
  if (diff <= 0) return "You've fully satisfied this requirement. Ready to mentor!";
  if (skill.yourLevel === 0) return "Not detected in your background. High-priority prerequisite.";
  return `Need ${diff} more level${diff > 1 ? 's' : ''} to reach proficiency. Keep practicing.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SkillNode — reads theme from data prop
// ─────────────────────────────────────────────────────────────────────────────
const SkillNode = ({ data }) => {
  const { skill, status, isHighlighted, graphTheme = 'dark' } = data;
  const [isHovered, setIsHovered] = useState(false);

  const t = THEMES[graphTheme];
  const colors = getNodeColors(status, graphTheme);
  const pct = Math.min((skill.yourLevel / Math.max(skill.requiredLevel, 1)) * 100, 100);

  const nodeStyle = {
    background: colors.bg,
    border: `${isHighlighted ? 2 : 1.5}px solid ${colors.border}`,
    boxShadow: isHighlighted || isHovered
      ? `0 0 16px 2px ${colors.glow}, 0 0 0 1px ${colors.border}50`
      : graphTheme === 'light'
        ? '0 1px 4px rgba(0,0,0,0.06)'
        : 'none',
    transition: 'box-shadow 220ms ease, border-color 220ms ease, transform 220ms ease',
    transform: isHighlighted ? 'scale(1.04)' : 'scale(1)',
    borderRadius: '14px',
    minWidth: '210px',
    padding: '14px',
    cursor: 'pointer',
  };

  const handleStyle = {
    background: colors.border,
    width: 8,
    height: 8,
    border: `2px solid ${colors.border}`,
    boxShadow: `0 0 5px ${colors.glow}`,
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />

      <div style={nodeStyle}>
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[13px] font-bold leading-tight truncate" style={{ color: colors.text }}>
              {skill.name}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: colors.dot, boxShadow: `0 0 4px ${colors.glow}` }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: t.subtitleColor }}>
                Lvl {skill.yourLevel}/{skill.requiredLevel}
              </span>
            </div>
          </div>
          {/* Status badge */}
          <span
            className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
            style={{ background: colors.badge, color: colors.badgeText, border: `1px solid ${colors.border}50` }}
          >
            {status}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: t.barTrack }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: colors.barFill,
              boxShadow: `0 0 5px ${colors.glow}`,
              borderRadius: '9999px',
            }}
          />
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            className="absolute -top-28 left-1/2 -translate-x-1/2 w-60 p-3.5 rounded-2xl z-[200] pointer-events-none"
            style={{
              background: t.tooltipBg,
              border: `1px solid ${colors.border}60`,
              boxShadow: `0 0 20px 2px ${colors.glow}, 0 8px 24px rgba(0,0,0,0.5)`,
            }}
          >
            <div
              className="flex justify-between items-center pb-2 mb-2"
              style={{ borderBottom: `1px solid ${t.tooltipDivider}` }}
            >
              <span className="text-[12px] font-bold text-white">{skill.name}</span>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                style={{ background: colors.badge, color: colors.badgeText }}
              >
                {skill.category || 'Skill'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <p className="text-[9px] uppercase font-bold" style={{ color: t.tooltipMutedText }}>Your Level</p>
                <p className="text-sm font-black" style={{ color: t.tooltipLvlColor }}>{skill.yourLevel}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase font-bold" style={{ color: t.tooltipMutedText }}>Goal</p>
                <p className="text-sm font-black" style={{ color: t.tooltipGoalColor }}>{skill.requiredLevel}</p>
              </div>
            </div>
            <p className="text-[10px] leading-relaxed italic" style={{ color: t.tooltipMutedText }}>
              {getSkillInsight(skill)}
            </p>
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45"
              style={{
                background: t.tooltipArrowBg,
                border: `1px solid ${colors.border}60`,
                borderTop: 'none',
                borderLeft: 'none',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Layout helper
// ─────────────────────────────────────────────────────────────────────────────
const nodeWidth = 230;
const nodeHeight = 90;
const isHorizontal = true;

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR', ranksep: 110, nodesep: 50 });

  nodes.forEach(n => dagreGraph.setNode(n.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach(e => dagreGraph.setEdge(e.source, e.target));
  dagre.layout(dagreGraph);

  nodes.forEach(node => {
    const pos = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    node.position = { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 };
  });

  return { nodes, edges };
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'skillgraph_theme';

const SkillGraph = ({ skills, graphData }) => {
  // ── Theme state w/ localStorage persistence ──
  const [graphTheme, setGraphTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    // Fall back to system preference
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setGraphTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  };

  const t = THEMES[graphTheme];

  // ── ReactFlow state ──
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isReady, setIsReady] = useState(false);

  // Re-build nodes when graphData, skills, OR theme changes
  useEffect(() => {
    if (!graphData || !skills || skills.length === 0) return;
    try {
      const skillLookup = Object.fromEntries(skills.map(s => [s.name.toLowerCase(), s]));

      const rawNodes = graphData.map(node => {
        const skill = skillLookup[node.id.toLowerCase()] || { name: node.id, requiredLevel: 0, yourLevel: 0 };
        const status = getGapStatus(skill);
        return {
          id: node.id,
          type: 'skillNode',
          data: { skill, status, isHighlighted: false, graphTheme },
          position: { x: 0, y: 0 },
        };
      });

      const rawEdges = graphData.flatMap(node =>
        node.dependsOn.map(depId => ({
          id: `e-${depId}-${node.id}`,
          source: depId,
          target: node.id,
          animated: false,
          style: { stroke: t.edgeDefault, strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: t.edgeDefault, width: 14, height: 14 },
        }))
      );

      const { nodes: ln, edges: le } = getLayoutedElements(rawNodes, rawEdges);
      setNodes(ln);
      setEdges(le);
      setIsReady(true);
    } catch (err) {
      console.error('Layout failed:', err);
    }
  }, [graphData, skills, graphTheme, setNodes, setEdges]);

  // When only theme changes, update node data in-place (no layout re-run)
  useEffect(() => {
    setNodes(nds =>
      nds.map(n => ({ ...n, data: { ...n.data, graphTheme } }))
    );
    setEdges(eds =>
      eds.map(e => ({
        ...e,
        style: { ...e.style, stroke: e.animated ? t.edgeActive : t.edgeDefault },
        markerEnd: { ...e.markerEnd, color: e.animated ? t.edgeActive : t.edgeDefault },
      }))
    );
  }, [graphTheme]);

  const onNodeClick = useCallback((_, node) => {
    const reachable = new Set();
    const walk = (id, dir) => {
      reachable.add(id);
      edges.forEach(e => {
        if (dir === 'down' && e.source === id && !reachable.has(e.target)) walk(e.target, 'down');
        if (dir === 'up' && e.target === id && !reachable.has(e.source)) walk(e.source, 'up');
      });
    };
    walk(node.id, 'down');
    walk(node.id, 'up');

    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, isHighlighted: reachable.has(n.id), graphTheme } })));
    setEdges(eds => eds.map(e => {
      const active = reachable.has(e.source) && reachable.has(e.target);
      return {
        ...e,
        animated: active,
        style: {
          stroke: active ? t.edgeActive : t.edgeDefault,
          strokeWidth: active ? 2.5 : 1.5,
          filter: active ? t.edgeActiveShadow : 'none',
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: active ? t.edgeActive : t.edgeDefault, width: 14, height: 14 },
      };
    }));
  }, [edges, graphTheme, t, setNodes, setEdges]);

  const onPaneClick = useCallback(() => {
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, isHighlighted: false, graphTheme } })));
    setEdges(eds => eds.map(e => ({
      ...e,
      animated: false,
      style: { stroke: t.edgeDefault, strokeWidth: 1.5, filter: 'none' },
      markerEnd: { type: MarkerType.ArrowClosed, color: t.edgeDefault, width: 14, height: 14 },
    })));
  }, [graphTheme, t, setNodes, setEdges]);

  const nodeTypes = useMemo(() => ({ skillNode: SkillNode }), []);

  const legendItems = [
    { status: 'matched', label: 'Mastered' },
    { status: 'weak',    label: 'Weak' },
    { status: 'missing', label: 'Missing' },
  ];

  return (
    <motion.div
      className={`rounded-3xl p-6 mb-8 overflow-hidden relative flex flex-col sg-theme-${graphTheme}`}
      animate={{
        background: t.containerBg,
        borderColor: t.containerBorder,
      }}
      transition={{ duration: 0.25 }}
      style={{
        background: t.containerBg,
        border: `1px solid ${t.containerBorder}`,
        boxShadow: t.containerShadow,
        height: '750px',
      }}
    >
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        {/* Title */}
        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              boxShadow: graphTheme === 'dark'
                ? '0 0 16px rgba(99,102,241,0.4)'
                : '0 0 12px rgba(99,102,241,0.2)',
            }}
          >
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight" style={{ color: t.titleColor }}>
              Technical Dependency Graph
            </h3>
            <p className="text-sm font-medium" style={{ color: t.subtitleColor }}>
              Visualizing prerequisite chains for your target role
            </p>
          </div>
        </div>

        {/* Right controls: legend + theme toggle */}
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div
            className="flex items-center gap-2 p-1.5 rounded-2xl"
            style={{ background: t.legendBg, border: `1px solid ${t.legendBorder}` }}
          >
            {legendItems.map(({ status, label }) => {
              const c = getNodeColors(status, graphTheme);
              return (
                <div
                  key={status}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{ background: t.legendItemBg, border: `1px solid ${t.legendBorder}` }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: c.dot, boxShadow: `0 0 5px ${c.glow}` }}
                  />
                  <span className="text-[11px] font-bold" style={{ color: t.legendItemText }}>{label}</span>
                </div>
              );
            })}
          </div>

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            title={graphTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-[11px] transition-colors duration-200"
            style={{
              background: t.toggleBg,
              border: `1px solid ${t.toggleBorder}`,
              color: t.toggleColor,
              cursor: 'pointer',
              boxShadow: graphTheme === 'light' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {graphTheme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
                >
                  <Sun className="w-3.5 h-3.5" />
                  Light
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
                >
                  <Moon className="w-3.5 h-3.5" />
                  Dark
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Canvas ── */}
      <motion.div
        className="relative flex-1 rounded-2xl overflow-hidden"
        animate={{ background: t.canvasBg, borderColor: t.canvasBorder }}
        transition={{ duration: 0.25 }}
        style={{
          background: t.canvasBg,
          border: `1px solid ${t.canvasBorder}`,
          minHeight: '500px',
        }}
      >
        {!isReady || nodes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className="w-10 h-10 rounded-full border-4 animate-spin"
              style={{ borderColor: t.spinnerTrack, borderTopColor: t.spinnerHead }}
            />
            <p className="text-sm font-medium" style={{ color: t.spinnerText }}>
              Calculating spatial layout…
            </p>
          </div>
        ) : (
          <div className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.25 }}
              minZoom={0.1}
              maxZoom={2}
              style={{ background: 'transparent' }}
            >
              <Background color={t.gridColor} gap={24} size={1} style={{ opacity: t.gridOpacity }} />
              <Controls
                style={{
                  background: t.ctrlBg,
                  border: `1px solid ${t.ctrlBorder}`,
                  borderRadius: '12px',
                  boxShadow: t.ctrlShadow,
                }}
              />
            </ReactFlow>

            {/* Hint badge */}
            <div className="absolute top-3 left-3 z-10">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                style={{
                  background: t.badgeBg,
                  border: `1px solid ${t.badgeBorder}`,
                  color: t.badgeText,
                }}
              >
                <MousePointer2 className="w-3 h-3" />
                Click a node to trace dependencies
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Footer ── */}
      <div className="mt-4 flex items-center justify-center gap-2" style={{ color: t.footerColor }}>
        <Layers className="w-4 h-4 opacity-60" />
        <span className="text-xs font-medium">
          Auto-layout optimized for {nodes?.length || 0} technical competencies
        </span>
      </div>
    </motion.div>
  );
};

export default SkillGraph;
