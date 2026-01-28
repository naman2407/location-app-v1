// Utility functions for grid layouts

/**
 * Calculate center alignment classes for the last item in a grid
 * @param index - Current item index
 * @param totalItems - Total number of items
 * @returns CSS classes for centering the last item if needed
 */
export function getCenterAlignmentClasses(index: number, totalItems: number): string {
  const isLastCard = index === totalItems - 1
  if (!isLastCard) return ''

  const lgRemainder = totalItems % 5
  const mdRemainder = totalItems % 4

  let centerClasses = ''
  if (lgRemainder === 1) {
    centerClasses += ' lg:col-start-3'
  }
  if (mdRemainder === 1) {
    centerClasses += ' md:col-start-2'
  }

  return centerClasses
}

