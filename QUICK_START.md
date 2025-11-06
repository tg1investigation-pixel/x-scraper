# Quick Start Guide

Get your Police Search Engine mobile app running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Expo, React Native, and navigation libraries.

## Step 2: Configure API Endpoint

Edit `services/api.js` and update the API URL:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_COMPUTER_IP:3000/api'  // Replace with your local IP
  : 'https://your-production-api.com/api';
```

**To find your computer's IP address:**
- **Windows**: Run `ipconfig` in Command Prompt, look for IPv4 Address
- **Mac/Linux**: Run `ifconfig` or `ip addr`, look for inet address

**Important**: Use your computer's local IP (e.g., `192.168.1.100`) not `localhost` when testing on a physical device.

## Step 3: Start Expo

```bash
npm start
```

This will:
- Start the Metro bundler
- Open Expo DevTools in your browser
- Display a QR code

## Step 4: Run on Your Device

### Option A: Using Expo Go App (Recommended for Development)

1. **Install Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR code**:
   - **iOS**: Use the Camera app to scan the QR code
   - **Android**: Use the Expo Go app to scan the QR code

3. The app will load on your device!

### Option B: Using Emulator/Simulator

- **iOS**: Press `i` in the terminal (requires Xcode and iOS Simulator)
- **Android**: Press `a` in the terminal (requires Android Studio and emulator)

## Step 5: Test the App

1. **Login Screen**: Enter your credentials (these should match your backend)
2. **Home Screen**: You'll see options for People Search and Vehicle Search
3. **Search**: Try searching for a person or vehicle (requires backend API)

## Troubleshooting

### "Network request failed" or "Unable to connect"
- ✅ Ensure your device and computer are on the same Wi-Fi network
- ✅ Verify the API_BASE_URL uses your computer's IP address, not `localhost`
- ✅ Check that your backend server is running
- ✅ Verify firewall isn't blocking the connection

### "Unable to resolve module"
- ✅ Run `npm install` again
- ✅ Clear cache: `expo start -c`
- ✅ Delete `node_modules` folder and `package-lock.json`, then run `npm install`

### App shows blank screen or crashes
- ✅ Check the Expo terminal for error messages
- ✅ Ensure all dependencies are installed
- ✅ Try restarting Expo: `expo start -c`

### QR code not working
- ✅ Ensure Expo Go app is up to date
- ✅ Try typing the connection URL manually in Expo Go
- ✅ For iOS, ensure Camera has permission to scan QR codes

## Next Steps

1. **Set up your backend API** - See `BACKEND_API_EXAMPLE.md` for detailed implementation guide
2. **Create app assets** - See `ASSETS_README.md` for asset requirements
3. **Customize branding** - Update colors in `config/constants.js`
4. **Test all features** - Verify login, search, and results display

## Development Tips

- **Hot Reload**: Changes to your code will automatically reload in the app
- **Debug Menu**: Shake your device or press `Cmd+D` (iOS) / `Cmd+M` (Android) in simulator
- **Reload**: Pull down to refresh or press `r` in the terminal
- **Clear Cache**: Run `expo start -c` to clear cache and restart

## Need Help?

- Check the main `README.md` for detailed documentation
- Review `BACKEND_API_EXAMPLE.md` for backend implementation
- Ensure your backend API matches the expected endpoints

Happy coding! 🚀
