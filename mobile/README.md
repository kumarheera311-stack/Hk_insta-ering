# HK Insta-ering Mobile App

📱 **Complete React Native Social Media App with Monetization**

## Features ✨

- 🔐 User Authentication (Register/Login)
- 📹 Video Upload - Earn ₹10 per video
- 📸 Photo Upload - Earn ₹5 per photo
- 👥 Social Features (Like, Comment, Share, Follow)
- 💰 Wallet & Earnings Dashboard
- 💳 Payment Integration (Razorpay)
- 👤 User Profiles
- 💬 Real-time Messaging
- 📱 iOS & Android Support

## Prerequisites 📋

- Node.js (v14+)
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS - macOS only)
- Expo CLI (optional)

## Installation 🚀

### 1. Clone Repository
```bash
cd mobile
npm install
```

### 2. Configure Backend URL
Edit `src/api/api.js` and change the API_URL to your backend server IP:
```javascript
const API_URL = 'http://YOUR_IP:5000/api';
```

### 3. Run on Android
```bash
npm run android
```

### 4. Run on iOS
```bash
npm run ios
```

## Alternative: Using Expo

```bash
npm install -g expo-cli
npx expo start
# Scan QR code with Expo Go app
```

## Project Structure 📁

```
mobile/
├── src/
│   ├── api/
│   │   └── api.js           # API calls
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   ├── UploadScreen.js
│   │   ├── WalletScreen.js
│   │   └── ProfileScreen.js
│   ├── components/
│   │   └── PostCard.js      # Post component
│   ├── navigation/
│   │   └── Navigation.js    # Navigation setup
│   └── App.js              # Main app file
├── package.json
└── README.md
```

## Screens 📱

### 1. **Login/Register**
- Email authentication
- Secure password handling
- Form validation

### 2. **Home Feed**
- View posts from followed users
- Like posts
- Comment on posts
- Pull-to-refresh

### 3. **Upload**
- Select video or photo
- Add caption
- Earn money indicator
- Upload with progress

### 4. **Wallet**
- Check balance
- View earnings summary
- Request withdrawal
- Transaction history

### 5. **Profile**
- User profile info
- Follow/Unfollow
- Edit profile (own profile)
- View stats

## Earning System 💰

- **Video Upload**: ₹10 per video
- **Photo Upload**: ₹5 per photo
- **Minimum Withdrawal**: ₹100
- **Payment Method**: Razorpay

## API Endpoints 🔗

See backend documentation for complete API reference.

Base URL: `http://YOUR_IP:5000/api`

## Troubleshooting 🛠️

### Build Errors
```bash
# Clear cache
rm -rf node_modules
npm install

# Clear React Native cache
npm run android -- --reset-cache
```

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Permissions (Android)
Ensure these permissions are in `android/app/src/main/AndroidManifest.xml`:
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE

## Build for Production 🏭

### Android APK
```bash
cd android
./gradlew assembleRelease
```

### iOS Build
```bash
cd ios
pod install
xcodebuild -workspace HKInstaEering.xcworkspace -scheme HKInstaEering -configuration Release
```

## Testing 🧪

```bash
npm test
```

## Contributing 🤝

Pull requests are welcome!

## License 📜

MIT License

---

**Made with ❤️ for creators**
