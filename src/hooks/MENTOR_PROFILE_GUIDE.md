# Mentor Profile Page Guide

## Overview

The mentor profile page (`/mentor/profile/$id_profile`) displays comprehensive information about a mentor, including their bio, statistics, availability, and contact information. The page is fully responsive and provides a great user experience with loading states, error handling, and interactive elements.

## Features

### ✅ Implemented Features

1. **Dynamic Routing**
   - Route: `/mentor/profile/$id_profile`
   - Loads mentor data based on the `id_profile` parameter
   - Supports username or ID-based lookups

2. **Data Fetching**
   - Uses `useMentor` hook for efficient data fetching
   - Automatic loading and error states
   - Query caching with TanStack Query

3. **UI Components**
   - **Header Section**: Back button and navigation
   - **Main Profile Card**: Avatar, name, username, status badge
   - **About Section**: Full bio display
   - **Statistics Grid**: Mentees, sessions, rating, hours
   - **Availability Section**: Upcoming availability
   - **Quick Actions**: Book session, send message, add to favorites
   - **Contact Information**: Wallet address with copy button
   - **Expertise Tags**: Areas of knowledge
   - **Reviews Section**: Mentee testimonials

4. **Interactive Elements**
   - Copy wallet address to clipboard with toast notification
   - View on explorer button (placeholder)
   - Status badge with color coding
   - Responsive design for all screen sizes

5. **Loading & Error States**
   - Skeleton screens during data loading
   - Error message when mentor not found
   - Empty state when no data available

6. **Toast Notifications**
   - Success/error toasts using Sonner
   - Wallet address copied confirmation
   - Consistent user feedback

## Usage

### Navigating to a Profile

```typescript
import { useNavigate } from "@tanstack/react-router";

const navigate = useNavigate();

// Navigate to a specific mentor profile
navigate({ to: "/mentor/profile/johndoe" });
```

### Viewing the Sample Profile

A demo mentor has been seeded with the following credentials:
- **Username**: `sample_mentor`
- **Name**: Alex Johnson
- **URL**: http://localhost:3000/mentor/profile/sample_mentor

### From the Homepage

The index page includes a "View Sample Profile" button that navigates to the demo mentor profile.

### From Registration Success

After successful mentor registration, users are automatically redirected to their profile page with a countdown timer.

## Code Structure

### Route File
```
src/routes/mentor.profile.$id_profile.tsx
```

### Key Components

1. **MentorProfilePage**: Main component
2. **MentorProfileSkeleton**: Loading state component

### Custom Hooks Used

- `useMentor(username, enabled)` - Fetch mentor data
- `toast` - Show notifications

## API Integration

### Data Source

The page fetches data using the `useMentor` hook which calls the `getMentor` server function:

```typescript
const { data: mentor, isLoading, error } = useMentor("sample_mentor");
```

### Expected Data Format

```typescript
interface Mentor {
  id: number;
  walletAddress: string;
  fullName: string;
  username: string;
  bio: string;
  status: 'pending' | 'registered' | 'rejected';
  transactionHash?: string;
  blockNumber?: number;
  registeredAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Styling

The page uses:
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Lucide React** icons
- **Responsive grid** layout
- **Gradient backgrounds**

### Color Scheme
- Blue gradient background
- White cards with shadows
- Status badges (green/yellow/red)
- Muted text for descriptions

## Testing

### Test Profile Creation

```bash
# Seed demo mentor
pnpm db:seed

# View profile
open http://localhost:3000/mentor/profile/sample_mentor
```

### Test Error States

1. **Invalid Username**
   - Navigate to `/mentor/profile/nonexistent`
   - Shows "Mentor Not Found" error

2. **Loading State**
   - Refresh page with network throttling
   - Shows skeleton screens

## Future Enhancements

### Planned Features

1. **Sessions List**
   - Display past and upcoming sessions
   - Session details (date, time, mentee name)
   - Session status (completed, upcoming, cancelled)

2. **Reviews & Ratings**
   - Mentee reviews and ratings
   - Review form for verified mentees
   - Average rating display

3. **Availability Calendar**
   - Interactive calendar
   - Time slot selection
   - Booking integration

4. **Social Proof**
   - Testimonials
   - Success stories
   - Linked social profiles

5. **Advanced Actions**
   - Message mentor
   - Schedule directly from profile
   - Download vCard

### Data Enhancements

1. **Profile Fields**
   - Profile picture upload
   - LinkedIn/GitHub links
   - Hourly rate display
   - Languages spoken

2. **Statistics**
   - Total earnings in IDRX
   - Completion rate
   - Response time
   - Last active date

## Performance

### Optimizations

1. **Query Caching**
   - 5-minute stale time
   - Automatic refetch on window focus
   - Smart cache invalidation

2. **Image Optimization**
   - Lazy loading
   - Error fallback to initials
   - Responsive images

3. **Code Splitting**
   - Dynamic imports
   - Route-based splitting
   - Lazy component loading

## Accessibility

### Implemented

1. **Semantic HTML**
   - Proper heading hierarchy
   - ARIA labels
   - Focus management

2. **Keyboard Navigation**
   - Tab order
   - Enter/Space activation
   - Escape key handling

3. **Screen Readers**
   - Alt text for images
   - ARIA live regions
   - Descriptive labels

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

## Troubleshooting

### Common Issues

1. **Profile Not Loading**
   - Check mentor exists in database
   - Verify username parameter
   - Check network tab for errors

2. **Missing Data**
   - Verify database connection
   - Check mentor.status field
   - Ensure required fields populated

3. **Toast Not Showing**
   - Verify Toaster component in root
   - Check Sonner import
   - Test clipboard permissions

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Router Docs](https://reactrouter.com/)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Contributing

When adding new features:

1. Update this guide
2. Add TypeScript types
3. Include error handling
4. Add loading states
5. Test responsive design
6. Update seed data if needed

---

**Last Updated**: January 24, 2025
**Version**: 1.0.0
