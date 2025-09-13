# Smart Campus Wellbeing & Sustainability Hub - Design Guidelines

## Design Approach
**Selected Approach**: Design System (Material Design) with campus-focused customization
**Justification**: This utility-focused application prioritizes functionality, data visualization, and multi-module integration. Material Design provides excellent component consistency across mental health, safety, energy, and gamification modules.

## Core Design Elements

### Color Palette
**Primary Colors (Dark/Light Mode)**:
- Primary: 142 70% 45% / 142 60% 65% (Sustainable green)
- Secondary: 210 50% 35% / 210 40% 70% (Trust blue)
- Surface: 0 0% 10% / 0 0% 98%
- Background: 0 0% 8% / 0 0% 100%

**Accent Colors**:
- Success: 142 70% 50% (Mental health positive states)
- Warning: 35 85% 55% (Safety alerts)
- Error: 350 70% 50% (Critical notifications)

### Typography
**Font Families**: Inter (primary), Roboto Mono (data/metrics)
**Hierarchy**:
- H1: 32px/Bold (Module titles)
- H2: 24px/Semibold (Section headers)
- H3: 20px/Medium (Card titles)
- Body: 16px/Regular (Content)
- Caption: 14px/Regular (Metadata, timestamps)

### Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12
- Component padding: p-4, p-6
- Section margins: m-8, m-12
- Card spacing: gap-4, gap-6
- Button padding: px-6 py-2

### Component Library

**Navigation**:
- Persistent sidebar with module icons (Mental Health, Safety, Energy, Gamification)
- Top header with user profile, notifications, points counter
- Mobile: Bottom tab navigation

**Data Visualization**:
- Mood trend graphs: Line charts with smooth curves
- Energy leaderboard: Progress bars with campus building icons
- Real-time metrics: Clean numerical displays with trend indicators

**Interactive Elements**:
- SOS button: Large, prominent emergency red button with location icon
- Smart bin interface: Visual waste sorting guide with animated feedback
- Mood tracker: Emoji-based selection with color-coded responses

**Cards & Containers**:
- Rounded corners (8px radius)
- Subtle shadows for depth
- Module-specific color accents on card borders
- Consistent 16px internal padding

**Forms & Inputs**:
- Material Design text fields with floating labels
- Toggle switches for settings
- Multi-step forms for mood tracking and energy logging

### Gamification Elements
- Point displays: Circular progress indicators
- Achievement badges: Consistent iconography with campus themes
- Leaderboard: Clean ranking tables with subtle animations

### Real-time Features
- Live status indicators for IoT devices
- Notification toasts for safety alerts
- Auto-refreshing dashboards for energy metrics

### Mobile Optimization
- Touch-friendly button sizes (minimum 44px)
- Swipe gestures for navigation between modules
- Responsive grid layouts for different screen sizes
- Bottom sheet modals for quick actions

### Accessibility
- High contrast ratios maintained in both light and dark modes
- Screen reader compatible labels for all interactive elements
- Keyboard navigation support throughout the application
- Clear visual feedback for all user actions

This design system ensures consistency across all four modules while maintaining the utilitarian focus needed for campus wellbeing and sustainability tracking.