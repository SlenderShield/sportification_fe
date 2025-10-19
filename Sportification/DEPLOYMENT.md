# Sportification Deployment Guide

## Overview

Sportification is a cross-platform React Native application supporting iOS, Android, and Web platforms. This guide covers deployment instructions for all platforms.

## Prerequisites

### Firebase Setup (Required for Push Notifications)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add your app for each platform:
   - **iOS**: Add an iOS app with bundle ID `org.reactjs.native.example.Sportification`
   - **Android**: Add an Android app with package name `com.sportification`
   - **Web**: Add a Web app

3. **Download Configuration Files**:
   - **iOS**: Download `GoogleService-Info.plist` and replace the placeholder file at `ios/GoogleService-Info.plist`
   - **Android**: Download `google-services.json` and replace the placeholder file at `android/app/google-services.json`
   - **Web**: Firebase credentials are already configured via environment variables

4. **Environment Variables** (already configured in Replit):
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

## Platform-Specific Deployment

### Web Application

The web application is already configured and running on port 5000.

**Development Server**:
```bash
cd Sportification
npm run web
```

**Production Build**:
```bash
cd Sportification
npm run build:web
```

The built files will be in the `dist/` directory. You can serve these files using any static file server.

**Web Features**:
- Full React Native Web support
- Responsive design
- All app features except push notifications (FCM is native-only)
- Served on port 5000 with hot-reload during development

### iOS Deployment

**Requirements**:
- macOS with Xcode installed
- Apple Developer account
- CocoaPods installed

**Steps**:
1. Install dependencies:
   ```bash
   cd Sportification
   npm install
   cd ios && pod install
   ```

2. Replace `ios/GoogleService-Info.plist` with your Firebase configuration file

3. Open the project in Xcode:
   ```bash
   open ios/Sportification.xcworkspace
   ```

4. Configure signing & capabilities:
   - Select your team
   - Enable Push Notifications capability
   - Enable Background Modes (Remote notifications)

5. Build and run:
   ```bash
   cd Sportification
   npm run ios
   ```

6. For App Store deployment, archive and upload through Xcode

### Android Deployment

**Requirements**:
- Android Studio
- Android SDK
- Java Development Kit (JDK) 11 or higher

**Steps**:
1. Replace `android/app/google-services.json` with your Firebase configuration file

2. Build and run:
   ```bash
   cd Sportification
   npm run android
   ```

3. For Play Store deployment, generate a signed APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

The APK will be at `android/app/build/outputs/apk/release/app-release.apk`

## Backend Configuration

Update the API endpoints in your `.env` file:

```env
API_BASE_URL=https://your-backend-api.com
SOCKET_URL=https://your-backend-api.com
```

## Features by Platform

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Authentication | ✅ | ✅ | ✅ |
| Match Management | ✅ | ✅ | ✅ |
| Tournament System | ✅ | ✅ | ✅ |
| Team Management | ✅ | ✅ | ✅ |
| Venue Booking | ✅ | ✅ | ✅ |
| Real-time Chat | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ✅ | ❌ |
| Secure Storage | ✅ | ✅ | ⚠️* |

*Web uses browser localStorage instead of native secure storage

## Troubleshooting

### iOS Build Issues
- Ensure CocoaPods are installed: `sudo gem install cocoapods`
- Clean build: `cd ios && pod deintegrate && pod install`
- Reset cache: `npm start -- --reset-cache`

### Android Build Issues
- Clean project: `cd android && ./gradlew clean`
- Check JDK version: `java -version` (should be 11+)
- Verify Android SDK path in `android/local.properties`

### Web Build Issues
- Clear webpack cache: `rm -rf Sportification/dist`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check port availability: `lsof -i :5000`

## Production Checklist

- [ ] Replace Firebase placeholder configuration files
- [ ] Configure backend API endpoints
- [ ] Enable code obfuscation for production builds
- [ ] Set up error tracking (Sentry, Bugsnag, etc.)
- [ ] Configure analytics
- [ ] Test push notifications on all platforms
- [ ] Verify secure storage implementation
- [ ] Review and update app permissions
- [ ] Test offline functionality
- [ ] Perform security audit
- [ ] Set up CI/CD pipeline

## Support

For issues or questions, please refer to:
- React Native documentation: https://reactnative.dev
- Firebase documentation: https://firebase.google.com/docs
- React Navigation: https://reactnavigation.org
