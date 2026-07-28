import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'avatars';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface AvatarUploadResult {
  path: string;
  publicUrl: string;
}

/**
 * Service handling Supabase Storage operations for user profile pictures (avatars).
 */
export const avatarService = {
  /**
   * Validates file mime type and size before upload.
   */
  validateAvatarFile(file: File): void {
    if (!file) {
      throw new Error('Please select an image file to upload.');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error('Please select a JPG, PNG, or WEBP image.');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error('Maximum image size is 5 MB.');
    }
  },

  /**
   * Get current authenticated user ID or throw authentication error.
   */
  async getCurrentUserId(): Promise<string> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        throw new Error('Authentication required. Please log in to manage your avatar.');
      }

      return user.id;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Network error encountered while verifying user authentication.');
    }
  },

  /**
   * Uploads or replaces a user avatar image in Supabase Storage under `<user_id>/avatar`.
   * Rollbacks storage upload if database/metadata update fails.
   */
  async uploadAvatar(file: File): Promise<AvatarUploadResult> {
    this.validateAvatarFile(file);
    const userId = await this.getCurrentUserId();
    const filePath = `${userId}/avatar`;

    // 1. Storage Upload
    let uploadData;
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (error) {
        if (error.message?.toLowerCase().includes('permission') || error.message?.toLowerCase().includes('policy')) {
          throw new Error('Permission denied. You can only update your own avatar.');
        }
        throw new Error(error.message || 'Failed to upload image to storage.');
      }

      uploadData = data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Upload failed due to a network or storage error.');
    }

    // 2. Generate Public URL with cache-busting timestamp
    const rawPublicUrl = this.getPublicAvatarUrlForPath(filePath);
    const publicUrlWithCacheBuster = `${rawPublicUrl}?t=${Date.now()}`;

    // 3. Update Database & Auth Metadata with Rollback Guard
    try {
      // Update Auth User Metadata first
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrlWithCacheBuster },
      });

      if (authError) {
        throw new Error(authError.message || 'Failed to update user profile metadata.');
      }

      // Try updating profiles table if it exists
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrlWithCacheBuster, updated_at: new Date().toISOString() })
        .eq('id', userId);

      // If profile update failed with non-missing table error
      if (profileError && !profileError.message?.includes('does not exist')) {
        // Warning log, but auth metadata succeeded
      }
    } catch (dbError: unknown) {
      // ROLLBACK: Delete uploaded file if database/metadata update failed
      try {
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      } catch {
        // Rollback attempt best effort
      }

      const message = dbError instanceof Error ? dbError.message : 'Database update failed.';
      throw new Error(`Failed to update profile: ${message} Upload was rolled back.`);
    }

    return {
      path: uploadData?.path || filePath,
      publicUrl: publicUrlWithCacheBuster,
    };
  },

  /**
   * Updates existing avatar file (alias for uploadAvatar with upsert replacing previous avatar).
   */
  async updateAvatar(file: File): Promise<AvatarUploadResult> {
    return this.uploadAvatar(file);
  },

  /**
   * Gets the public avatar URL for the current logged-in user.
   */
  async getAvatar(): Promise<string | null> {
    const userId = await this.getCurrentUserId();

    // Check auth user metadata first for speed
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }

    // Check profiles table as fallback
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .maybeSingle();

      if (profile?.avatar_url) {
        return profile.avatar_url;
      }
    } catch {
      // Profile query error fallback
    }

    return null;
  },

  /**
   * Synchronously returns the public URL given a file path.
   */
  getPublicAvatarUrlForPath(filePath: string): string {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Returns the public avatar URL for the current user.
   */
  async getPublicAvatarUrl(): Promise<string> {
    const userId = await this.getCurrentUserId();
    const rawUrl = this.getPublicAvatarUrlForPath(`${userId}/avatar`);
    return `${rawUrl}?t=${Date.now()}`;
  },

  /**
   * Removes the user's avatar file from storage and clears profile record & user metadata.
   */
  async removeAvatar(): Promise<void> {
    const userId = await this.getCurrentUserId();
    const filePath = `${userId}/avatar`;

    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

    if (storageError && !storageError.message?.toLowerCase().includes('not found')) {
      throw new Error(storageError.message || 'Failed to remove avatar from storage.');
    }

    // 2. Clear Auth User Metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: { avatar_url: null },
    });

    if (authError) {
      throw new Error(authError.message || 'Failed to clear profile metadata.');
    }

    // 3. Clear profiles table if present
    try {
      await supabase
        .from('profiles')
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq('id', userId);
    } catch {
      // Ignore if profiles table absent
    }
  },
};

