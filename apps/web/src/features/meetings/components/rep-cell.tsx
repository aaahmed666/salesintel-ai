'use client';

import type { MeetingRep } from '@salesintel/types';
import { Avatar, AvatarFallback, AvatarImage } from '@salesintel/ui';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Compact avatar + name used for the representative column and participants. */
export function RepCell({ rep, className }: { rep: MeetingRep; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <Avatar className="h-7 w-7">
        {rep.avatarUrl ? <AvatarImage src={rep.avatarUrl} alt={rep.name} /> : null}
        <AvatarFallback className="text-label-sm">{initials(rep.name)}</AvatarFallback>
      </Avatar>
      <span className="text-body-sm text-on-surface truncate font-medium">{rep.name}</span>
    </div>
  );
}
