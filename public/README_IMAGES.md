# Image Files Guide

Place your images in the following folders:

## Folder Structure

```
public/
├── images/
│   ├── icons/
│   │   ├── logo.svg (Header logo)
│   │   ├── tag.svg (Category tag icon)
│   │   ├── star-full.svg (Full star for ratings)
│   │   ├── star-half.svg (Half star for ratings)
│   │   ├── facebook.svg
│   │   ├── instagram.svg
│   │   ├── twitter.svg
│   │   ├── linkedin.svg
│   │   └── youtube.svg
│   ├── brands/
│   │   ├── starbucks.png
│   │   ├── mcdonalds.svg
│   │   ├── western-union.svg
│   │   ├── freddys.png
│   │   ├── advance-auto.png
│   │   └── lenscrafters.svg
│   ├── categories/
│   │   ├── agriculture.svg
│   │   ├── arts-entertainment.svg
│   │   ├── automotive.svg
│   │   ├── beauty.svg
│   │   ├── business-services.svg
│   │   ├── contractors.svg
│   │   ├── education.svg
│   │   ├── family-community.svg
│   │   ├── financial-services.svg
│   │   ├── food-dining.svg
│   │   ├── government.svg
│   │   ├── health.svg
│   │   ├── home-garden.svg
│   │   ├── insurance.svg
│   │   ├── legal.svg
│   │   ├── moving-transport.svg
│   │   ├── pets.svg
│   │   ├── real-estate.svg
│   │   ├── shopping.svg
│   │   ├── sports-recreation.svg
│   │   ├── technology.svg
│   │   ├── telecoms.svg
│   │   ├── travel.svg
│   │   └── other.svg
│   └── illustrations/
│       ├── hero-background.png
│       ├── verified-bg.svg
│       ├── verified-1.svg
│       ├── verified-2.svg
│       ├── verified-3.svg
│       ├── verified-4.svg
│       ├── verified-5.svg
│       ├── verified-6.svg
│       ├── verified-7.svg
│       └── verified-8.svg
```

## Image Requirements

- **Logo**: 48x48px SVG or PNG
- **Category Icons**: 32x32px SVG recommended
- **Brand Logos**: 75x75px (will be displayed in circular containers)
- **Hero Background**: Full width, recommended 1440px wide
- **Social Icons**: 20x20px SVG recommended
- **Star Icons**: 18x18px SVG
- **Tag Icon**: 20x20px SVG

## Notes

- All images should be optimized for web
- SVG format is recommended for icons and logos
- PNG format works for photos and complex images
- Images will show placeholders if files are missing
- Update the image paths in `app/page.tsx` if you use different filenames

