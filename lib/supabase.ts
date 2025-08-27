import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface User {
  id: string;
  email: string;
  plan: 'free' | 'pro';
  stripe_customer_id?: string;
  subscription_status?: string;
  created_at: string;
  updated_at: string;
}

export interface CVRewrite {
  id: string;
  user_id: string;
  job_title?: string;
  company_name?: string;
  industry?: string;
  tone: string;
  tokens_used: number;
  success_rating?: number;
  created_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  job_url?: string;
  company_name: string;
  position: string;
  application_date: string;
  status: 'applied' | 'interview' | 'rejected' | 'offer' | 'accepted';
  cv_version_used?: string;
  notes?: string;
}

// Database functions
export class Database {
  // User management
  static async createUser(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, plan: 'free' }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
    return data;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data;
  }

  static async updateUserPlan(userId: string, plan: 'free' | 'pro', stripeCustomerId?: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ 
        plan, 
        stripe_customer_id: stripeCustomerId,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user plan:', error);
      return false;
    }
    return true;
  }

  // Usage tracking
  static async recordCVRewrite(rewrite: Omit<CVRewrite, 'id' | 'created_at'>): Promise<boolean> {
    const { error } = await supabase
      .from('cv_rewrites')
      .insert([rewrite]);
    
    if (error) {
      console.error('Error recording CV rewrite:', error);
      return false;
    }
    return true;
  }

  static async getDailyUsage(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('cv_rewrites')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);
    
    if (error) {
      console.error('Error fetching daily usage:', error);
      return 0;
    }
    return data?.length || 0;
  }

  static async getUserStats(userId: string): Promise<{
    totalRewrites: number;
    dailyUsage: number;
    favoriteIndustry: string;
    successRate: number;
  }> {
    // Total rewrites
    const { data: totalData } = await supabase
      .from('cv_rewrites')
      .select('id')
      .eq('user_id', userId);

    // Daily usage
    const dailyUsage = await this.getDailyUsage(userId);

    // Favorite industry
    const { data: industryData } = await supabase
      .from('cv_rewrites')
      .select('industry')
      .eq('user_id', userId)
      .not('industry', 'is', null);

    const industryCount: Record<string, number> = {};
    industryData?.forEach(item => {
      if (item.industry) {
        industryCount[item.industry] = (industryCount[item.industry] || 0) + 1;
      }
    });

    const favoriteIndustry = Object.keys(industryCount).reduce((a, b) => 
      industryCount[a] > industryCount[b] ? a : b, 'Technology'
    );

    // Success rate (based on ratings)
    const { data: ratingData } = await supabase
      .from('cv_rewrites')
      .select('success_rating')
      .eq('user_id', userId)
      .not('success_rating', 'is', null);

    const avgRating = ratingData?.length ? 
      ratingData.reduce((sum, item) => sum + (item.success_rating || 0), 0) / ratingData.length : 0;

    return {
      totalRewrites: totalData?.length || 0,
      dailyUsage,
      favoriteIndustry,
      successRate: Math.round(avgRating * 20) // Convert 1-5 rating to percentage
    };
  }

  // Job applications tracking
  static async addJobApplication(application: Omit<JobApplication, 'id'>): Promise<boolean> {
    const { error } = await supabase
      .from('job_applications')
      .insert([application]);
    
    if (error) {
      console.error('Error adding job application:', error);
      return false;
    }
    return true;
  }

  static async getUserApplications(userId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
      .order('application_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
    return data || [];
  }

  static async updateApplicationStatus(
    applicationId: string, 
    status: JobApplication['status']
  ): Promise<boolean> {
    const { error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId);
    
    if (error) {
      console.error('Error updating application status:', error);
      return false;
    }
    return true;
  }
}