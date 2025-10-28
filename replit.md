# 🏅 Sportification Mobile App

## 📘 Overview

**Sportification** is a **cross-platform React Native mobile application** for iOS and Android (including tablets and iPads) that powers the **Sportification sports community platform**.

The app enables users to:

* Discover and organize sports matches
* Join or create tournaments
* Manage teams and player stats
* Book venues and manage availability
* Chat in real time
* Receive push notifications
* Build a connected sports community

Built with **React Native + TypeScript**, the app delivers a responsive, secure, and high-performance experience across devices — from smartphones to tablets.

---

## 📦 Project Status

* **Current State:** MVP implementation in progress
* **Last Updated:** October 19, 2025
* **Version:** 0.1.0

---

## ⚙️ System Architecture

### 🧩 Frontend Architecture

* **Framework:** React Native 0.81.2
* **Language:** TypeScript 5.9.3
* **React Version:** 19.1.1
* **Engine:** Hermes
* **Navigation:** React Navigation 7.x (Stack + Bottom Tabs)
* **State Management:** Redux Toolkit + RTK Query
* **Forms & Validation:** React Hook Form + Yup
* **Authentication:** JWT-based with secure token storage via `react-native-keychain`
* **Networking:** Axios with interceptors for token auto-refresh
* **Real-time:** Socket.IO client with token-based authentication and auto-reconnect

### 📡 Backend Integration

* **API:** RESTful Sportification Backend API
* **Versioning:** `/api/v1`
* **Response Format:**

  ```json
  {
    "success": true,
    "data": {},
    "message": "string",
    "timestamp": "ISODate"
  }
  ```
* **Modules Integrated:** Auth, Users, Matches, Tournaments, Teams, Venues, Chats, Notifications
* **Real-time Events:** Match updates, tournament brackets, chat messages, notifications

### 💾 Data Storage

* **Secure Storage:** `react-native-keychain` for JWT tokens
* **Local Configs:** AsyncStorage for app preferences
* **Caching:** RTK Query tag invalidation and optimistic updates

### 🎨 UI/UX Design

* Responsive design for phones and tablets
* Multi-column layout for tablets
* Adaptive font and spacing utilities
* Accessible touch targets and clear states
* Smooth transitions, loading, and error handling

---

## 🏗️ Project Structure

```bash
src/
├── components/       # Reusable UI components
│   ├── common/      # Buttons, Inputs, Spinners
│   ├── matches/     # Match components
│   ├── tournaments/ # Tournament components
│   └── ...
├── navigation/       # Navigation setup
│   ├── RootNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── MainNavigator.tsx
├── screens/          # Feature screens
│   ├── Auth/        # Login, Register, Profile
│   ├── Matches/     # List, Detail, Create
│   ├── Tournaments/ # Bracket view, Create
│   ├── Teams/       # Create, Manage members
│   ├── Venues/      # Venue details, Booking
│   ├── Chat/        # Chat list and messages
│   ├── Notifications/ # Notification center
│   └── Profile/     # Edit, stats, achievements
├── services/         # API & Socket services
│   ├── api.ts
│   └── socketService.ts
├── store/            # Redux setup
│   ├── index.ts
│   ├── hooks.ts
│   ├── slices/
│   └── api/
├── types/            # TypeScript definitions
├── config/           # App configurations
└── utils/            # Helper utilities
```

---

## 🚀 Features

### 👤 Authentication & User Management

* ✅ JWT login/register with secure storage
* ✅ Auto token refresh
* ✅ User profile (stats, achievements)
* ✅ Friend management (search, add, remove)
* ⏳ Profile edit and password change

### 🏆 Matches

* ✅ Browse matches with filters & pagination
* ✅ Match detail with participants
* ✅ Create and manage matches
* ✅ Join/leave matches
* ✅ Organizer control (start, complete, cancel)
* ✅ Score tracking

### 🏅 Tournaments

* ✅ Tournament listing
* ⏳ Bracket view & details
* ⏳ Create and manage tournaments

### 👥 Teams

* ✅ Team list & details
* ✅ Create, join, or leave team
* ✅ Manage members
* ✅ Delete team (captain only)

### 🏟️ Venues & Bookings

* ✅ Venue browsing
* ⏳ Venue detail with booking slots
* ⏳ Create/manage bookings

### 💬 Chat

* ✅ Chat list with real-time updates
* ⏳ Chat messages (send/receive)
* ✅ Auto-reconnect and typing indicators

### 🔔 Notifications

* ⏳ Notification center
* ⏳ Push notifications (FCM + Notifee)
* ⏳ Badge counts

---

## 🔌 External Dependencies

### Backend

* **Sportification Backend API** – Main REST API
* **Socket.IO Server** – Real-time event hub

### Third-Party

* **Firebase Cloud Messaging (FCM)** – Push notifications
* **Notifee** – Local notification display

### Core Libraries

| Category     | Libraries                                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| Navigation   | `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`                                |
| UI & Layout  | `react-native-vector-icons`, `react-native-safe-area-context`, `react-native-screens`, `react-native-gesture-handler` |
| State & Data | `@reduxjs/toolkit`, `react-redux`, `axios`, `socket.io-client`                                                        |
| Validation   | `react-hook-form`, `yup`, `@hookform/resolvers`                                                                       |
| Utilities    | `date-fns`, `react-native-keychain`, `react-native-dotenv`                                                            |
| Dev Tools    | `TypeScript`, `ESLint`, `Prettier`, `Jest`, `Babel`                                                                   |

---

## ⚙️ Environment Setup

### Environment Variables

Create a `.env` file:

```bash
API_BASE_URL=http://your-backend-url:3000
SOCKET_URL=http://your-backend-url:3000
```

### Prerequisites

* Node.js 18+
* React Native CLI
* Android Studio (Android) / Xcode (iOS)

### Installation

```bash
cd Sportification
npm install
```

### Run the App

```bash
npm start      # Start Metro bundler
npm run ios    # Run on iOS
npm run android # Run on Android
```

---

## 🧾 Recent Updates

### October 19, 2025 – MVP Completion

* ✅ Core MVP features complete
* ✅ Full CRUD for Matches, Tournaments, Teams, Venues
* ✅ Real-time chat via Socket.IO
* ✅ Notifications framework integrated
* ✅ Authentication security hardened
* ✅ Added `TESTING_GUIDE.md` for QA

---

## ⚠️ Known Issues

* Minor TypeScript LSP errors
* Push notification integration incomplete
* Some CRUD forms under construction
* Chat message detail view pending

---

## 🧭 Technical Roadmap (Q4 2025 → Q1 2026)

| Milestone                              | Timeline            | Goals                                                                                             | Status         |
| -------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------- | -------------- |
| **Phase 1: MVP Finalization**          | Oct – Nov 2025      | Finalize CRUD for Matches & Tournaments, implement Socket.IO handlers, complete notification flow | 🟡 In Progress |
| **Phase 2: Offline & Notifications**   | Nov – Dec 2025      | Implement FCM + Notifee integration, add offline caching (RTK Query persist), error resilience    | 🔜 Planned     |
| **Phase 3: Enhanced UX & Performance** | Dec 2025 – Jan 2026 | Optimize navigation performance, improve UI for tablets, add animations, polish transitions       | 🔜 Upcoming    |
| **Phase 4: Deep Linking & Sharing**    | Jan 2026            | Add deep links for match/tournament invites, integrate shareable links, test on both platforms    | 🔜 Planned     |
| **Phase 5: Beta Launch**               | Feb 2026            | Internal beta rollout, bug fixes, QA automation, CI/CD setup                                      | 🔜 Pending     |
| **Phase 6: Public Launch**             | Mar 2026            | Play Store + App Store release, analytics setup, post-launch monitoring                           | ⏳ Upcoming     |

**Stretch Goals (Q2 2026):**

* 🗺️ Map integration (Google Maps / Apple Maps) for venues
* 🧩 In-app leaderboard & achievements
* 🔐 End-to-end encryption for chat messages
* 🌐 Multilingual support (EN, HI, ES)

---

## 💬 User Preferences

Preferred communication style: **Simple, everyday language**
