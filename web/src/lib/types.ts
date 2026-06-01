export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  city: string | null;
  dni: string | null;
  address: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  is_verified_resident: boolean;
  points: number;
  level: 'bronze' | 'silver' | 'gold';
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  images: string[] | null;
  category: string | null;
  schedule: string | null;
  city: string;
  is_active: boolean;
  is_founder: boolean;
  created_at: string;
}

export interface Promotion {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  discount_text: string | null;
  image_url: string | null;
  is_flash: boolean;
  flash_duration_minutes: number | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  moderation_status: 'pending' | 'approved' | 'rejected';
  moderated_by: string | null;
  moderated_at: string | null;
  created_at: string;
  businesses?: { name: string; category?: string; logo_url?: string };
}

export interface Banner {
  id: string;
  title: string | null;
  image_url: string;
  link_type: string;
  link_id: string | null;
  link_url: string | null;
  is_active: boolean;
  display_order: number;
  valid_from: string | null;
  valid_until: string | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  user_id: string;
  promotion_id: string;
  business_id: string;
  token: string;
  expires_at: string;
  status: 'active' | 'redeemed' | 'expired';
  redeemed_at: string | null;
  redeemed_by: string | null;
  created_at: string;
  promotions?: Promotion;
  businesses?: Business;
}

export interface Favorite {
  id: string;
  user_id: string;
  promotion_id: string;
  created_at: string;
  promotions?: Promotion;
}

export interface Reward {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  points_cost: number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  businesses?: { name: string };
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  points_spent: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  rewards?: Reward;
}

export interface PointsHistory {
  id: string;
  user_id: string;
  points_change: number;
  reason: string;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface PointsRule {
  id: string;
  rule_name: string;
  points_per_amount: number;
  amount_threshold: number;
  points_expiry_days: number;
  is_active: boolean;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  entity_type: string | null;
  entity_id: string | null;
  user_id: string | null;
  metadata: Record<string, unknown> | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}
