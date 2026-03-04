'use client';

import { useEffect, useState } from 'react';
import { Review, Product } from '@/lib/db';
import { RatingDisplay } from './rating-display';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface ReviewsSectionProps {
  product: Product;
  onReviewAdded?: () => void;
}

export function ReviewsSection({ product, onReviewAdded }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    userName: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${product.id}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userName || !formData.comment) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userId: 'user-' + Date.now(),
          userName: formData.userName,
          rating: formData.rating,
          comment: formData.comment,
        }),
      });

      if (response.ok) {
        setFormData({ rating: 5, comment: '', userName: '' });
        setShowForm(false);
        await fetchReviews();
        onReviewAdded?.();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
  }));

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <RatingDisplay rating={product.rating} reviewCount={product.reviewCount} showText={false} />
          <p className="text-3xl font-bold text-foreground mt-2">{product.rating}</p>
          <p className="text-sm text-muted-foreground mt-1">out of 5</p>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-8">{rating}★</span>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-accent h-full"
                    style={{
                      width: product.reviewCount > 0 ? `${(count / product.reviewCount) * 100}%` : '0%',
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      <div className="flex justify-between items-center border-t border-border pt-8">
        <h3 className="font-serif text-xl font-bold text-foreground">
          Reviews ({reviews.length})
        </h3>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90"
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                className="w-full px-4 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating }))}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={
                        rating <= formData.rating
                          ? 'fill-accent text-accent'
                          : 'fill-muted text-muted'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Your Review
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-4 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
                placeholder="Share your experience with this product..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
              >
                Submit Review
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">{review.userName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= review.rating
                              ? 'fill-accent text-accent'
                              : 'fill-muted text-muted'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-foreground mt-3">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
