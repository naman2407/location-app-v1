'use client'

interface Review {
  author: string
  rating: number
  date: string
  text: string
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.author
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="biz-review-card">
      <div className="biz-review-header">
        <div className="biz-review-avatar">{initials}</div>
        <div className="biz-review-author">{review.author}</div>
        <div className="biz-review-date">{review.date}</div>
      </div>
      <div className="biz-review-rating">
        <span>{review.rating.toFixed(1)}</span>
        <div className="biz-review-stars">
          {Array.from({ length: 5 }).map((_, idx) => (
            <svg
              key={`${review.author}-star-${idx}`}
              className="biz-review-star"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M12 18.9847L19.416 23.5L17.448 14.99L24 9.26421L15.372 8.52579L12 0.5L8.628 8.52579L0 9.26421L6.552 14.99L4.584 23.5L12 18.9847Z" fill="#FFC107"/>
            </svg>
          ))}
        </div>
      </div>
      <div className="biz-review-text">{review.text}</div>
    </div>
  )
}
