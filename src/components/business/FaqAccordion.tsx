'use client'

import { useMemo, useState } from 'react'

interface FAQ {
  question: string
  answer: string
}

interface FaqAccordionProps {
  faqs: FAQ[]
  businessName: string
}

export function FaqAccordion({ faqs, businessName }: FaqAccordionProps) {
  const [showAll, setShowAll] = useState(false)

  const maxVisible = 2
  const visibleFaqs = useMemo(
    () => (showAll ? faqs : faqs.slice(0, maxVisible)),
    [faqs, showAll]
  )
  const remainingCount = Math.max(faqs.length - maxVisible, 0)

  return (
    <div className="biz-faq">
      <h2 className="heading heading-sub">Frequently Asked Questions About {businessName}</h2>
      <div className="biz-faq-list">
        {visibleFaqs.map((faq, idx) => (
          <div key={`${faq.question}-${idx}`} className="biz-faq-item">
            <h3 className="biz-faq-question">{faq.question}</h3>
            <div className="biz-faq-answer">{faq.answer}</div>
          </div>
        ))}
      </div>
      {faqs.length > maxVisible && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="button button-secondary button-small"
          aria-expanded={showAll}
        >
          {showAll ? 'Show fewer' : `Show ${remainingCount} more`}
        </button>
      )}
    </div>
  )
}
