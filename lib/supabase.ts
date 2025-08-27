import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Validationly Database Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'business';
  credits_remaining: number;
  total_validations: number;
  stripe_customer_id?: string;
  subscription_status?: string;
  subscription_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Validation {
  id: string;
  user_id: string;
  idea_text: string;
  demand_score?: number;
  category?: string;
  business_model?: string;
  target_market?: string;
  analysis_result?: any;
  platform_analyses?: any;
  real_world_data?: any;
  insights?: any;
  is_favorite: boolean;
  is_public: boolean;
  validation_type: 'fast' | 'standard' | 'premium';
  processing_time?: number;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  id: string;
  user_id: string;
  event_type: string;
  event_data?: any;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
}

export interface IdeaCollection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Validationly Database Functions
export class ValidationlyDB {
  // User management
  static async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data;
  }

  static async updateUserCredits(userId: string, creditsUsed: number): Promise<boolean> {
    // First get current credits
    const { data: userData } = await supabase
      .from('users')
      .select('credits_remaining, total_validations')
      .eq('id', userId)
      .single();
    
    if (!userData) {
      console.error('User not found');
      return false;
    }
    
    const newCredits = Math.max(0, userData.credits_remaining - creditsUsed);
    const newTotalValidations = userData.total_validations + 1;
    
    const { error } = await supabase
      .from('users')
      .update({ 
        credits_remaining: newCredits,
        total_validations: newTotalValidations
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user credits:', error);
      return false;
    }
    return true;
  }

  static async updateUserPlan(
    userId: string, 
    plan: 'free' | 'pro' | 'business', 
    stripeCustomerId?: string,
    subscriptionStatus?: string,
    subscriptionEndDate?: string
  ): Promise<boolean> {
    const updateData: any = { plan };
    
    if (stripeCustomerId) updateData.stripe_customer_id = stripeCustomerId;
    if (subscriptionStatus) updateData.subscription_status = subscriptionStatus;
    if (subscriptionEndDate) updateData.subscription_end_date = subscriptionEndDate;
    
    // Reset credits based on plan
    if (plan === 'pro') updateData.credits_remaining = 100;
    if (plan === 'business') updateData.credits_remaining = 500;

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user plan:', error);
      return false;
    }
    return true;
  }

  // Validation management
  static async saveValidation(validation: Omit<Validation, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    const { data, error } = await supabase
      .from('validations')
      .insert([validation])
      .select('id')
      .single();
    
    if (error) {
      console.error('Error saving validation:', error);
      return null;
    }
    return data.id;
  }

  static async getUserValidations(userId: string, limit = 20): Promise<Validation[]> {
    const { data, error } = await supabase
      .from('validations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching validations:', error);
      return [];
    }
    return data || [];
  }

  static async getValidation(validationId: string): Promise<Validation | null> {
    const { data, error } = await supabase
      .from('validations')
      .select('*')
      .eq('id', validationId)
      .single();
    
    if (error) {
      console.error('Error fetching validation:', error);
      return null;
    }
    return data;
  }

  static async updateValidationFavorite(validationId: string, isFavorite: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('validations')
      .update({ is_favorite: isFavorite })
      .eq('id', validationId);
    
    if (error) {
      console.error('Error updating validation favorite:', error);
      return false;
    }
    return true;
  }

  static async getPublicValidations(limit = 50): Promise<Validation[]> {
    const { data, error } = await supabase
      .from('validations')
      .select('*')
      .eq('is_public', true)
      .order('demand_score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching public validations:', error);
      return [];
    }
    return data || [];
  }

  // Analytics
  static async trackEvent(
    userId: string, 
    eventType: string, 
    eventData?: any,
    sessionId?: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('analytics')
      .insert([{
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
        session_id: sessionId
      }]);
    
    if (error) {
      console.error('Error tracking event:', error);
      return false;
    }
    return true;
  }

  static async getUserStats(userId: string): Promise<{
    totalValidations: number;
    avgScore: number;
    favoriteCategory: string;
    creditsRemaining: number;
  }> {
    // Get user info
    const user = await this.getUser(userId);
    
    // Get validation stats
    const { data: validations } = await supabase
      .from('validations')
      .select('demand_score, category')
      .eq('user_id', userId);

    const totalValidations = validations?.length || 0;
    const avgScore = validations?.length ? 
      validations.reduce((sum, v) => sum + (v.demand_score || 0), 0) / validations.length : 0;

    // Find favorite category
    const categoryCount: Record<string, number> = {};
    validations?.forEach(v => {
      if (v.category) {
        categoryCount[v.category] = (categoryCount[v.category] || 0) + 1;
      }
    });

    const favoriteCategory = Object.keys(categoryCount).length > 0 ? 
      Object.keys(categoryCount).reduce((a, b) => 
        categoryCount[a] > categoryCount[b] ? a : b, 'Technology'
      ) : 'Technology';

    return {
      totalValidations,
      avgScore: Math.round(avgScore),
      favoriteCategory,
      creditsRemaining: user?.credits_remaining || 0
    };
  }

  // Collections
  static async createCollection(
    userId: string, 
    name: string, 
    description?: string
  ): Promise<string | null> {
    const { data, error } = await supabase
      .from('idea_collections')
      .insert([{
        user_id: userId,
        name,
        description,
        is_public: false
      }])
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating collection:', error);
      return null;
    }
    return data.id;
  }

  static async getUserCollections(userId: string): Promise<IdeaCollection[]> {
    const { data, error } = await supabase
      .from('idea_collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching collections:', error);
      return [];
    }
    return data || [];
  }

  static async addValidationToCollection(
    collectionId: string, 
    validationId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('collection_validations')
      .insert([{
        collection_id: collectionId,
        validation_id: validationId
      }]);
    
    if (error) {
      console.error('Error adding validation to collection:', error);
      return false;
    }
    return true;
  }
}