# Mobile Development with Capacitor

This app is now configured to run on Android and iOS using Capacitor.

## Quick Start

### 1. Build and Sync
```bash
npm run build:mobile
```

Or separately:
```bash
npm run build
npx cap sync
```

### 2. Testing on Android

**Option A: Using Android Studio (Recommended)**
```bash
npx cap open android
```
Then click "Run" in Android Studio with your emulator or device selected.

**Option B: Direct Run (requires emulator/device)**
```bash
npm run cap:run:android
```

### 3. Testing on iOS (macOS only)

```bash
npx cap open ios
```
Then run from Xcode.

## Development Workflow

1. Make changes to your React code
2. Build the app: `npm run build`
3. Sync with native projects: `npx cap sync`
4. Run on device/simulator

## Important Notes

- **Backend URL**: The app is configured to use `http://10.0.2.2:8080` on Android emulator (which maps to localhost on your machine)
- For real devices, update the API URL in `src/services/api.js` to point to your machine's IP address
- Make sure your backend is running on `localhost:8080` when testing on emulator

## Testing with Docker Backend

Since your app runs with Docker, ensure the backend is accessible:

1. Start your Docker services:
   ```bash
   docker-compose up
   ```

2. For Android Emulator: Use `http://10.0.2.2:8080/api`
3. For iOS Simulator: Use `http://localhost:8080/api` (already configured)
4. For Real Devices: Update to your machine's local network IP (e.g., `http://192.168.1.x:8080/api`)

## Available Commands

- `npm run cap:sync` - Sync web assets to native projects
- `npm run cap:open:android` - Open Android project in Android Studio
- `npm run cap:open:ios` - Open iOS project in Xcode
- `npm run cap:run:android` - Build and run on Android
- `npm run cap:run:ios` - Build and run on iOS
- `npm run build:mobile` - Build and sync in one command

## Customization

Edit `capacitor.config.json` to customize:
- App name and ID
- Splash screen settings
- Plugin configurations
- Server settings
