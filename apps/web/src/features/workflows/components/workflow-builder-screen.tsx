'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { useWorkflows, useUpdateWorkflow, useCreateWorkflow } from '../queries';
import { WorkflowCanvas } from './workflow-canvas';
import { WorkflowEditor } from './workflow-editor';
import type { Workflow, WorkflowNode } from '@salesintel/types';

export function WorkflowBuilderScreen() {
  const t = useTranslations('workflows');
  const { data: workflows = [], isLoading, isError, refetch } = useWorkflows();
  const updateWorkflow = useUpdateWorkflow();
  const createWorkflow = useCreateWorkflow();

  const [activeWorkflowId, setActiveWorkflowId] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Fallback active workflow selection
  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId) || workflows[0];

  const handleUpdateNode = (nodeId: string, updatedConfig: Partial<WorkflowNode>) => {
    if (!activeWorkflow) return;
    const updatedNodes = activeWorkflow.nodes.map((n) => {
      if (n.id === nodeId) {
        return { ...n, ...updatedConfig };
      }
      return n;
    });

    updateWorkflow.mutate({
      id: activeWorkflow.id,
      workflow: { nodes: updatedNodes },
    });
    setSelectedNode(null);
  };

  const handleToggleWorkflow = (workflowId: string, enabled: boolean) => {
    updateWorkflow.mutate({
      id: workflowId,
      workflow: { enabled },
    });
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Default trigger node and action node blueprint
    const defaultNodes: WorkflowNode[] = [
      {
        id: 'node-1',
        type: 'trigger',
        title: 'Meeting Uploaded Trigger',
        config: { triggerType: 'meeting_uploaded' },
        position: { x: 50, y: 150 },
      },
      {
        id: 'node-2',
        type: 'action',
        title: 'Notify Slack channel',
        config: { actionType: 'send_notification', notificationTarget: 'Sales team Slack' },
        position: { x: 350, y: 150 },
      },
    ];

    createWorkflow.mutate({
      title: newTitle,
      description: newDesc,
      enabled: true,
      nodes: defaultNodes,
      connections: [{ id: 'conn-1', sourceId: 'node-1', targetId: 'node-2' }],
    }, {
      onSuccess: (newWf) => {
        setActiveWorkflowId(newWf.id);
        setIsCreating(false);
        setNewTitle('');
        setNewDesc('');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-label-md text-label-md text-on-surface-variant">Loading Workflow Builder...</p>
      </div>
    );
  }

  return (
    <div className="space-y-lg px-sm sm:px-md max-w-7xl mx-auto pb-xl">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-base font-bold">
            {t('pageTitle')}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t('subtitle')}
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-xs bg-primary text-on-primary py-sm px-md rounded-xl font-label-md hover:opacity-90 transition-opacity self-start"
        >
          <Icon name="add" size={20} />
          {t('newWorkflow')}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateWorkflow} className="max-w-2xl bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/60 space-y-md">
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-xs">Workflow Name</label>
            <input
              type="text"
              placeholder="e.g. Stage Change Slack Alert"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-xs">Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of trigger conditions..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-surface-container-lowest text-body-sm rounded-lg border border-outline-variant p-sm outline-none resize-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-sm justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Blueprint
            </Button>
          </div>
        </form>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
        {/* Left Side: Canvas & Editor */}
        <div className="col-span-12 lg:col-span-8 space-y-lg">
          {activeWorkflow ? (
            <div className="space-y-md">
              <div className="flex justify-between items-center flex-wrap gap-sm">
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-background">
                    {activeWorkflow.title}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-[2px]">
                    {activeWorkflow.description}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={activeWorkflow.enabled}
                    onChange={(e) => handleToggleWorkflow(activeWorkflow.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-outline-variant rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Canvas layout */}
              <WorkflowCanvas
                nodes={activeWorkflow.nodes}
                connections={activeWorkflow.connections}
                selectedNodeId={selectedNode?.id}
                onSelectNode={(node) => setSelectedNode(node)}
              />
            </div>
          ) : (
            <div className="text-center py-24 text-on-surface-variant">No active workflow.</div>
          )}
        </div>

        {/* Right Side: List & properties editor drawer */}
        <div className="col-span-12 lg:col-span-4 space-y-lg">
          {selectedNode ? (
            <WorkflowEditor
              node={selectedNode}
              onUpdateNode={handleUpdateNode}
              onClose={() => setSelectedNode(null)}
            />
          ) : (
            <div className="glass-card rounded-xl p-lg space-y-md">
              <h4 className="font-label-md text-label-md font-bold uppercase tracking-widest text-on-surface-variant">
                {t('list')}
              </h4>
              <div className="space-y-md">
                {workflows.map((wf) => (
                  <div
                    key={wf.id}
                    onClick={() => {
                      setActiveWorkflowId(wf.id);
                      setSelectedNode(null);
                    }}
                    className={`p-md rounded-xl border cursor-pointer hover:border-primary transition-all ${
                      (activeWorkflowId === wf.id || (!activeWorkflowId && workflows[0]?.id === wf.id))
                        ? 'border-primary bg-primary-container/5'
                        : 'border-outline-variant bg-surface-container-low/20'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-xs">
                      <p className="font-label-md text-label-md font-bold text-on-background line-clamp-1">
                        {wf.title}
                      </p>
                      <span className={`h-2 w-2 rounded-full ${wf.enabled ? 'bg-green-500' : 'bg-outline-variant'}`}></span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                      {wf.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
