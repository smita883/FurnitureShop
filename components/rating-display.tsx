import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  reviewCount: number;
  showText?: boolean;
}

export function RatingDisplay({ rating, reviewCount, showText = true }: RatingDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={
              star <= Math.round(rating)
                ? 'fill-accent text-accent'
                : star - rating <= 1
                ? 'fill-accent/50 text-accent/50'
                : 'fill-muted text-muted'
            }
          />
        ))}
      </div>
      {showText && (
        <div className="flex items-center gap-1 text-sm">
          <span className="font-semibold text-foreground">{rating}</span>
          <span className="text-muted-foreground">({reviewCount} reviews)</span>
        </div>
      )}
    </div>
  );
}
