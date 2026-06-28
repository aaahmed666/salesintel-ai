import type { DirectoryContact, ContactStatus } from '@salesintel/types';
import { delay } from './db';
import { mockContacts } from './contact.data';

export const mockContactApi = {
  async getContacts(): Promise<DirectoryContact[]> {
    await delay(350);
    return [...mockContacts];
  },

  async addContactNote(contactId: string, content: string, author: string): Promise<DirectoryContact> {
    await delay(200);
    const contact = mockContacts.find((c) => c.id === contactId);
    if (!contact) throw new Error('Contact not found');
    const newNote = {
      id: `n-c-${Date.now()}`,
      content,
      author,
      date: new Date().toISOString(),
    };
    contact.notes.unshift(newNote);
    contact.timeline.unshift({
      id: `t-c-${Date.now()}`,
      type: 'note',
      title: 'Added a note',
      description: content.substring(0, 60) + (content.length > 60 ? '...' : ''),
      timestamp: new Date().toISOString(),
    });
    return { ...contact };
  },

  async updateContactStatus(contactId: string, status: ContactStatus): Promise<DirectoryContact> {
    await delay(250);
    const contact = mockContacts.find((c) => c.id === contactId);
    if (!contact) throw new Error('Contact not found');
    const oldStatus = contact.status;
    contact.status = status;
    contact.timeline.unshift({
      id: `t-c-${Date.now()}`,
      type: 'note',
      title: 'Status changed',
      description: `Status updated from ${oldStatus} to ${status}.`,
      timestamp: new Date().toISOString(),
    });
    return { ...contact };
  },
};
