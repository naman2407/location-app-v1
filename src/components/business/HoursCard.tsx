'use client'

interface HoursCardProps {
  hours: { openNowText: string; rows: { day: string; range: string }[] }
  statusText: string
  closesAt: string
}

export function HoursCard({ hours, statusText, closesAt }: HoursCardProps) {
  const isOpen = statusText.toLowerCase().includes('open')
  
  // Extract time from openNowText if available, otherwise use closesAt
  let timeText = ''
  if (hours.openNowText) {
    if (isOpen && hours.openNowText.includes('Closes at')) {
      const match = hours.openNowText.match(/Closes at (.+)/)
      timeText = match ? match[1] : closesAt
    } else if (!isOpen && hours.openNowText.includes('Opens at')) {
      const match = hours.openNowText.match(/Opens at (.+)/)
      timeText = match ? match[1] : (hours.rows[0]?.range.split(' – ')[0] || closesAt)
    } else {
      timeText = closesAt
    }
  } else {
    timeText = closesAt
  }
  
  return (
    <div className="biz-hours">
      <h3 className="heading heading-sub">Hours</h3>
      {statusText && (
        <div className="biz-hours-status-row">
          <span className={`biz-hours-status ${isOpen ? 'open' : 'closed'}`}>
            {statusText}
          </span>
          <span className="biz-hours-status-dot" />
          <span className="biz-hours-status-time">
            {isOpen ? `Closes at ${timeText}` : `Opens at ${timeText}`}
          </span>
        </div>
      )}
      <div className="HoursTable biz-hours-table">
        {hours.rows.map((row) => (
          <div key={row.day} className="HoursTable-row">
            <span className="HoursTable-day">{row.day}</span>
            <div className="HoursTable-intervals">
              <span>{row.range}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
