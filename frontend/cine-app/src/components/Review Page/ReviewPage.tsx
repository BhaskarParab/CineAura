import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import type { Review } from "../../types/MovieDetail";

interface ReviewPageProps {
  movieId: number;
  mediaType: string;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

const ReviewPage = ({ movieId, mediaType, setReviews }: ReviewPageProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState({
    content: "",
    rating: 0,
    tmdbId: movieId,
    mediaType: mediaType,
  });

  // keep tmdbId in sync
  useEffect(() => {
    setReviewData((prev) => ({
      ...prev,
      tmdbId: movieId,
      mediaType: mediaType,
    }));
  }, [movieId, mediaType]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate("/log-in", {
        state: { from: location },
      });
      return;
    }

    try {
      const res = await fetch("https://cineaura-production.up.railway.app/api/reviews/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Review added!");

      setReviews((prev) => [data, ...prev]);
      
      setReviewData({
        content: "",
        rating: 0,
        tmdbId: movieId,
        mediaType: mediaType,
      });
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log("Something went wrong");
      }
    }
  };

  return (
    <div className="flex items-center justify-center px-0 py-10 bg-bg-primary text-text-primary">
      <div className="w-full max-w-7xl bg-bg-secondary border border-border rounded-2xl shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Add Your Review</h1>

        {/* Rating */}
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <button
              key={star}
              onClick={() => setReviewData({ ...reviewData, rating: star })}
              className={`text-xl ${
                star <= reviewData.rating ? "text-text-amber" : "text-muted"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Content */}
        <textarea
          rows={4}
          placeholder="Write your review..."
          value={reviewData.content}
          onChange={(e) =>
            setReviewData({
              ...reviewData,
              content: e.target.value,
            })
          }
          className="w-full px-4 py-3 rounded-lg bg-card border border-border resize-none focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition cursor-pointer"
        >
          Submit Review
        </button>

        {/* Preview */}
        {(reviewData.content || reviewData.rating > 0) && (
          <div className="mt-6 p-4 border border-border rounded-lg bg-card">
            <div className="flex items-center">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-accent flex items-center justify-center mr-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    // alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover block"
                  />
                ) : (
                  <span className="text-white font-bold">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              {/* Username */}
              <h3 className="font-semibold text-text-primary">
                {user?.username || "You"}
              </h3>

              {/* Rating */}
              {reviewData.rating > 0 && (
                <div className="flex items-center ml-auto bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                  <span className="text-yellow-600 dark:text-yellow-400 mr-1">
                    ★
                  </span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                    {reviewData.rating}/10
                  </span>
                </div>
              )}
            </div>

            <p className="mt-3 text-text-secondary">{reviewData.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
