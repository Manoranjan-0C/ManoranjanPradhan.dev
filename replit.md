# Portfolio Website - Replit Documentation

## Overview

This is a personal tech portfolio website for Manoranjan Pradhan, an aspiring software developer. The portfolio features a unique book-style navigation system with multiple pages including Welcome, About Me, Skills, Projects, and Connect sections. The website uses modern web technologies with a dark theme and smooth animations.

## System Architecture

### Frontend Architecture
- **Pure Client-Side Application**: Built using vanilla HTML, CSS, and JavaScript without any frameworks
- **Single Page Application (SPA)**: All content is contained within a single HTML file with JavaScript-driven page transitions
- **Book-Style Navigation**: Implements a unique book metaphor with page-turning animations and navigation dots
- **Responsive Design**: Mobile-first approach with touch/swipe support for navigation

### Key Design Patterns
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with animations and interactions
- **Component-Based Styling**: CSS organized with clear component separation (loading screen, navigation, pages)
- **Event-Driven Architecture**: JavaScript uses event listeners for user interactions and page transitions

## Key Components

### 1. Loading Screen
- **Purpose**: Provides smooth entry experience with animated spinner
- **Implementation**: CSS animations with JavaScript timing control
- **Duration**: 1.5 seconds before hiding

### 2. Navigation System
- **Page Indicators**: Dot-based navigation showing current page and allowing direct navigation
- **Hamburger Menu**: Slide-out navigation menu with page links and icons
- **Touch/Swipe Support**: Mobile-friendly gesture navigation

### 3. Page Structure
- **Total Pages**: 5 distinct sections (Welcome, About, Skills, Projects, Connect)
- **Page Transitions**: Smooth CSS animations controlled by JavaScript
- **Content Areas**: Each page designed as a self-contained component

### 4. Typography and Styling
- **Fonts**: Inter (primary) and Fira Code (monospace) from Google Fonts
- **Icons**: Font Awesome 6.4.0 for consistent iconography
- **Color Scheme**: Dark theme with configurable accent colors (currently white/gray)

## Data Flow

### Navigation Flow
1. User interacts with navigation elements (dots, menu, swipe)
2. JavaScript validates transition and updates current page state
3. CSS classes applied to trigger page transition animations
4. Active states updated across all navigation components

### Animation Flow
1. **Loading**: Initial spinner animation on page load
2. **Typing Effect**: Animated text typing for dynamic content
3. **Page Transitions**: Smooth sliding/fading effects between pages
4. **Interactive Elements**: Hover states and button animations

## External Dependencies

### CDN Resources
- **Google Fonts**: Inter and Fira Code font families
- **Font Awesome**: Version 6.4.0 for icons
- **No JavaScript Libraries**: Pure vanilla JavaScript implementation

### Font Loading Strategy
- Preloaded font weights: 300, 400, 500, 600, 700, 800 for Inter
- Fira Code weights: 400, 500, 600
- Display swap for performance optimization

## Deployment Strategy

### Static Hosting Ready
- **No Build Process**: Direct deployment of HTML, CSS, JS files
- **CDN Dependencies**: External resources loaded from reliable CDNs
- **Cross-Browser Compatibility**: Modern browser features with graceful degradation

### Performance Considerations
- **Minimal Dependencies**: Only essential external resources
- **Optimized Loading**: Progressive content loading with loading screen
- **Mobile Performance**: Touch-optimized interactions and responsive design

### File Structure
```
/
├── index.html          # Main HTML structure
├── style.css           # Complete styling and animations
├── script.js          # Navigation and interaction logic
└── attached_assets/   # Development artifacts and references
```

## Technical Specifications

### Browser Support
- Modern browsers with ES6+ support
- Touch device compatibility
- Responsive breakpoints for mobile/tablet/desktop

### Performance Features
- **Lazy Loading**: Content loaded progressively
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Optimized Images**: Placeholder support for profile images

### Accessibility
- Semantic HTML structure
- Keyboard navigation support (to be enhanced)
- Screen reader friendly markup
- High contrast color schemes

## Changelog
- July 01, 2025: Initial setup
- July 01, 2025: Major color scheme update from black/green to black/white
- July 01, 2025: Complete redesign with user's profile photo and enhanced mobile experience:
  * Added user's actual profile photo with slide-from-top animation
  * Updated HTML meta tags for SEO (title, description, favicon)
  * Moved page indicators from right side to bottom center
  * Simplified welcome text (removed "Welcome to My Digital Universe")
  * Enhanced page transition animations with scale and opacity effects
  * Improved mobile swipe sensitivity and touch handling
  * Made profile image rectangular with rounded corners instead of circular
  * Added responsive sizing for profile image across all screen sizes
- July 01, 2025: Complete functionality and design overhaul:
  * Fixed scrolling issues across all pages for better usability
  * Added custom SVG logos for C, C++, Kotlin, and C# programming languages
  * Moved profile photo to right side of welcome page and removed border
  * Added smooth text animations that trigger during page transitions
  * Updated color scheme from white accents to purple theme (#9d4edd)
  * Made profile photo cover top half of first page with full-width layout
  * Updated About Me content with user's personal description
  * Added bold font styling throughout site for better attention and readability
  * Enhanced purple gradient styling for cards, borders, and hover effects

## User Preferences

Preferred communication style: Simple, everyday language.