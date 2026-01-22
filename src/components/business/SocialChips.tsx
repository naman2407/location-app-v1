'use client'

import { SafeImage } from '../../../app/components/SafeImage'
import { IMAGES } from '../../../app/constants/images'

interface SocialChipsProps {
  links: { label: string; href: string }[]
}

const iconByLabel: Record<string, JSX.Element> = {
  Google: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M15.8444 6.43317H15.2V6.39997H8.00001V9.59995H12.5212C11.8616 11.4627 10.0892 12.7999 8.00001 12.7999C5.34922 12.7999 3.20003 10.6507 3.20003 7.99996C3.20003 5.34917 5.34922 3.19998 8.00001 3.19998C9.2236 3.19998 10.3368 3.66158 11.1844 4.41558L13.4472 2.15279C12.0184 0.821196 10.1072 0 8.00001 0C3.58203 0 4.57764e-05 3.58198 4.57764e-05 7.99996C4.57764e-05 12.4179 3.58203 15.9999 8.00001 15.9999C12.418 15.9999 16 12.4179 16 7.99996C16 7.46356 15.9448 6.93997 15.8444 6.43317Z" fill="#FFC107"/>
      <path d="M0.922302 4.27638L3.55069 6.20397C4.26189 4.44318 5.98428 3.19998 7.99987 3.19998C9.22346 3.19998 10.3367 3.66158 11.1843 4.41558L13.447 2.15279C12.0182 0.821196 10.1071 0 7.99987 0C4.92708 0 2.2623 1.73479 0.922302 4.27638Z" fill="#FF3D00"/>
      <path d="M8.00009 15.9999C10.0665 15.9999 11.9441 15.2092 13.3637 13.9232L10.8877 11.828C10.0575 12.4593 9.04307 12.8008 8.00009 12.8C5.9193 12.8 4.15251 11.4732 3.48691 9.62158L0.878128 11.6316C2.20212 14.2224 4.89091 15.9999 8.00009 15.9999Z" fill="#4CAF50"/>
      <path d="M15.8444 6.4331H15.2V6.3999H8.00005V9.59989H12.5212C12.2057 10.4864 11.6374 11.2611 10.8864 11.8283L10.8876 11.8275L13.3636 13.9227C13.1884 14.0819 16 11.9999 16 7.99989C16 7.4635 15.9448 6.9399 15.8444 6.4331Z" fill="#1976D2"/>
    </svg>
  ),
  Facebook: <SafeImage alt="" src={IMAGES.facebook} className="biz-social-icon" />,
  Instagram: <SafeImage alt="" src={IMAGES.instagram} className="biz-social-icon" />,
  Twitter: <SafeImage alt="" src={IMAGES.twitter} className="biz-social-icon" />,
  LinkedIn: <SafeImage alt="" src={IMAGES.linkedin} className="biz-social-icon" />,
  YouTube: <SafeImage alt="" src={IMAGES.youtube} className="biz-social-icon" />,
}

export function SocialChips({ links }: SocialChipsProps) {
  return (
    <div className="biz-social-row">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-social"
        >
          {iconByLabel[link.label] ?? <span className="biz-social-fallback">{link.label.slice(0, 1)}</span>}
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  )
}
