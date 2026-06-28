'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService, queryKeys, mutationKeys } from '@salesintel/api';
import type { ApiError, DirectoryContact, ContactStatus } from '@salesintel/types';

export function useContacts() {
  return useQuery<DirectoryContact[], ApiError>({
    queryKey: queryKeys.contacts.list(),
    queryFn: () => contactService.getContacts(),
  });
}

export function useAddContactNote() {
  const queryClient = useQueryClient();
  return useMutation<DirectoryContact, ApiError, { contactId: string; content: string; author: string }>({
    mutationKey: mutationKeys.contacts.addNote,
    mutationFn: ({ contactId, content, author }) => contactService.addContactNote(contactId, content, author),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.list() });
    },
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();
  return useMutation<DirectoryContact, ApiError, { contactId: string; status: ContactStatus }>({
    mutationKey: mutationKeys.contacts.updateStatus,
    mutationFn: ({ contactId, status }) => contactService.updateContactStatus(contactId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.list() });
    },
  });
}
