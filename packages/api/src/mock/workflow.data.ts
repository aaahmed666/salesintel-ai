import type { Workflow } from '@salesintel/types';

export const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    title: 'High-Value Risk Auto-Escalation',
    description: 'Triggers when a risk is detected on a deal valued over $100k, raising alert reviews to manager levels automatically.',
    enabled: true,
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        title: 'Risk Detected Trigger',
        config: { triggerType: 'risk_detected' },
        position: { x: 50, y: 150 },
      },
      {
        id: 'node-2',
        type: 'condition',
        title: 'Deal Value > $100k',
        config: {
          conditionField: 'dealValue',
          conditionOperator: 'greater_than',
          conditionValue: 100000,
        },
        position: { x: 300, y: 150 },
      },
      {
        id: 'node-3',
        type: 'action',
        title: 'Escalate to Sales Manager',
        config: {
          actionType: 'escalate',
          escalateTo: 'Alex Mercer (Sales Manager)',
        },
        position: { x: 550, y: 150 },
      },
    ],
    connections: [
      { id: 'conn-1', sourceId: 'node-1', targetId: 'node-2' },
      { id: 'conn-2', sourceId: 'node-2', targetId: 'node-3' },
    ],
    createdAt: '2026-06-10T09:00:00Z',
  },
  {
    id: 'wf-2',
    title: 'Post-Meeting Analysis Task Creator',
    description: 'Generates a reminder checklist task for sales reps when a call/meeting analysis completes.',
    enabled: false,
    nodes: [
      {
        id: 'node-21',
        type: 'trigger',
        title: 'Analysis Completed',
        config: { triggerType: 'analysis_completed' },
        position: { x: 50, y: 150 },
      },
      {
        id: 'node-22',
        type: 'action',
        title: 'Assign Follow-Up Task',
        config: {
          actionType: 'create_task',
          taskTitle: 'Review AI Transcript Highlights & Recommendations',
        },
        position: { x: 350, y: 150 },
      },
    ],
    connections: [{ id: 'conn-21', sourceId: 'node-21', targetId: 'node-22' }],
    createdAt: '2026-06-12T11:00:00Z',
  },
];
