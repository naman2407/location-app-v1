'use client'

interface RatingHistogramProps {
  rating: {
    ratingHistogram: { stars: number; count: number }[]
  }
}

export function RatingHistogram({ rating }: RatingHistogramProps) {
  const max = Math.max(...rating.ratingHistogram.map((r) => r.count), 1)
  return (
    <div className="biz-histogram">
      {rating.ratingHistogram.map((item) => (
        <div key={item.stars} className="biz-histogram-row">
          <span className="biz-histogram-label">{item.stars} stars</span>
          <progress className="biz-histogram-bar" value={item.count} max={max} />
          <span className="biz-histogram-count">{item.count}</span>
        </div>
      ))}
    </div>
  )
}
