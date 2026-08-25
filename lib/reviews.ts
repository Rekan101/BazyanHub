import { supabase } from "@/lib/supabase";

export type ProviderReview = {
  id: string;
  provider_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

export type CreateReviewInput = {
  providerId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
};

export type UpdateReviewInput = {
  rating?: number;
  title?: string | null;
  comment?: string | null;
};

export async function getProviderReviews(
  providerId: string
): Promise<ProviderReview[]> {
  const { data, error } = await supabase
    .from("provider_reviews")
    .select(
      `
        id,
        provider_id,
        user_id,
        rating,
        title,
        comment,
        status,
        created_at,
        updated_at
      `
    )
    .eq("provider_id", providerId)
    .eq("status", "approved")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load provider reviews:",
      error
    );

    throw new Error(
      "Failed to load provider reviews."
    );
  }

  return (data ?? []) as ProviderReview[];
}

export async function createReview(
  input: CreateReviewInput
): Promise<ProviderReview> {
  if (
    !Number.isInteger(input.rating) ||
    input.rating < 1 ||
    input.rating > 5
  ) {
    throw new Error(
      "Rating must be an integer between 1 and 5."
    );
  }

  const { data, error } = await supabase
    .from("provider_reviews")
    .insert({
      provider_id: input.providerId,
      user_id: input.userId,
      rating: input.rating,
      title: input.title?.trim() || null,
      comment: input.comment?.trim() || null,
      status: "pending",
    })
    .select(
      `
        id,
        provider_id,
        user_id,
        rating,
        title,
        comment,
        status,
        created_at,
        updated_at
      `
    )
    .single();

  if (error) {
    console.error(
      "Failed to create review:",
      error
    );

    throw new Error(
      "Failed to create review."
    );
  }

  return data as ProviderReview;
}

export async function updateReview(
  reviewId: string,
  input: UpdateReviewInput
): Promise<ProviderReview> {
  if (
    input.rating !== undefined &&
    (!Number.isInteger(input.rating) ||
      input.rating < 1 ||
      input.rating > 5)
  ) {
    throw new Error(
      "Rating must be an integer between 1 and 5."
    );
  }

  const updateData: {
    rating?: number;
    title?: string | null;
    comment?: string | null;
  } = {};

  if (input.rating !== undefined) {
    updateData.rating = input.rating;
  }

  if (input.title !== undefined) {
    updateData.title =
      input.title?.trim() || null;
  }

  if (input.comment !== undefined) {
    updateData.comment =
      input.comment?.trim() || null;
  }

  const { data, error } = await supabase
    .from("provider_reviews")
    .update(updateData)
    .eq("id", reviewId)
    .select(
      `
        id,
        provider_id,
        user_id,
        rating,
        title,
        comment,
        status,
        created_at,
        updated_at
      `
    )
    .single();

  if (error) {
    console.error(
      "Failed to update review:",
      error
    );

    throw new Error(
      "Failed to update review."
    );
  }

  return data as ProviderReview;
}

export async function deleteReview(
  reviewId: string
): Promise<void> {
  const { error } = await supabase
    .from("provider_reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    console.error(
      "Failed to delete review:",
      error
    );

    throw new Error(
      "Failed to delete review."
    );
  }
}

export async function getProviderRatingSummary(
  providerId: string
): Promise<{
  averageRating: number;
  reviewCount: number;
}> {
  const reviews =
    await getProviderReviews(providerId);

  const reviewCount = reviews.length;

  if (reviewCount === 0) {
    return {
      averageRating: 0,
      reviewCount: 0,
    };
  }

  const totalRating = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  return {
    averageRating:
      Math.round(
        (totalRating / reviewCount) * 10
      ) / 10,
    reviewCount,
  };
}