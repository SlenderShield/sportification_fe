# Platform Configuration Guide for V2.0

This guide covers platform-specific setup requirements for Sportification V2.0 features.

## iOS Configuration

### 1. Info.plist Permissions

The following permissions are already added to `ios/Sportification/Info.plist`:

- **Location Services**:
  - `NSLocationWhenInUseUsageDescription`
  - `NSLocationAlwaysUsageDescription`
  - `NSLocationAlwaysAndWhenInUseUsageDescription`

- **Biometrics**:
  - `NSFaceIDUsageDescription`

- **Camera & Photos**:
  - `NSCameraUsageDescription`
  - `NSPhotoLibraryUsageDescription`

### 2. Google Maps Setup (iOS)

1. Get an iOS API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps SDK for iOS** and **Directions API**
3. Add to `.env`:
   ```
   GOOGLE_MAPS_API_KEY_IOS=your_ios_api_key
   ```

### 3. Apple Sign-In

1. **Enable in Xcode**:
   - Open `ios/Sportification.xcworkspace`
   - Select your target → Signing & Capabilities
   - Click "+ Capability" → Add "Sign in with Apple"

2. **Apple Developer Portal**:
   - Go to Certificates, Identifiers & Profiles
   - Select your App ID
   - Enable "Sign in with Apple"

### 4. Google Sign-In (iOS)

1. Add URL scheme to `Info.plist`:
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
     <dict>
       <key>CFBundleURLSchemes</key>
       <array>
         <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
       </array>
     </dict>
   </array>
   ```

2. Get OAuth client ID from [Google Cloud Console](https://console.cloud.google.com/)
3. Add to `.env`:
   ```
   GOOGLE_OAUTH_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
   ```

### 5. Facebook Login (iOS)

1. Create Facebook App at [developers.facebook.com](https://developers.facebook.com/)
2. Add to `Info.plist`:
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
     <dict>
       <key>CFBundleURLSchemes</key>
       <array>
         <string>fb{your-app-id}</string>
       </array>
     </dict>
   </array>
   <key>FacebookAppID</key>
   <string>{your-app-id}</string>
   <key>FacebookDisplayName</key>
   <string>Sportification</string>
   <key>LSApplicationQueriesSchemes</key>
   <array>
     <string>fbapi</string>
     <string>fbauth2</string>
   </array>
   ```

3. Add to `.env`:
   ```
   FACEBOOK_APP_ID=your_facebook_app_id
   ```

### 6. Firebase (iOS)

1. Download `GoogleService-Info.plist` from Firebase Console
2. Place it in `ios/Sportification/` directory
3. Add to Xcode project (don't forget to check "Copy items if needed")

### 7. Stripe (iOS)

1. Get publishable key from [Stripe Dashboard](https://dashboard.stripe.com/)
2. Add to `.env`:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   ```
3. For Apple Pay:
   - Add "Apple Pay" capability in Xcode
   - Create merchant identifier in Apple Developer Portal
   - Configure in Stripe Dashboard

### 8. Install CocoaPods

```bash
cd ios
pod install
cd ..
```

---

## Android Configuration

### 1. AndroidManifest.xml Permissions

The following permissions are already added to `android/app/src/main/AndroidManifest.xml`:

- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `USE_BIOMETRIC`
- `USE_FINGERPRINT`
- `CAMERA`
- `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`

### 2. Google Maps Setup (Android)

1. Get an Android API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps SDK for Android** and **Directions API**
3. Add SHA-1 fingerprint to Google Cloud Console:
   ```bash
   # Debug keystore
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   
   # Release keystore
   keytool -list -v -keystore your-release.keystore -alias your-key-alias
   ```

4. API key is already configured in `AndroidManifest.xml`:
   ```xml
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="${GOOGLE_MAPS_API_KEY_ANDROID}" />
   ```

5. Add to `.env`:
   ```
   GOOGLE_MAPS_API_KEY_ANDROID=your_android_api_key
   ```

### 3. Google Sign-In (Android)

1. Get OAuth 2.0 Web Client ID from [Google Cloud Console](https://console.cloud.google.com/)
2. Add SHA-1 fingerprint (same as Maps setup)
3. Add to `.env`:
   ```
   GOOGLE_OAUTH_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
   ```

### 4. Facebook Login (Android)

1. Add to `android/app/src/main/res/values/strings.xml`:
   ```xml
   <string name="facebook_app_id">your_facebook_app_id</string>
   <string name="fb_login_protocol_scheme">fbyour_facebook_app_id</string>
   ```

2. Facebook App ID is already configured in `AndroidManifest.xml`:
   ```xml
   <meta-data
     android:name="com.facebook.sdk.ApplicationId"
     android:value="@string/facebook_app_id"/>
   ```

3. Add release key hash to Facebook Console:
   ```bash
   keytool -exportcert -alias your-key-alias -keystore your-release.keystore | openssl sha1 -binary | openssl base64
   ```

4. Add to `.env`:
   ```
   FACEBOOK_APP_ID=your_facebook_app_id
   ```

### 5. Firebase (Android)

1. Download `google-services.json` from Firebase Console
2. Place it in `android/app/` directory
3. Already configured in `android/app/build.gradle`:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

### 6. Stripe (Android)

1. Get publishable key from [Stripe Dashboard](https://dashboard.stripe.com/)
2. Add to `.env`:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   ```

### 7. ProGuard Rules (for Release Builds)

Add to `android/app/proguard-rules.pro`:

```proguard
# React Native
-keep class com.facebook.react.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# Stripe
-keep class com.stripe.android.** { *; }

# Google Maps
-keep class com.google.android.gms.maps.** { *; }

# React Native Biometrics
-keep class com.rnbiometrics.** { *; }

# Google Sign-In
-keep class com.google.android.gms.auth.** { *; }

# Facebook
-keep class com.facebook.** { *; }
```

---

## Environment Variables Summary

Create a `.env` file in the project root with the following:

```env
# API
API_BASE_URL=http://your-backend-url:3000
SOCKET_URL=http://your-backend-url:3000

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# Google Maps
GOOGLE_MAPS_API_KEY_ANDROID=your_android_maps_key
GOOGLE_MAPS_API_KEY_IOS=your_ios_maps_key

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Social Login
GOOGLE_OAUTH_WEB_CLIENT_ID=your_google_oauth_web_client_id
FACEBOOK_APP_ID=your_facebook_app_id

# Analytics
ENABLE_ANALYTICS=true
ENABLE_CRASHLYTICS=true
```

---

## Testing

### Test Maps
1. Run app on device (location services don't work well in simulators)
2. Grant location permissions when prompted
3. Navigate to venue or match screen
4. Verify map displays with markers
5. Test "Get Directions" button

### Test Payments
1. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`
2. Any future expiry date
3. Any 3-digit CVV
4. Any 5-digit postal code

### Test Biometrics
1. Set up biometrics on device (Settings → Face ID/Touch ID)
2. Open app and tap biometric login
3. Verify authentication prompt appears
4. Test success and cancel scenarios

### Test Social Login
1. **Google**: Verify Google account picker appears
2. **Apple** (iOS only): Verify Apple ID authentication
3. **Facebook**: Verify Facebook login web view
4. Check user profile data is received
5. Verify token is saved and user is authenticated

### Test Localization
1. Open app settings
2. Change language to Hindi
3. Navigate through app
4. Verify all strings are translated
5. Switch back to English

---

## Troubleshooting

### Maps not showing
- **iOS**: Check Info.plist has location permissions
- **Android**: Verify API key and SHA-1 fingerprint
- Both: Check network connectivity and API quotas

### Google Sign-In fails
- Verify OAuth client ID is correct (Web type, not Android/iOS)
- Check SHA-1 fingerprint matches
- Ensure Google Sign-In is enabled in Firebase Console

### Apple Sign-In not available
- Only works on iOS 13+
- Requires physical device for testing
- Check capability is enabled in Xcode

### Facebook Login fails
- Verify App ID is correct
- Check key hash in Facebook Console
- Ensure app is not in development mode (or add test users)

### Stripe payments fail
- Use test publishable key (starts with `pk_test_`)
- Check network connectivity
- Verify card details are correct test data

### Biometrics not working
- Only works on physical devices
- Check device has biometrics enrolled
- Verify permissions in Info.plist (iOS) or manifest (Android)

---

## Production Checklist

Before releasing to production:

### iOS
- [ ] Replace Firebase `GoogleService-Info.plist` with production version
- [ ] Use production Stripe key
- [ ] Configure production OAuth client IDs
- [ ] Set up Apple Pay merchant ID
- [ ] Enable App Store Connect API access
- [ ] Configure push notification certificates
- [ ] Set up production environment variables

### Android
- [ ] Replace Firebase `google-services.json` with production version
- [ ] Use production Stripe key
- [ ] Add production SHA-1 fingerprint to all services
- [ ] Configure production OAuth client IDs
- [ ] Set up Google Play signing
- [ ] Enable ProGuard for release builds
- [ ] Test signed APK/AAB
- [ ] Set up production environment variables

### Backend
- [ ] Configure Stripe webhook endpoints
- [ ] Set up production Firebase project
- [ ] Verify all API endpoints are secured
- [ ] Test social login flows end-to-end
- [ ] Set up monitoring and alerts

---

## Additional Resources

- [React Native Maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Stripe React Native Guide](https://stripe.com/docs/payments/accept-a-payment?platform=react-native)
- [Google Sign-In Setup](https://github.com/react-native-google-signin/google-signin)
- [Apple Sign-In Setup](https://github.com/invertase/react-native-apple-authentication)
- [Facebook Login Setup](https://github.com/thebergamo/react-native-fbsdk-next)
- [Firebase Setup Guide](https://rnfirebase.io/)
- [React Native Biometrics](https://github.com/SelfLender/react-native-biometrics)
