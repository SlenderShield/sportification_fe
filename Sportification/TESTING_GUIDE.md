# Sportification Mobile App - Testing Guide

## Overview
This guide covers basic testing procedures to verify the Sportification mobile app functionality, including authentication, navigation, API integration, and team management features.

## Prerequisites for Testing

### Backend Setup Required
Before testing, ensure you have:
1. The Sportification backend server running and accessible
2. Backend URL configured in `.env` file
3. Database populated with test data (or ability to create new records)

### Update Environment Configuration
Edit `Sportification/.env`:
```env
API_BASE_URL=http://your-backend-url:3000
SOCKET_URL=http://your-backend-url:3000
```

## Test Scenarios

### 1. Authentication Flow Testing

#### Test 1.1: User Registration
**Steps:**
1. Launch the app (should show Login screen)
2. Tap "Create Account" button
3. Fill in the registration form:
   - Email: test@sportification.com
   - Username: testuser
   - Password: Test123!
   - Confirm Password: Test123!
4. Tap "Create Account"

**Expected Results:**
- Form validation should work (show errors for invalid inputs)
- Successful registration should:
  - Save JWT tokens to secure keychain
  - Dispatch user data to Redux store
  - Automatically navigate to Main app (tabs appear)
  - Connect to Socket.IO

**Error Cases to Test:**
- Empty fields (should show validation errors)
- Invalid email format
- Password mismatch
- Password too short (< 6 characters)
- Existing username/email (backend should return error)

#### Test 1.2: User Login
**Steps:**
1. If logged in, logout first from Profile screen
2. Enter valid credentials
3. Tap "Sign In"

**Expected Results:**
- Loading indicator appears
- Tokens saved to secure storage
- User data loaded into Redux
- Navigate to Main tabs
- Socket.IO connects

**Error Cases:**
- Invalid email/password (should show alert)
- Network error (should display error message)
- Empty fields (validation errors)

#### Test 1.3: Token Persistence
**Steps:**
1. Login successfully
2. Close and reopen the app (or reload)

**Expected Results:**
- App should:
  - Retrieve token from keychain
  - Fetch user profile using the token
  - Skip login screen
  - Go directly to Main tabs
  - Show user data in Profile

#### Test 1.4: Logout
**Steps:**
1. Navigate to Profile tab
2. Tap "Logout"
3. Confirm logout in alert dialog

**Expected Results:**
- Tokens cleared from keychain
- Socket.IO disconnected
- Redux store cleared
- Navigate back to Login screen

---

### 2. Navigation Testing

#### Test 2.1: Bottom Tab Navigation
**Steps:**
1. Login successfully
2. Tap each bottom tab in sequence:
   - Matches
   - Tournaments
   - Teams
   - Venues
   - Chats
   - Profile

**Expected Results:**
- Each tab should:
  - Display correct screen
  - Maintain its state when switching back
  - Show appropriate loading states
  - Display data or empty states

#### Test 2.2: Stack Navigation (Teams Example)
**Steps:**
1. Go to Teams tab
2. Tap "Create Team" button
3. Tap back/cancel
4. Tap a team card (if available)
5. Navigate back using header back button

**Expected Results:**
- Navigation stack should work properly
- Back button returns to previous screen
- Navigation state is preserved

---

### 3. Team Management Testing

#### Test 3.1: Browse Teams
**Steps:**
1. Navigate to Teams tab
2. Pull down to refresh
3. Scroll through team list

**Expected Results:**
- Teams load from API
- Display team cards with:
  - Team name and avatar
  - Sport
  - Description (if any)
  - Member count
  - Captain name
- Refresh should reload data
- Loading spinner while fetching

**Empty State:**
- If no teams exist, should show:
  - "No teams found" message
  - "Create a team to get started" subtitle

#### Test 3.2: Create Team
**Steps:**
1. Tap "Create Team" button
2. Fill in the form:
   - Team Name: "Warriors"
   - Sport: Select "Basketball"
   - Description: "Competitive basketball team"
   - Max Members: "15"
3. Tap "Create Team"

**Expected Results:**
- Form validation works
- API call creates team
- Success alert appears
- Navigates to Team Detail screen
- User is automatically added as captain

**Error Cases:**
- Empty team name (validation error)
- No sport selected (validation error)
- Max members < 2 or > 100 (validation error)
- Network error (show error alert)

#### Test 3.3: Team Detail View
**Steps:**
1. Tap on a team from the list
2. View team details

**Expected Results:**
- Display team information:
  - Team avatar (first letter of name)
  - Team name, sport, description
  - Member list with avatars
  - Captain badge on captain's row
  - Join date for each member
- Show appropriate action buttons:
  - "Join Team" if not a member
  - "Leave Team" if member (not captain)
  - "Edit Team" and "Delete Team" if captain

#### Test 3.4: Join Team
**Steps:**
1. Navigate to a team you're NOT a member of
2. Tap "Join Team" button

**Expected Results:**
- Loading indicator on button
- API call to join team
- Success alert
- Screen refreshes
- Button changes to "Leave Team"
- Your user appears in members list

**Error Cases:**
- Team is full (should show error)
- Already a member (backend error)
- Network error

#### Test 3.5: Leave Team
**Steps:**
1. Navigate to a team you're a member of (not captain)
2. Tap "Leave Team"
3. Confirm in alert dialog

**Expected Results:**
- Confirmation alert appears
- After confirming:
  - API call to leave team
  - Navigate back to teams list
  - Success alert

#### Test 3.6: Delete Team (Captain Only)
**Steps:**
1. Navigate to a team you created (captain)
2. Tap "Delete Team"
3. Confirm deletion

**Expected Results:**
- Destructive confirmation alert
- After confirming:
  - API call deletes team
  - Navigate back to teams list
  - Success message
  - Team removed from list

---

### 4. Profile & User Stats Testing

#### Test 4.1: View Profile
**Steps:**
1. Navigate to Profile tab
2. Observe displayed information

**Expected Results:**
- User avatar (first letter of username)
- Username
- Email
- Bio (if set)
- Statistics section:
  - Matches played/won
  - Tournaments played/won
- Achievements (if any earned)
- Menu items:
  - Edit Profile
  - Friends
  - Change Password
- Logout button

#### Test 4.2: User Statistics
**Expected Results:**
- Stats should load from `/users/{id}/stats` endpoint
- Display accurate counts
- Loading spinner while fetching
- Error handling if API fails

---

### 5. API Integration Testing

#### Test 5.1: Network Error Handling
**Steps:**
1. Disconnect backend or set wrong API URL
2. Try to login or fetch data

**Expected Results:**
- Error alerts displayed
- Retry option available (pull to refresh)
- App doesn't crash
- Appropriate error messages

#### Test 5.2: Token Refresh (401 Handling)
**Steps:**
1. Login successfully
2. Wait for access token to expire (or manually invalidate)
3. Perform an API call

**Expected Results:**
- App detects 401 error
- Automatically calls refresh token endpoint
- Gets new access token
- Retries original request
- User sees no interruption

**If Refresh Fails:**
- Clear tokens
- Redirect to login screen

#### Test 5.3: Pagination
**Steps:**
1. Go to Matches, Tournaments, or Teams list
2. Scroll to bottom (if enough items)

**Expected Results:**
- Currently: Shows first page only (limit: 10)
- Future enhancement: Auto-load next page

---

### 6. Real-time Features Testing (Socket.IO)

#### Test 6.1: Socket Connection
**Steps:**
1. Login successfully
2. Check console logs (if debugging enabled)

**Expected Results:**
- Socket.IO connects to backend
- Uses JWT token for authentication
- Connection status logged
- Auto-reconnect on disconnect

#### Test 6.2: Socket Disconnection/Reconnection
**Steps:**
1. Login successfully (socket connects)
2. Stop backend server
3. Restart backend

**Expected Results:**
- Socket detects disconnection
- Attempts reconnection with exponential backoff
- Successfully reconnects when backend is available
- Max 5 reconnection attempts

**Note:** Real-time chat integration is pending implementation.

---

### 7. Redux State Management Testing

#### Test 7.1: State Persistence
**Steps:**
1. Login
2. Navigate through different screens
3. Check that data is cached

**Expected Results:**
- RTK Query caches API responses
- Data doesn't reload unnecessarily
- State persists during navigation
- Cache invalidation works (after mutations)

#### Test 7.2: Cache Invalidation
**Steps:**
1. View teams list (data cached)
2. Create a new team
3. Return to teams list

**Expected Results:**
- New team appears in list without manual refresh
- RTK Query invalidated 'Teams' cache tag
- Fresh data fetched

---

### 8. Additional Screens Testing

#### Test 8.1: Matches Screen
**Expected:**
- Display matches list
- Show match details (title, sport, venue, time, participants)
- Status badges (scheduled, in_progress, completed, cancelled)
- Pull to refresh
- Create Match button (navigates to CreateMatch - not yet implemented)

#### Test 8.2: Tournaments Screen
**Expected:**
- Display tournaments list
- Show tournament info (name, sport, format, dates, participants)
- Status indicators
- Create Tournament button

#### Test 8.3: Venues Screen
**Expected:**
- Display venues list
- Show venue details (name, address, sports, pricing)
- Sport tags
- Navigate to details (not yet implemented)

#### Test 8.4: Chats Screen
**Expected:**
- Display chat conversations
- Show last message
- Unread count badges
- Navigate to chat detail (not yet implemented)

---

## Testing Checklist

### Critical Path Testing
- [ ] User can register a new account
- [ ] User can login with credentials
- [ ] Tokens are securely stored
- [ ] Auto-login works on app restart
- [ ] User can logout successfully
- [ ] All bottom tabs are accessible
- [ ] Teams can be created
- [ ] Teams can be browsed
- [ ] User can join/leave teams
- [ ] Captain can delete teams
- [ ] Profile displays user info and stats

### API Integration
- [ ] All API calls use correct endpoints
- [ ] JWT tokens included in headers
- [ ] Token auto-refresh works on 401
- [ ] Error messages displayed properly
- [ ] Loading states shown during API calls
- [ ] Success feedback after mutations

### UX/UI
- [ ] Loading spinners appear during async operations
- [ ] Error messages are clear and helpful
- [ ] Forms validate input properly
- [ ] Buttons show loading state
- [ ] Navigation is intuitive
- [ ] Pull-to-refresh works on lists
- [ ] Empty states are informative

### Edge Cases
- [ ] Network offline handling
- [ ] Invalid credentials handling
- [ ] Expired tokens handling
- [ ] API errors (400, 404, 500) handled gracefully
- [ ] Form validation prevents bad data
- [ ] Concurrent API calls don't cause issues

---

## Known Limitations (Not Yet Implemented)

1. **Missing Screens:**
   - Match Detail / Create Match
   - Tournament Detail / Create Tournament
   - Venue Detail / Create Booking
   - Chat Detail / Send Messages
   - Edit Profile
   - Change Password
   - Friends Management

2. **Missing Features:**
   - Push notifications
   - Image uploads
   - Map integration for venues
   - Deep linking
   - Offline mode
   - Biometric authentication

3. **Real-time Features:**
   - Chat messages not real-time (pending Socket.IO integration)
   - Live match updates not implemented
   - Real-time notifications not implemented

---

## Debugging Tips

### Enable Remote Debugging
1. In iOS Simulator: Press `Cmd + D`
2. In Android Emulator: Press `Cmd + M` (Mac) or `Ctrl + M` (Windows)
3. Select "Debug JS Remotely"
4. Open Chrome DevTools to view console logs and Redux state

### View Network Requests
Use React Native Debugger or Flipper to inspect:
- API request/response
- Headers (check JWT token)
- Response times
- Error responses

### Check Redux State
1. Enable Redux DevTools
2. View state tree
3. Monitor actions dispatched
4. Check RTK Query cache

### Common Issues

**App won't load:**
- Check Metro bundler is running
- Clear Metro cache: `npm start -- --reset-cache`
- Check .env file has correct API URL

**Login fails:**
- Verify backend is running
- Check API_BASE_URL in .env
- Inspect network request in debugger
- Check backend logs

**Blank screens:**
- Check console for errors
- Verify API responses return expected data structure
- Check RTK Query hooks for errors

**Navigation crashes:**
- Check screen names match in navigation config
- Verify all screens are properly imported
- Check route params are correct

---

## Test Result Template

```
Test Date: _____________
Tester: _____________
Backend URL: _____________
App Version: 0.1.0

Test Results:
✅ Authentication: PASS / FAIL
✅ Navigation: PASS / FAIL
✅ Team Management: PASS / FAIL
✅ Profile: PASS / FAIL
✅ API Integration: PASS / FAIL

Notes:
_______________________________
_______________________________
_______________________________

Issues Found:
_______________________________
_______________________________
_______________________________
```

---

## Next Steps After Testing

1. Fix any bugs discovered
2. Implement missing screens (Match/Tournament detail, Chat messages, etc.)
3. Add push notification support
4. Enhance error handling
5. Add more comprehensive form validation
6. Implement offline caching
7. Add analytics tracking
8. Performance optimization

---

## Support

For testing issues or questions:
1. Check console logs for detailed error messages
2. Review backend API responses
3. Verify .env configuration
4. Check IMPLEMENTATION_NOTES.md for known issues
5. Review network tab in debugger
