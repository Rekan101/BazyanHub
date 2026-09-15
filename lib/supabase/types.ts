// lib/supabase/types.ts

/*
|--------------------------------------------------------------------------
| Database types
|--------------------------------------------------------------------------
|
| Hand-written to match supabase-schema.sql. Keep the two in sync: if you add
| a column there, add it here, or the typed client will silently narrow it
| away at the call site.
|
| These can be regenerated instead, once a project exists:
|   npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
|
*/

export type StoryDuration = "daily" | "weekly" | "monthly";

export type AuthMethod =
  | "email"
  | "username"
  | "facebook"
  | "phone";

export type ProfileRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  auth_method: AuthMethod | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  id: string;
  slug: string;
  name_ckb: string;
  name_ar: string | null;
  name_en: string | null;
  description_ckb: string | null;
  description_ar: string | null;
  description_en: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
  is_popular: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type FilterRow = {
  id: string;
  category_id: string | null;
  slug: string;
  label_ckb: string;
  label_ar: string | null;
  label_en: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type ProviderHoursRow = {
  id: string;
  provider_id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
};

export type ProviderRow = {
  id: string;
  slug: string | null;
  category_id: string;
  filter_id: string | null;
  name: string;
  description: string | null;
  subcategory: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  phone: string | null;
  secondary_phone: string | null;
  email: string | null;
  website: string | null;
  rating: number;
  review_count: number;
  price_range: "$" | "$$" | "$$$" | "$$$$" | null;
  is_verified: boolean;
  is_featured: boolean;
  is_special: boolean;
  is_active: boolean;
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  socials: Record<string, unknown> | null;
  tags: string[] | null;
  services: string[] | null;
  owner_id: string | null;
  owner_name: string | null;
  created_at: string;
  updated_at: string;
};

/*
 * A provider joined with its related rows. Supabase returns embedded
 * resources as nested arrays/objects when selected with the
 * `categories(...)` / `provider_hours(...)` syntax.
 */
export type ProviderRowWithRelations = ProviderRow & {
  categories?: Pick<CategoryRow, "slug" | "name_ckb" | "name_ar" | "name_en"> | null;
  provider_hours?: ProviderHoursRow[] | null;
};

export type StorySlideRow = {
  id: string;
  title_ckb: string;
  title_ar: string | null;
  title_en: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
};

export type StoryRow = {
  id: string;
  slide_id: string;
  provider_id: string | null;
  image_url: string;
  provider_name: string | null;
  short_info: string | null;
  duration: StoryDuration;
  published_at: string;
  expires_at: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
};

export type StorySlideRowWithStories = StorySlideRow & {
  stories?: (StoryRow & {
    providers?: Pick<ProviderRow, "slug" | "name" | "category_id"> | null;
  })[] | null;
};

export type NotificationRow = {
  id: string;
  user_id: string | null;
  title_ckb: string;
  title_ar: string | null;
  title_en: string | null;
  body_ckb: string | null;
  body_ar: string | null;
  body_en: string | null;
  icon: string | null;
  link_url: string | null;
  is_read: boolean;
  created_at: string;
};

export type NewsPostStatus =
  | "pending"
  | "approved"
  | "rejected";

export type NewsPostRow = {
  id: string;
  user_id: string | null;
  author_name: string | null;
  text_content: string | null;
  media_url: string | null;
  media_type: "image" | "video" | null;
  status: NewsPostStatus;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
};

/*
 * Strictly these five — mirrors the news_reaction_type enum. Adding a sixth
 * means updating REACTIONS in lib/data/news.ts too, or the UI renders a
 * reaction it has no emoji or label for.
 */
export type NewsReactionType =
  | "like"
  | "love"
  | "haha"
  | "sad"
  | "angry";

/*
 * The public.news_feed view: news_posts plus reaction aggregates.
 *
 * There is no comment_count — comments were removed from the product.
 * `top_reaction_types` is the DISTINCT set of reactions the post received,
 * ordered most-used first, for the overlapping icon cluster.
 */
export type NewsFeedRow = NewsPostRow & {
  total_reactions: number;
  top_reaction_types: NewsReactionType[] | null;
};

export type NewsReactionRow = {
  post_id: string;
  user_id: string;
  reaction_type: NewsReactionType;
  created_at: string;
  updated_at: string;
};

/*
 * Minimal Database shape for the generic parameter on createClient. Only the
 * Row types are filled in, since this repo reads far more than it writes.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: Partial<CategoryRow> & { slug: string; name_ckb: string };
        Update: Partial<CategoryRow>;
        Relationships: [];
      };
      filters: {
        Row: FilterRow;
        Insert: Partial<FilterRow> & { slug: string; label_ckb: string };
        Update: Partial<FilterRow>;
        Relationships: [
          {
            foreignKeyName: "filters_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      providers: {
        Row: ProviderRow;
        Insert: Partial<ProviderRow> & { category_id: string; name: string };
        Update: Partial<ProviderRow>;
        Relationships: [
          {
            foreignKeyName: "providers_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "providers_filter_id_fkey";
            columns: ["filter_id"];
            referencedRelation: "filters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "providers_owner_id_fkey";
            columns: ["owner_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      provider_hours: {
        Row: ProviderHoursRow;
        Insert: Partial<ProviderHoursRow> & {
          provider_id: string;
          day_of_week: number;
        };
        Update: Partial<ProviderHoursRow>;
        Relationships: [
          {
            foreignKeyName: "provider_hours_provider_id_fkey";
            columns: ["provider_id"];
            referencedRelation: "providers";
            referencedColumns: ["id"];
          },
        ];
      };
      story_slides: {
        Row: StorySlideRow;
        Insert: Partial<StorySlideRow> & { title_ckb: string };
        Update: Partial<StorySlideRow>;
        Relationships: [];
      };
      stories: {
        Row: StoryRow;
        Insert: Partial<StoryRow> & { slide_id: string; image_url: string };
        Update: Partial<StoryRow>;
        Relationships: [
          {
            foreignKeyName: "stories_slide_id_fkey";
            columns: ["slide_id"];
            referencedRelation: "story_slides";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stories_provider_id_fkey";
            columns: ["provider_id"];
            referencedRelation: "providers";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: NotificationRow;
        Insert: Partial<NotificationRow> & { title_ckb: string };
        Update: Partial<NotificationRow>;
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      news_posts: {
        Row: NewsPostRow;
        Insert: Partial<NewsPostRow>;
        Update: Partial<NewsPostRow>;
        Relationships: [
          {
            foreignKeyName: "news_posts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      news_reactions: {
        Row: NewsReactionRow;
        Insert: {
          post_id: string;
          user_id: string;
          reaction_type: NewsReactionType;
        };
        Update: Partial<NewsReactionRow>;
        Relationships: [
          {
            foreignKeyName: "news_reactions_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "news_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "news_reactions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    /*
     * Views need a Relationships key just like tables do — postgrest-js's
     * GenericView requires it. Omitting it makes the whole `public` schema
     * fail the GenericSchema constraint, at which point every table and
     * column silently resolves to `never` and inserts stop type-checking.
     */
    Views: {
      news_feed: {
        Row: NewsFeedRow;
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      story_duration: StoryDuration;
      auth_method: AuthMethod;
      news_post_status: NewsPostStatus;
      news_reaction_type: NewsReactionType;
    };
    CompositeTypes: Record<string, never>;
  };
};
