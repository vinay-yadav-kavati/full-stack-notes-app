import { supabase } from '../lib/supabase';

export interface CreateNoteInput {
  title: string;
  content?: string;
}

export interface UpdateNoteInput {
  title: string;
  content?: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  is_pinned: boolean;
  is_archived: boolean;
  is_trashed?: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Service to handle Notes operations with Supabase
 */
export const notesService = {
  async getNotes(): Promise<Note[]> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required.');
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(error.message || 'Failed to fetch notes.');
    }

    return (data || []) as Note[];
  },

  async createNote(input: CreateNoteInput): Promise<Note> {
    const title = input.title?.trim();
    if (!title) {
      throw new Error('Title is required');
    }
    if (title.length > 100) {
      throw new Error('Title must not exceed 100 characters');
    }

    // Get current authenticated user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required. Please sign in to create notes.');
    }

    // Insert record into Supabase 'notes' table
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: title,
        content: input.content?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to save note to database');
    }

    return data as Note;
  },

  async updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
    const title = input.title?.trim();
    if (!title) {
      throw new Error('Title is required');
    }
    if (title.length > 100) {
      throw new Error('Title must not exceed 100 characters');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required.');
    }

    const { data, error } = await supabase
      .from('notes')
      .update({
        title: title,
        content: input.content?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to update note.');
    }

    return data as Note;
  },

  async deleteNote(id: string): Promise<void> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required.');
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message || 'Failed to delete note.');
    }
  },

  async togglePinNote(id: string, isPinned: boolean): Promise<Note> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required.');
    }

    const { data, error } = await supabase
      .from('notes')
      .update({
        is_pinned: isPinned,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to update pin status.');
    }

    return data as Note;
  },

  async toggleArchiveNote(id: string, isArchived: boolean): Promise<Note> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required.');
    }

    const { data, error } = await supabase
      .from('notes')
      .update({
        is_archived: isArchived,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to update archive status.');
    }

    return data as Note;
  },

  async toggleTrashNote(id: string, isTrashed: boolean): Promise<Note> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required.');
    }

    const { data, error } = await supabase
      .from('notes')
      .update({
        is_trashed: isTrashed,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to update trash status.');
    }

    return data as Note;
  },

  async emptyTrash(): Promise<void> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required.');
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('user_id', user.id)
      .eq('is_trashed', true);

    if (error) {
      throw new Error(error.message || 'Failed to empty trash.');
    }
  },
};
