# Amazon Bestsellers Explorer

A modern React Native mobile application built with Expo that allows you to explore Amazon bestseller products across multiple categories. The app provides real-time product data, trending insights, price analytics, and top-rated product information.

## Features

- 📊 **Bestseller Products**: Browse top 50 products across 11 different categories
- 🔍 **Category Filtering**: Easy-to-use category chips with uniform, professional design
- 📈 **Trending Products**: View the #1 products from all categories
- 💰 **Price Insights**: Analyze pricing data across categories
- ⭐ **Top Rated Products**: Discover highest-rated products
- 🌓 **Theme Support**: Full theme support with system, light, and dark modes (all components properly themed)
- 🎨 **Animated Splash Screen**: Beautiful animated splash screen on app launch
- 💾 **Smart Caching**: Efficient 24-hour data caching for faster load times
- 🗑️ **Cache Management**: Clear all cached data with one tap
- 🔄 **Pull to Refresh**: Refresh product data with a simple pull gesture
- 📱 **Cross-Platform**: Works on iOS, Android, and Web

## Tech Stack

- **Framework**: Expo (~54.0.27)
- **Language**: TypeScript
- **UI**: React Native with Expo Router
- **State Management**: React Hooks
- **API**: Rainforest API
- **Caching**: AsyncStorage
- **HTTP Client**: Axios

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd amozon-new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key** (See [API Configuration](#api-configuration) section below)

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your device

## API Configuration

### Getting a Rainforest API Key

1. Visit [Rainforest API](https://www.rainforestapi.com/)
2. Sign up for an account
3. Navigate to your dashboard to get your API key
4. Choose a plan that suits your needs (free tier available)

### Updating the API Key

The API key is configured in `services/rainforestApi.ts`. To update it:

1. **Open the file**: `services/rainforestApi.ts`

2. **Locate the API_KEY constant** (line 3):
   ```typescript
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```

3. **Replace with your API key**:
   ```typescript
   const API_KEY = 'your-actual-api-key-from-rainforest';
   ```

4. **Save the file** - The changes will be hot-reloaded automatically

### Changing the API Endpoint

If you need to change the API URL (for example, if using a different API service):

1. **Open**: `services/rainforestApi.ts`

2. **Update the API_URL constant** (line 4):
   ```typescript
   const API_URL = 'https://api.rainforestapi.com/request';
   ```

3. **Modify the API parameters** if needed in the `getBestsellers` function (lines 45-51)

### API Parameters

The app currently uses these default parameters:
- **amazon_domain**: `amazon.com` (can be changed to other Amazon domains)
- **language**: `en_US` (can be changed to other language codes)
- **type**: `bestsellers` (fixed for this app)

To modify these defaults, edit the `getBestsellers` function in `services/rainforestApi.ts`:

```typescript
const {
  categoryId = 'bestsellers_appliances',
  amazonDomain = 'amazon.com',  // Change default domain here
  language = 'en_US',            // Change default language here
} = options;
```

## Project Structure

```
amozon-new/
├── app/
│   └── (tabs)/
│       ├── index.tsx          # Bestsellers home screen
│       ├── explore.tsx        # Explore features screen
│       └── _layout.tsx        # Tab navigation layout
├── components/
│   ├── CategoryChips.tsx      # Category filter buttons
│   ├── ProductCard.tsx        # Product display card
│   ├── SplashScreen.tsx       # Animated splash screen
│   ├── TrendingModal.tsx      # Trending products modal
│   ├── PriceInsightsModal.tsx # Price insights modal
│   ├── TopRatedModal.tsx      # Top rated products modal
│   └── ...
├── hooks/
│   ├── useBestsellers.ts      # Bestseller products hook
│   └── useAllCategories.ts    # All categories data hook
├── services/
│   ├── rainforestApi.ts       # API service (API key here)
│   └── cacheService.ts        # Caching service
├── constants/
│   └── theme.ts               # Theme colors and styles
└── contexts/
    └── ThemeContext.tsx       # Theme management
```

## Available Categories

The app supports 11 Amazon bestseller categories:

- 🏠 Appliances
- 📱 Electronics
- 📚 Books
- ⚽ Sports
- 🛋️ Home
- 🍳 Kitchen
- 🌿 Garden
- 💼 Office
- 🎮 Video Games
- 🎵 Music
- 🎬 Movies

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint to check code quality

## Features in Detail

### Bestsellers Page
- Browse products by category using uniform category chips
- View product details including images, ratings, prices, and ASIN
- Pull to refresh for latest data
- Smart caching for offline access
- Live data indicators

### Explore Page
- **Trending Products**: See top #1 products from all categories
- **Price Insights**: View average pricing across categories
- **Top Rated**: Discover highest-rated products
- **Settings**: 
  - Configure theme preferences (Light/Dark/System)
  - Clear all cached data with one tap
  - View app information and version

## Caching Strategy

The app implements intelligent caching:
- Products are cached locally using AsyncStorage
- Cache duration: 24 hours per category
- Cache is checked before making API requests
- Automatic cleanup of expired cache entries on app startup
- Force refresh available via pull-to-refresh
- Manual cache clearing available in Settings
- Cache helps reduce API calls and improve performance
- Stale cache used as fallback if API fails

## Environment Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- Expo CLI (installed globally or via npx)
- iOS Simulator (for Mac) or Android Studio (for Android development)

### For iOS Development
- Xcode (Mac only)
- iOS Simulator

### For Android Development
- Android Studio
- Android SDK
- Android Emulator

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in `services/rainforestApi.ts`
- Check that your API key has sufficient credits
- Verify the API key format (should be a string)

### Build Issues
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Expo version: `npx expo --version`

### Network Issues
- Check your internet connection
- Verify API endpoint is accessible
- Review console logs for detailed error messages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues related to:
- **Rainforest API**: Visit [Rainforest API Documentation](https://docs.rainforestapi.com/)
- **Expo**: Visit [Expo Documentation](https://docs.expo.dev/)
- **Project Issues**: Open an issue in the repository

## Recent Updates

### Version 1.0.0
- ✨ Added animated splash screen with smooth transitions
- 🎨 Fixed light mode theme support across all components
- 🗑️ Added cache management with clear all cache functionality
- 🐛 Improved theme consistency throughout the app
- ⚡ Enhanced app initialization and loading experience

## Version

Current version: **1.0.0**

---

Built with using Expo and React Native
