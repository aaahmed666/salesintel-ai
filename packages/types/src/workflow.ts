import type { ID, ISODateString } from './common';

export type WorkflowTriggerType =
  | 'meeting_uploaded'
  | 'analysis_completed'
  | 'risk_detected'
  | 'stage_changed';

export type WorkflowActionType =
  | 'send_notification'
  | 'escalate'
  | 'create_task'
  | 'update_deal';

export type WorkflowNodeType = 'trigger' | 'condition' | 'action';

export interface WorkflowNode {
  id: ID;
  type: WorkflowNodeType;
  title: string;
  config: {
    triggerType?: WorkflowTriggerType;
    actionType?: WorkflowActionType;
    conditionField?: string;
    conditionOperator?: 'equals' | 'greater_than' | 'less_than' | 'contains';
    conditionValue?: string | number;
    notificationTarget?: string;
    taskTitle?: string;
    escalateTo?: string;
  };
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  id: ID;
  sourceId: ID;
  targetId: ID;
}

export interface Workflow {
  id: ID;
  title: string;
  description: string;
  enabled: boolean;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdAt: ISODateString;
}
