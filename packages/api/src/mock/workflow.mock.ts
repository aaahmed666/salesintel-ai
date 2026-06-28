import type { Workflow } from '@salesintel/types';
import { delay } from './db';
import { mockWorkflows } from './workflow.data';

export const mockWorkflowApi = {
  async getWorkflows(): Promise<Workflow[]> {
    await delay(250);
    return [...mockWorkflows];
  },
  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    await delay(200);
    const existing = mockWorkflows.find((w) => w.id === id);
    if (!existing) throw new Error('Workflow not found');
    Object.assign(existing, workflow);
    return { ...existing };
  },
  async createWorkflow(workflowInput: Omit<Workflow, 'id' | 'createdAt'>): Promise<Workflow> {
    await delay(200);
    const newWf: Workflow = {
      id: `wf-${Date.now()}`,
      title: workflowInput.title,
      description: workflowInput.description,
      enabled: workflowInput.enabled ?? true,
      nodes: workflowInput.nodes || [],
      connections: workflowInput.connections || [],
      createdAt: new Date().toISOString(),
    };
    mockWorkflows.push(newWf);
    return newWf;
  },
};
