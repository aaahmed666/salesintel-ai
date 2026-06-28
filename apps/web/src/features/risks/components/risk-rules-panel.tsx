'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import type { RiskRule } from '@salesintel/types';

interface RiskRulesPanelProps {
  rules: RiskRule[];
  onToggleRule: (id: string, enabled: boolean) => void;
  onCreateRule: (rule: Omit<RiskRule, 'id' | 'enabled'>) => void;
}

export function RiskRulesPanel({ rules, onToggleRule, onCreateRule }: RiskRulesPanelProps) {
  const t = useTranslations('risks');
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [condition, setCondition] = useState('');
  const [action, setAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !condition.trim() || !action.trim()) return;

    onCreateRule({ title, condition, action });
    setTitle('');
    setCondition('');
    setAction('');
    setIsAdding(false);
  };

  return (
    <div className="glass-card rounded-xl p-lg border-primary/20">
      <div className="flex items-center gap-md mb-lg">
        <Icon name="auto_fix_high" className="text-primary" size={24} />
        <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
          {t('rulesTitle')}
        </h3>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-lg p-md border border-dashed border-outline-variant rounded-xl bg-surface-container-low/30 space-y-md">
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-xs">Rule Name</label>
            <input
              type="text"
              placeholder="e.g. Sentiment Drift Notification"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-xs">{t('condition')}</label>
            <input
              type="text"
              placeholder="e.g. Sentiment Score < 40 across last 2 interactions"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-xs">Action Action</label>
            <input
              type="text"
              placeholder="e.g. Notify Account Manager via Slack"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="flex gap-sm justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Rule
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-md">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                {t('condition')}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={(e) => onToggleRule(rule.id, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <p className="font-body-md text-body-md mb-md text-on-background font-medium">
              If <span className="font-bold text-on-surface">{rule.condition}</span>...
            </p>
            <div className="flex items-center gap-xs text-on-surface-variant border-t border-outline-variant/30 pt-sm mt-sm">
              <Icon name="arrow_forward" size={16} />
              <span className="font-label-sm text-label-sm font-semibold">{rule.action}</span>
            </div>
          </div>
        ))}
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-lg w-full border-2 border-dashed border-outline-variant rounded-xl py-md font-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-xs"
        >
          <Icon name="add_circle" size={20} />
          {t('newTrigger')}
        </button>
      )}
    </div>
  );
}
