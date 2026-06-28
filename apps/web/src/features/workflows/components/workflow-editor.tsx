'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@salesintel/ui';
import type { WorkflowNode, WorkflowTriggerType, WorkflowActionType } from '@salesintel/types';

interface WorkflowEditorProps {
  node: WorkflowNode;
  onUpdateNode: (nodeId: string, updatedConfig: Partial<WorkflowNode>) => void;
  onClose: () => void;
}

export function WorkflowEditor({ node, onUpdateNode, onClose }: WorkflowEditorProps) {
  const t = useTranslations('workflows');
  const [title, setTitle] = useState(node.title);

  // Trigger configs
  const [triggerType, setTriggerType] = useState<WorkflowTriggerType>(node.config.triggerType || 'meeting_uploaded');

  // Action configs
  const [actionType, setActionType] = useState<WorkflowActionType>(node.config.actionType || 'send_notification');
  const [taskTitle, setTaskTitle] = useState(node.config.taskTitle || '');
  const [escalateTo, setEscalateTo] = useState(node.config.escalateTo || '');

  // Condition configs
  const [conditionField, setConditionField] = useState(node.config.conditionField || '');
  const [conditionValue, setConditionValue] = useState(node.config.conditionValue || '');

  useEffect(() => {
    setTitle(node.title);
    if (node.config.triggerType) setTriggerType(node.config.triggerType);
    if (node.config.actionType) setActionType(node.config.actionType);
    setTaskTitle(node.config.taskTitle || '');
    setEscalateTo(node.config.escalateTo || '');
    setConditionField(node.config.conditionField || '');
    setConditionValue(node.config.conditionValue || '');
  }, [node]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const config: any = {};
    if (node.type === 'trigger') {
      config.triggerType = triggerType;
    } else if (node.type === 'action') {
      config.actionType = actionType;
      config.taskTitle = taskTitle;
      config.escalateTo = escalateTo;
    } else if (node.type === 'condition') {
      config.conditionField = conditionField;
      config.conditionOperator = 'greater_than';
      config.conditionValue = conditionValue;
    }

    onUpdateNode(node.id, {
      title,
      config,
    });
  };

  return (
    <div className="glass-card rounded-xl p-lg space-y-lg relative h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center border-b border-outline-variant/30 pb-md mb-md">
          <h4 className="font-headline-md text-headline-md font-bold text-on-background">
            {t('editor')}
          </h4>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          {/* Title */}
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-xs">Node Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              required
            />
          </div>

          {/* Trigger Node config */}
          {node.type === 'trigger' && (
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-xs">Select Trigger Event</label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value as never)}
                className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none"
              >
                {(['meeting_uploaded', 'analysis_completed', 'risk_detected', 'stage_changed'] as WorkflowTriggerType[]).map((type) => (
                  <option key={type} value={type}>
                    {t(`triggers.${type}` as never)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Condition Node config */}
          {node.type === 'condition' && (
            <div className="space-y-sm">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-xs">Criteria Field</label>
                <input
                  type="text"
                  placeholder="e.g. dealValue"
                  value={conditionField}
                  onChange={(e) => setConditionField(e.target.value)}
                  className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-xs">Target Value</label>
                <input
                  type="text"
                  placeholder="e.g. 100000"
                  value={conditionValue}
                  onChange={(e) => setConditionValue(e.target.value)}
                  className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
          )}

          {/* Action Node config */}
          {node.type === 'action' && (
            <div className="space-y-sm">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-xs">Select Automation Action</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as never)}
                  className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none"
                >
                  {(['send_notification', 'escalate', 'create_task', 'update_deal'] as WorkflowActionType[]).map((type) => (
                    <option key={type} value={type}>
                      {t(`actions.${type}` as never)}
                    </option>
                  ))}
                </select>
              </div>

              {actionType === 'create_task' && (
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-xs">Task checklist Title</label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              )}

              {actionType === 'escalate' && (
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-xs">Assignee Manager Analyst</label>
                  <input
                    type="text"
                    value={escalateTo}
                    onChange={(e) => setEscalateTo(e.target.value)}
                    className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-sm justify-end pt-md">
            <Button type="submit" variant="primary" fullWidth className="rounded-xl font-label-md">
              Update Properties
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
