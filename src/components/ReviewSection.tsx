import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Card3D from './Card3D';

interface ReviewSectionProps {
  listingId: string;
}

export default function ReviewSection({ listingId }: ReviewSectionProps) {
  const { user } = useAuth();
  const { addReview, getListingReviews, getListingAverageRating } = useData();
  const reviews = getListingReviews(listingId);
  const averageRating = getListingAverageRating(listingId);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addReview({
      listingId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      rating,
      comment,
    });

    setShowForm(false);
    setComment('');
    setRating(5);
  };

  const getRatingDistribution = () => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      dist[r.rating - 1]++;
    });
    return dist.reverse();
  };

  const distribution = getRatingDistribution();

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          Reviews ({reviews.length})
        </h3>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all text-sm"
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {/* Rating summary */}
      {reviews.length > 0 && (
        <Card3D>
          <div className="p-6 flex flex-col md:flex-row gap-6">
            <div className="text-center md:border-r md:border-white/10 md:pr-6">
              <p className="text-5xl font-black text-white">{averageRating.toFixed(1)}</p>
              <div className="flex justify-center my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              <p className="text-gray-400 text-sm">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars, i) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 w-8">{stars}★</span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: reviews.length > 0 ? `${(distribution[i] / reviews.length) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{distribution[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </Card3D>
      )}

      {/* Review form */}
      {showForm && user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card3D glowColor="rgba(245, 158, 11, 0.15)">
            <form onSubmit={handleSubmit} className="p-6">
              <h4 className="text-white font-bold mb-4">Share Your Experience</h4>

              {/* Star rating */}
              <div className="mb-4">
                <label className="text-sm text-gray-400 mb-2 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 transition-all ${
                          star <= (hoveredStar || rating)
                            ? 'text-amber-400 fill-amber-400 scale-110'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="text-sm text-gray-400 mb-1 block">Your Review</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-[1.02] transition-all"
              >
                Submit Review
              </button>
            </form>
          </Card3D>
        </motion.div>
      )}

      {/* Review list */}
      <div className="mt-6 space-y-4">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card3D>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-white font-bold">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{review.userName}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                    <ThumbsUp className="w-3 h-3" /> Helpful
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                    <Flag className="w-3 h-3" /> Report
                  </button>
                </div>
              </div>
            </Card3D>
          </motion.div>
        ))}

        {reviews.length === 0 && !showForm && (
          <div className="py-12 text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-400">No reviews yet. Be the first to share your experience!</p>
            {!user && (
              <p className="text-amber-400 text-sm mt-2">
                <a href="/login" className="hover:underline">Sign in</a> to write a review
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
