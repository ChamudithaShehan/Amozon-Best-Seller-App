import { Colors } from '@/constants/theme';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  // Use system color scheme as fallback if theme context isn't available yet
  const systemColorScheme = useColorScheme() ?? 'light';
  const colorScheme = systemColorScheme;
  const colors = Colors[colorScheme];

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Logo animation: fade in and scale up
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    logoScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.back(1.2)),
    });

    // Text animation: fade in with slight delay and slide up
    textOpacity.value = withDelay(
      300,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      })
    );
    textTranslateY.value = withDelay(
      300,
      withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Loading dots: pulse animation with staggered delays
    const pulseAnimation = (opacity: Animated.SharedValue<number>, delay: number) => {
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.3, { duration: 600, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        )
      );
    };

    pulseAnimation(dot1Opacity, 800);
    pulseAnimation(dot2Opacity, 1000);
    pulseAnimation(dot3Opacity, 1200);
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  // Fade out function
  const fadeOut = () => {
    containerOpacity.value = withTiming(
      0,
      {
        duration: 400,
        easing: Easing.in(Easing.ease),
      },
      () => {
        onAnimationComplete?.();
      }
    );
  };

  // Expose fadeOut method (will be called from parent)
  useEffect(() => {
    // Store fadeOut in a way parent can access if needed
    // For now, parent will handle timing
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === 'light' ? colors.gradientStart : colors.gradientEnd,
        },
        containerAnimatedStyle,
      ]}
    >
      {/* Gradient overlay for depth */}
      <View
        style={[
          styles.gradientOverlay,
          {
            backgroundColor:
              colorScheme === 'light'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.2)',
          },
        ]}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo/Icon */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View
            style={[
              styles.logoIcon,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            ]}
          >
            <Animated.Text style={styles.logoEmoji}>📊</Animated.Text>
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Animated.Text
            style={[
              styles.appName,
              {
                color: '#FFFFFF',
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
              },
            ]}
          >
            amazon
          </Animated.Text>
          <View
            style={[
              styles.smileLine,
              {
                backgroundColor: colors.accent,
              },
            ]}
          />
          <Animated.Text
            style={[
              styles.appSubtitle,
              {
                color: '#FFFFFF',
                textShadowColor: 'rgba(0, 0, 0, 0.25)',
              },
            ]}
          >
            Bestsellers Explorer
          </Animated.Text>
        </Animated.View>

        {/* Loading Dots */}
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: '#FFFFFF',
              },
              dot1Style,
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: '#FFFFFF',
              },
              dot2Style,
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: '#FFFFFF',
              },
              dot3Style,
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoEmoji: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1.5,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  smileLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginTop: -4,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

