import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUser, updateUser } from "../services/userService";
import type { UserProfile as UserProfileType } from "../services/userService";
import * as reviewService from "../services/reviewService";
import * as gameService from "../services/gameService";
import type { Review, ReviewAPI } from "../types/Review";
import ReviewCard from "../components/gamePage/ReviewCard";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    userBio: "",
    avatarURL: "",
    phoneNumber: "",
  });
  const [saving, setSaving] = useState(false);

  const isOwnProfile =
    isAuthenticated && currentUser?.userId === parseInt(userId || "0", 10);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const userProfile = await getUser(parseInt(userId, 10));
      setProfile(userProfile);
      setEditForm({
        username: userProfile.username,
        userBio: userProfile.userBio || "",
        avatarURL: userProfile.avatarURL,
        phoneNumber: userProfile.phoneNumber || "",
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchReviews = useCallback(async () => {
    if (!userId) return;

    try {
      const apiReviews = await reviewService.getReviewsByUser(
        parseInt(userId, 10)
      );

      // Enrich reviews with game names
      const enrichedReviews: Review[] = await Promise.all(
        apiReviews.map(async (apiReview: ReviewAPI, index: number) => {
          let gameName = `Game #${apiReview.gameId}`;

          try {
            const game = await gameService.getGameById(
              apiReview.gameId.toString()
            );
            gameName = game.title;
          } catch (err) {
            console.error(
              `Failed to fetch game info for game ${apiReview.gameId}:`,
              err
            );
          }

          return {
            // Use reviewId if available, otherwise generate a unique key
            reviewId: apiReview.reviewId ?? (apiReview.userId * 1000000 + apiReview.gameId * 1000 + index),
            gameId: apiReview.gameId,
            userId: apiReview.userId,
            username: profile?.username || `User #${apiReview.userId}`,
            userAvatar:
              profile?.avatarURL ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            rating: apiReview.reviewScore,
            content: apiReview.review,
            gameName,
          };
        })
      );

      setReviews(enrichedReviews);
    } catch (err) {
      console.error("Error fetching user reviews:", err);
    }
  }, [userId, profile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      fetchReviews();
    }
  }, [profile, fetchReviews]);

  const handleSaveProfile = async () => {
    if (!userId || !isOwnProfile) return;

    try {
      setSaving(true);
      await updateUser(parseInt(userId, 10), {
        username: editForm.username,
        userBio: editForm.userBio || null,
        avatarURL: editForm.avatarURL,
        phoneNumber: editForm.phoneNumber,
      });

      // Refresh profile
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review? This action is permanent and cannot be undone."
    );

    if (confirmDelete) {
      try {
        await reviewService.deleteReview(reviewId);
        await fetchReviews();
      } catch (err) {
        console.error("Error deleting review:", err);
        alert("Failed to delete review. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent animate-spin mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">
            User Not Found
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            {error || "Could not find the requested user."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-[var(--accent-primary)] text-black px-6 py-3 border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="neo-card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {isEditing ? (
                <div className="space-y-2">
                  <img
                    src={
                      editForm.avatarURL ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={profile.username}
                    className="w-32 h-32 border-4 border-[var(--border-color)] object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                  />
                  <input
                    type="text"
                    value={editForm.avatarURL}
                    onChange={(e) =>
                      setEditForm({ ...editForm, avatarURL: e.target.value })
                    }
                    placeholder="Avatar URL"
                    className="w-32 text-sm"
                  />
                </div>
              ) : (
                <img
                  src={
                    profile.avatarURL ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={profile.username}
                  className="w-32 h-32 border-4 border-[var(--border-color)] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                    className="text-3xl font-bold bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] px-3 py-1"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                    {profile.username}
                  </h1>
                )}

                {isOwnProfile && (
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-black border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all disabled:opacity-50"
                        >
                          <FiSave size={18} />
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm({
                              username: profile.username,
                              userBio: profile.userBio || "",
                              avatarURL: profile.avatarURL,
                              phoneNumber: profile.phoneNumber || "",
                            });
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] font-bold hover:bg-[var(--bg-secondary)] transition-all"
                        >
                          <FiX size={18} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] font-bold hover:bg-[var(--accent-primary)] hover:border-black transition-all"
                      >
                        <FiEdit2 size={18} />
                        Edit Profile
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-2">
                  About
                </h3>
                {isEditing ? (
                  <textarea
                    value={editForm.userBio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, userBio: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                    className="w-full min-h-[100px] resize-y"
                    maxLength={500}
                  />
                ) : (
                  <p className="text-[var(--text-primary)]">
                    {profile.userBio || "No bio yet."}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              {isEditing && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-2">
                    Phone Number
                  </h3>
                  <input
                    type="tel"
                    value={editForm.phoneNumber}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phoneNumber: e.target.value })
                    }
                    placeholder="Your phone number"
                    className="w-full bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] px-3 py-2"
                  />
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--accent-primary)]">
                    {reviews.length}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Reviews Section */}
        <section>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            {isOwnProfile ? "My Reviews" : `${profile.username}'s Reviews`}
          </h2>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.reviewId} className="relative">
                  {/* Game name link */}
                  <a
                    href={`/game/${review.gameId}`}
                    className="text-sm font-bold text-[var(--accent-primary)] hover:underline mb-2 block"
                  >
                    {(review as Review & { gameName?: string }).gameName}
                  </a>
                  <ReviewCard
                    review={review}
                    isOwnReview={isOwnProfile}
                    onDelete={() => handleDeleteReview(review.reviewId)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="neo-card p-8 text-center">
              <p className="text-lg text-[var(--text-secondary)]">
                {isOwnProfile
                  ? "You haven't written any reviews yet."
                  : `${profile.username} hasn't written any reviews yet.`}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
