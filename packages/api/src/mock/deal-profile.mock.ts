import type { DealProfile, Task, Note } from '@salesintel/types';
import { delay } from './db';
import { mockDealProfiles } from './deal-profile.data';

export const mockDealProfileApi = {
  async getDealProfile(id: string): Promise<DealProfile> {
    await delay(300);
    const profile = mockDealProfiles[id] || mockDealProfiles['DEAL-4921-X'];
    if (!profile) throw new Error('Deal profile not found');
    return { ...profile };
  },

  async updateTaskStatus(dealId: string, taskId: string, completed: boolean): Promise<Task> {
    await delay(200);
    const profile = mockDealProfiles[dealId] || mockDealProfiles['DEAL-4921-X'];
    if (!profile) throw new Error('Deal profile not found');
    const task = profile.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.completed = completed;
    return { ...task };
  },

  async addTask(dealId: string, taskInput: { title: string; dueDate: string; priority: 'high' | 'medium' | 'low' }): Promise<Task> {
    await delay(200);
    const profile = mockDealProfiles[dealId] || mockDealProfiles['DEAL-4921-X'];
    if (!profile) throw new Error('Deal profile not found');
    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: taskInput.title,
      dueDate: taskInput.dueDate,
      completed: false,
      priority: taskInput.priority,
    };
    profile.tasks.unshift(newTask);
    return newTask;
  },

  async addNote(dealId: string, noteInput: { content: string; author: string }): Promise<Note> {
    await delay(200);
    const profile = mockDealProfiles[dealId] || mockDealProfiles['DEAL-4921-X'];
    if (!profile) throw new Error('Deal profile not found');
    const newNote: Note = {
      id: `n-${Date.now()}`,
      content: noteInput.content,
      author: noteInput.author,
      date: new Date().toISOString(),
    };
    profile.notes.unshift(newNote);
    return newNote;
  },
};
