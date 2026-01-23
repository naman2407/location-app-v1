# Location App - Business Directory

A modern, responsive business directory application built with Next.js, React, and Tailwind CSS. This application displays business categories, top brands, and verified business information.

## Features

- 🏢 **Business Categories**: Browse 24+ business categories
- 🌟 **Top Brands**: Explore locations of world's top brands
- ✅ **Verified Information**: Trusted business data from verified sources
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- 🎨 **Modern UI**: Clean and professional design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
location-app/
├── app/
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Main page component
│   └── globals.css     # Global styles and Tailwind imports
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── next.config.js      # Next.js configuration
```

## Responsive Design

The application is fully responsive with breakpoints for:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Customization

### Adding Real Images

Replace the emoji placeholders in `app/page.tsx` with actual image URLs or local images:

1. Add images to the `public/` directory
2. Update the image references in the component

### Styling

The application uses Tailwind CSS. Customize colors and styles in:
- `tailwind.config.js` - Theme configuration
- `app/globals.css` - Global styles

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

## License

© 2025 TX3Y Inc. All Rights Reserved.


