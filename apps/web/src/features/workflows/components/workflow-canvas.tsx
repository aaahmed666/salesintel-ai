'use client';

import { useTranslations } from 'next-intl';
import { Icon } from '@/features/shell';
import type { WorkflowNode, WorkflowConnection } from '@salesintel/types';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  selectedNodeId?: string;
  onSelectNode: (node: WorkflowNode) => void;
}

export function WorkflowCanvas({
  nodes,
  connections,
  selectedNodeId,
  onSelectNode,
}: WorkflowCanvasProps) {
  const t = useTranslations('workflows');

  const nodeIcons = {
    trigger: { icon: 'bolt', bg: 'bg-primary-container/15 text-primary border-primary/20' },
    condition: { icon: 'device_hub', bg: 'bg-secondary-container/15 text-secondary border-secondary/20' },
    action: { icon: 'auto_fix_high', bg: 'bg-green-100 text-green-700 border-green-200' },
  };

  // Find node coordinate position helper to draw arrow lines
  const getNodeCenter = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    // Node width is ~180px, height is ~80px.
    return {
      x: node.position.x + 90,
      y: node.position.y + 40,
    };
  };

  return (
    <div className="relative w-full h-[25rem] bg-surface border border-outline-variant/60 rounded-xl overflow-hidden shadow-inner">
      {/* Background Dots Grid decoration */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#0b1c30 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      ></div>

      {/* SVG Connections Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 2 L 10 5 L 0 8 z" fill="#c7c4d7" />
          </marker>
        </defs>
        {connections.map((conn) => {
          const start = getNodeCenter(conn.sourceId);
          const end = getNodeCenter(conn.targetId);
          return (
            <line
              key={conn.id}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#c7c4d7"
              strokeWidth="2.5"
              markerEnd="url(#arrow)"
            />
          );
        })}
      </svg>

      {/* Draggable/Interactive Nodes Layer */}
      <div className="relative w-full h-full overflow-auto p-md z-10">
        {nodes.map((node) => {
          const config = nodeIcons[node.type] || nodeIcons.trigger;
          const active = selectedNodeId === node.id;
          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node)}
              style={{
                position: 'absolute',
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
              }}
              className={`w-48 p-sm rounded-xl border bg-white/90 backdrop-blur-sm shadow-sm cursor-pointer transition-all hover:-translate-y-[1px] hover:shadow-md ${
                active ? 'border-primary ring-2 ring-primary-container/15' : 'border-outline-variant'
              }`}
            >
              <div className="flex items-center gap-sm">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${config.bg}`}>
                  <Icon name={config.icon} size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
                    {t(node.type as never)}
                  </p>
                  <p className="font-label-md text-label-md font-bold text-on-background line-clamp-1">
                    {node.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
