'use client';

import { useRef, useCallback, type WheelEvent } from 'react';
import { KanbanColumn } from './kanban-column';
import type { Deal, PipelineStage, StageMetric } from '@salesintel/types';

const STAGE_ORDER: PipelineStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

interface KanbanBoardProps {
  deals: Deal[];
  stageMetrics: StageMetric[];
}

/**
 * Horizontal scrollable kanban board with 6 columns.
 * Captures wheel events for horizontal scrolling and hides scrollbar.
 */
export function KanbanBoard({ deals, stageMetrics }: KanbanBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      e.preventDefault();
      containerRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  const metricMap = new Map(stageMetrics.map((m) => [m.stage, m]));

  const dealsByStage = STAGE_ORDER.reduce(
    (acc, stage) => {
      acc[stage] = deals.filter((d) => d.stage === stage);
      return acc;
    },
    {} as Record<PipelineStage, Deal[]>,
  );

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="flex flex-1 items-start gap-4 overflow-x-auto pb-4 no-scrollbar"
      style={{ scrollBehavior: 'smooth' }}
    >
      {STAGE_ORDER.map((stage) => (
        <KanbanColumn
          key={stage}
          stage={stage}
          metric={metricMap.get(stage) ?? { stage, dealCount: 0, totalValue: 0 }}
          deals={dealsByStage[stage]}
        />
      ))}
    </div>
  );
}
