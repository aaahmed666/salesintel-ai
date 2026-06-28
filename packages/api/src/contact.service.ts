import type { DirectoryContact, ContactStatus } from '@salesintel/types';
import { mockContactApi } from './mock/contact.mock';

export const contactService = {
  async getContacts(): Promise<DirectoryContact[]> {
    return mockContactApi.getContacts();
  },

  async addContactNote(contactId: string, content: string, author: string): Promise<DirectoryContact> {
    return mockContactApi.addContactNote(contactId, content, author);
  },

  async updateContactStatus(contactId: string, status: ContactStatus): Promise<DirectoryContact> {
    return mockContactApi.updateContactStatus(contactId, status);
  },
};
