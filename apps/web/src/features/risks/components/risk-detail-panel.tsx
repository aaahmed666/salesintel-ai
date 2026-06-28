'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import type { DealRisk, RiskStatus } from '@salesintel/types';

interface RiskDetailPanelProps {
  risk: DealRisk;
  onUpdateStatus: (id: string, status: RiskStatus, comment?: string) => void;
  onClose: () => void;
}

export function RiskDetailPanel({ risk, onUpdateStatus, onClose }: RiskDetailPanelProps) {
  const t = useTranslations('risks');
  const [comment, setComment] = useState('');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [targetStatus, setTargetStatus] = useState<RiskStatus>(risk.status);

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(risk.dealValue);

  const handleSubmitStatus = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(risk.id, targetStatus, comment);
    setComment('');
    setIsEditingStatus(false);
  };

  const statusColors = {
    detected: 'text-error bg-error-container/10 border-error/20',
    under_review: 'text-secondary bg-secondary-container/10 border-secondary/20',
    escalated: 'text-error bg-error-container/15 border-error/30 font-bold',
    resolved: 'text-green-700 bg-green-50/50 border-green-200',
  };

  return (
    <div className="glass-card rounded-xl p-lg space-y-lg relative h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start border-b border-outline-variant/30 pb-md mb-md">
          <div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-background">
              {t('sidebar.title')}
            </h3>
            <p className="text-body-sm text-on-surface-variant font-medium mt-xs">
              ID: {risk.dealId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors p-xs hover:bg-surface-container rounded-lg"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Info Grid */}
        <div className="space-y-md">
          <div>
            <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">
              {t('sidebar.dealInfo')}
            </h4>
            <p className="font-body-md text-body-md font-bold text-on-background">{risk.company}</p>
            <p className="text-body-sm text-on-surface-variant mt-xs">
              {formattedValue} • {risk.stage}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-sm border-t border-b border-outline-variant/30 py-md">
            <div>
              <p className="font-label-sm text-[11px] text-on-surface-variant mb-xs">
                {t('sidebar.statusLabel')}
              </p>
              <span className={`px-sm py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${statusColors[risk.status]}`}>
                {t(`statuses.${risk.status}` as never)}
              </span>
            </div>
            <div>
              <p className="font-label-sm text-[11px] text-on-surface-variant mb-xs">
                {t('sidebar.severityLabel')}
              </p>
              <span className="px-sm py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-surface-container-high border border-outline-variant/30 text-on-surface-variant">
                {t(`severities.${risk.severity}` as never)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">
                {t('sidebar.assignedTo')}
              </p>
              <p className="font-body-sm text-body-sm text-on-background font-semibold">
                {risk.repName}
              </p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">
                {t('sidebar.escalatedTo')}
              </p>
              <p className="font-body-sm text-body-sm text-on-background font-semibold">
                {risk.assigneeName || 'Unassigned'}
              </p>
            </div>
          </div>

          <div className="border-t border-outline-variant/30 pt-md">
            <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">
              {t('sidebar.ruleTriggers')}
            </h4>
            <p className="text-body-sm text-on-surface-variant bg-surface-container-low/50 p-sm rounded-lg border border-outline-variant/20 italic leading-relaxed">
              {risk.description}
            </p>
          </div>

          {/* Timeline */}
          <div className="border-t border-outline-variant/30 pt-md">
            <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-sm">
              {t('sidebar.timeline')}
            </h4>
            <div className="space-y-sm max-h-[12rem] overflow-y-auto pr-xs">
              {risk.timeline.map((item, idx) => (
                <div key={item.id} className="relative flex gap-sm items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center text-[10px] text-on-surface-variant">
                      <span className="font-bold text-on-surface">{item.actor}</span>
                      <span>
                        {new Date(item.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {item.comment && (
                      <p className="text-body-sm text-on-surface-variant leading-relaxed mt-[2px]">
                        {item.comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Workflow Actions */}
      <div className="border-t border-outline-variant/30 pt-md mt-md">
        <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-sm">
          {t('sidebar.resolutionWorkflow')}
        </h4>
        
        {isEditingStatus ? (
          <form onSubmit={handleSubmitStatus} className="space-y-sm">
            <div className="flex gap-sm">
              {(['under_review', 'escalated', 'resolved'] as RiskStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setTargetStatus(st)}
                  className={`flex-1 py-xs rounded font-label-sm text-label-sm border text-center font-bold transition-all ${
                    targetStatus === st
                      ? 'border-primary bg-primary-container/10 text-primary'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {t(`statuses.${st}` as never)}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              placeholder={t('actions.commentPlaceholder')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-surface-container-lowest text-body-sm rounded-lg border border-outline-variant p-sm outline-none resize-none focus:ring-1 focus:ring-primary focus:border-primary"
              required
            />
            <div className="flex gap-sm justify-end">
              <Button type="button" variant="secondary" onClick={() => setIsEditingStatus(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {t('actions.submit')}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex gap-sm">
            {risk.status !== 'resolved' && (
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  setTargetStatus('resolved');
                  setIsEditingStatus(true);
                }}
                className="bg-green-600 border-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                {t('actions.resolve')}
              </Button>
            )}
            {risk.status !== 'escalated' && (
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setTargetStatus('escalated');
                  setIsEditingStatus(true);
                }}
                className="rounded-xl"
              >
                {t('actions.escalate')}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
