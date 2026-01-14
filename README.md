# 📊 Amazon Bestsellers Explorer

<div align="center">

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0.27-000020.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178c6.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

**A premium mobile application to explore Amazon's bestselling products across multiple categories**

[Features](#-features) • [Screenshots](#-screenshots) • [Installation](#-installation) • [Configuration](#-configuration) • [Usage](#-usage) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### �️ Core Functionality
- **📊 Bestseller Products** - Browse top 50 products across 6 different categories
- **🔍 Smart Category Filtering** - Beautiful animated category chips with premium design
- **📈 Trending Products** - View the #1 products from all categories in one place
- **💰 Price Insights** - Analyze pricing data and trends across categories
- **⭐ Top Rated Products** - Discover the highest-rated products based on customer reviews

### � Premium UI/UX
- **✨ Animated Splash Screen** - Stunning splash screen with orbiting elements, particle effects, and smooth animations
- **🌓 Theme Support** - Full theme support with System, Light, and Dark modes
- **🌈 Glassmorphism Design** - Modern glassmorphism effects throughout the app
- **� Micro-animations** - Smooth press animations and transitions on all interactive elements
- **📱 Responsive Design** - Works beautifully on phones, tablets, and web browsers

### ⚡ Performance & Reliability
- **💾 Smart Caching** - 24-hour intelligent data caching for faster load times
- **🔄 Pull to Refresh** - Refresh product data with a simple pull gesture
- **🔍 Research Best Products** - Fetch fresh bestseller data anytime with confirmation
- **� Offline Support** - View cached products even without internet connection
- **⏱️ Live Status** - Real-time indicators showing data freshness

---

## 📸 Screenshots

### Splash Screen
```
┌─────────────────────────────────────┐
│                                     │
│        ⭐ 🛒 💎 (orbiting)         │
│                                     │
│            📊                       │
│          amazon                     │
│    ─────────────→                   │
│   BESTSELLERS EXPLORER              │
│                                     │
│   • Discover Top Products •         │
│                                     │
│         ● ● ●  (loading)            │
│                                     │
│      Powered by Rainforest API      │
└─────────────────────────────────────┘
```

### Home Screen
```
┌─────────────────────────────────────┐
│         � amazon                   │
│      BESTSELLERS EXPLORER           │
│                                     │
│  [LIVE ●] Updated 5m ago            │
│  🔥 Updated Daily | ⭐ Top 50       │
├─────────────────────────────────────┤
│ Categories                     [6]  │
│ [👗 Clothing] [🏠 Appliances] ...   │
├─────────────────────────────────────┤
│ 50 Products          Sorted by Rank │
├─────────────────────────────────────┤
│ ┌─────┬───────────────────────┐     │
│ │ #1  │ Product Title...      │     │
│ │ 🥇  │ ★★★★☆ 4.5 (1,234)      │     │
│ │     │ $199.99               │     │
│ │     │ 🛒 View on Amazon →   │     │
│ └─────┴───────────────────────┘     │
└─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo** | ~54.0.27 | Development framework |
| **React Native** | Latest | Cross-platform UI |
| **TypeScript** | 5.x | Type safety |
| **Expo Router** | Latest | Navigation |
| **React Native Reanimated** | Latest | Animations |
| **Expo Linear Gradient** | Latest | Gradient backgrounds |
| **AsyncStorage** | Latest | Local caching |
| **Axios** | Latest | API requests |

---

## 📦 Installation

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn**
- **Expo CLI** (installed globally or via npx)
- **iOS Simulator** (Mac only) or **Android Studio** for mobile development

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Amozon-Best-Seller-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key** (See [Configuration](#-configuration) section)

4. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator  
   - Press `w` for web browser
   - Scan QR code with **Expo Go** app on your device

---

## ⚙️ Configuration

### API Key Setup

This app uses the **Rainforest API** to fetch Amazon bestseller data.

#### Getting Your API Key

1. Visit [Rainforest API](https://www.rainforestapi.com/)
2. Sign up for an account
3. Navigate to your dashboard
4. Copy your API key

#### Environment Configuration

1. **Create a `.env` file** in the project root:
   ```env
   RAINFOREST_API_KEY=your-api-key-here
   ```

2. **Or update directly** in `services/rainforestApi.ts`:
   ```typescript
   const API_KEY = 'your-actual-api-key';
   ```

### Available Categories

The app supports 6 Amazon bestseller categories:

| Category | ID | Icon |
|----------|-----|------|
| Clothing & Jewelry | `bestsellers_fashion` | 👗 |
| Appliances | `bestsellers_appliances` | 🏠 |
| Toys & Games | `bestsellers_toys` | 🧸 |
| Kitchen & Dining | `bestsellers_kitchen` | 🍳 |
| Sports & Outdoors | `bestsellers_sports` | ⚽ |
| Automotive | `bestsellers_automotive` | 🚗 |

---

## 📁 Project Structure

```
Amozon-Best-Seller-App/
├── app/                          # Main application screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home/Bestsellers screen
│   │   └── explore.tsx           # Explore/Features screen
│   ├── _layout.tsx               # Root layout with splash screen
│   └── modal.tsx                 # Modal screen
├── components/                   # Reusable UI components
│   ├── SplashScreen.tsx          # Animated splash screen
│   ├── ProductCard.tsx           # Product display card
│   ├── CategoryChips.tsx         # Category filter chips
│   ├── ShimmerLoader.tsx         # Loading placeholder
│   ├── TrendingModal.tsx         # Trending products modal
│   ├── PriceInsightsModal.tsx    # Price analytics modal
│   ├── TopRatedModal.tsx         # Top rated products modal
│   └── ui/                       # Base UI components
├── hooks/                        # Custom React hooks
│   ├── useBestsellers.ts         # Fetch bestseller products
│   ├── useAllCategories.ts       # Fetch all categories data
│   └── use-color-scheme.ts       # Color scheme detection
├── services/                     # API and data services
│   ├── rainforestApi.ts          # Rainforest API integration
│   └── cacheService.ts           # AsyncStorage caching
├── constants/                    # App constants
│   └── theme.ts                  # Colors, spacing, typography
├── contexts/                     # React contexts
│   └── ThemeContext.tsx          # Theme state management
└── assets/                       # Static assets
    └── images/                   # App icons and images
```

---

## 🎯 Usage

### Browsing Products
1. Open the app
2. Select a category from the chips at the top
3. Scroll through the bestseller products
4. Tap any product to view it on Amazon

### Exploring Features
1. Navigate to the **Explore** tab
2. View trending products, price insights, or top-rated items
3. Each feature opens a detailed modal view

### Settings
- **Theme**: Choose between Light, Dark, or System themes
- **Cache**: Clear all cached data to fetch fresh information

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint checks |

---

## 💾 Caching Strategy

The app implements intelligent caching for optimal performance:

| Feature | Duration | Behavior |
|---------|----------|----------|
| Category Data | 24 hours | Auto-cached per category |
| Expired Cache | N/A | Cleaned up on app startup |
| Force Refresh | Immediate | Pull-to-refresh bypasses cache |
| Manual Clear | Immediate | Clear all via Settings |
| Fallback | On error | Stale cache used if API fails |

---

## 🐛 Troubleshooting

### API Issues
- **Invalid API Key**: Verify your key in `.env` or `rainforestApi.ts`
- **Rate Limits**: Check your Rainforest API plan limits
- **Network Errors**: Ensure you have internet connectivity

### Build Issues
```bash
# Clear Expo cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install

# Reset Metro bundler
npx expo start --clear
```

### Display Issues
- **Theme not changing**: Force close and reopen the app
- **Missing products**: Try clearing cache in Settings

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

---

## 📄 License

This project is **private and proprietary**.

---

## 📞 Support

| Resource | Link |
|----------|------|
| Rainforest API Docs | [docs.rainforestapi.com](https://docs.rainforestapi.com/) |
| Expo Documentation | [docs.expo.dev](https://docs.expo.dev/) |
| Project Issues | Open an issue in the repository |

---

## 📝 Changelog

### Version 1.1.0 (Current)
- ✨ **Premium UI Overhaul** - Complete redesign with glassmorphism and modern aesthetics
- � **New Splash Screen** - Stunning animated splash with orbiting elements and particles
- 🎨 **Enhanced Components** - Premium product cards, category chips, and feature cards
- 🌈 **Improved Gradients** - Beautiful gradient backgrounds across all screens
- 📊 **Better Data Display** - Results headers, status badges, and live indicators
- ⚡ **Performance** - Optimized animations and smoother transitions

### Version 1.0.0
- 🚀 Initial release
- 📊 Bestseller product browsing
- 🔍 Category filtering
- 🌓 Theme support (Light/Dark/System)
- 💾 24-hour smart caching
- 📈 Trending, Price Insights, and Top Rated features

---

<div align="center">

**Built with using Expo and React Native**

*Discover the best products on Amazon*

</div>
