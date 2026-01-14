import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, Platform, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  // Use system color scheme as fallback if theme context isn't available yet
  const systemColorScheme = useColorScheme() ?? 'light';
  const colorScheme = systemColorScheme;
  const colors = Colors[colorScheme];

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.3);
  const logoRotate = useSharedValue(-15);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(40);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);
  const containerOpacity = useSharedValue(1);
  const shimmerProgress = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const orbitAngle = useSharedValue(0);

  // Floating particles
  const particle1Y = useSharedValue(0);
  const particle2Y = useSharedValue(0);
  const particle3Y = useSharedValue(0);
  const particle4Y = useSharedValue(0);

  useEffect(() => {
    // Logo animation: spectacular entrance with bounce
    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    logoScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
      mass: 0.8,
    });
    logoRotate.value = withSpring(0, {
      damping: 15,
      stiffness: 120,
    });

    // Glow pulsing animation
    glowScale.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(1.3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Orbit animation
    orbitAngle.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );

    // Text animation: fade in with elegant slide up
    textOpacity.value = withDelay(
      400,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      })
    );
    textTranslateY.value = withDelay(
      400,
      withSpring(0, {
        damping: 20,
        stiffness: 150,
      })
    );

    // Subtitle animation
    subtitleOpacity.value = withDelay(
      650,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      })
    );
    subtitleTranslateY.value = withDelay(
      650,
      withSpring(0, {
        damping: 18,
        stiffness: 140,
      })
    );

    // Shimmer effect
    shimmerProgress.value = withDelay(
      800,
      withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      )
    );

    // Loading dots: elegant wave animation
    const pulseAnimation = (opacity: SharedValue<number>, delay: number) => {
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }),
            withTiming(0.3, { duration: 400, easing: Easing.in(Easing.quad) })
          ),
          -1,
          false
        )
      );
    };

    pulseAnimation(dot1Opacity, 900);
    pulseAnimation(dot2Opacity, 1050);
    pulseAnimation(dot3Opacity, 1200);

    // Floating particles animation
    const floatAnimation = (value: SharedValue<number>, delay: number, distance: number) => {
      value.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-distance, { duration: 2000 + delay / 2, easing: Easing.inOut(Easing.ease) }),
            withTiming(distance, { duration: 2000 + delay / 2, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      );
    };

    floatAnimation(particle1Y, 0, 15);
    floatAnimation(particle2Y, 300, 20);
    floatAnimation(particle3Y, 600, 12);
    floatAnimation(particle4Y, 900, 18);
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: interpolate(glowScale.value, [1, 1.3], [0.3, 0.1]),
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(shimmerProgress.value, [0, 1], [-200, 200]) },
    ],
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
    transform: [{ scale: interpolate(dot1Opacity.value, [0.3, 1], [0.8, 1.2]) }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
    transform: [{ scale: interpolate(dot2Opacity.value, [0.3, 1], [0.8, 1.2]) }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
    transform: [{ scale: interpolate(dot3Opacity.value, [0.3, 1], [0.8, 1.2]) }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  // Particle styles
  const particle1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle1Y.value }],
  }));

  const particle2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle2Y.value }],
  }));

  const particle3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle3Y.value }],
  }));

  const particle4Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle4Y.value }],
  }));

  // Orbiting icons
  const orbitStyle1 = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${orbitAngle.value}deg` },
      { translateX: 100 },
      { rotate: `${-orbitAngle.value}deg` },
    ],
  }));

  const orbitStyle2 = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${orbitAngle.value + 120}deg` },
      { translateX: 100 },
      { rotate: `${-(orbitAngle.value + 120)}deg` },
    ],
  }));

  const orbitStyle3 = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${orbitAngle.value + 240}deg` },
      { translateX: 100 },
      { rotate: `${-(orbitAngle.value + 240)}deg` },
    ],
  }));

  const gradientColors = colorScheme === 'light'
    ? ['#FF9900', '#FF6B00', '#232F3E'] as const
    : ['#1A1A2E', '#16213E', '#0F3460'] as const;

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Animated background particles */}
      <View style={styles.particlesContainer}>
        <Animated.View style={[styles.particle, styles.particle1, particle1Style]} />
        <Animated.View style={[styles.particle, styles.particle2, particle2Style]} />
        <Animated.View style={[styles.particle, styles.particle3, particle3Style]} />
        <Animated.View style={[styles.particle, styles.particle4, particle4Style]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Glow effect behind logo */}
        <Animated.View style={[styles.glowContainer, glowAnimatedStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255, 153, 0, 0.4)', 'transparent']}
            style={styles.glow}
          />
        </Animated.View>

        {/* Orbiting elements */}
        <View style={styles.orbitContainer}>
          <Animated.View style={[styles.orbitItem, orbitStyle1]}>
            <View style={styles.orbitDot}>
              <Animated.Text style={styles.orbitEmoji}>⭐</Animated.Text>
            </View>
          </Animated.View>
          <Animated.View style={[styles.orbitItem, orbitStyle2]}>
            <View style={styles.orbitDot}>
              <Animated.Text style={styles.orbitEmoji}>🛒</Animated.Text>
            </View>
          </Animated.View>
          <Animated.View style={[styles.orbitItem, orbitStyle3]}>
            <View style={styles.orbitDot}>
              <Animated.Text style={styles.orbitEmoji}>💎</Animated.Text>
            </View>
          </Animated.View>
        </View>

        {/* Logo/Icon */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoBackground}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.logoGradient}
            />
            <View style={styles.logoIconWrapper}>
              <Animated.Image
                source={require('../assets/images/icon.png')}
                style={[styles.logoImage, { width: '100%', height: '100%' }]}
                resizeMode="contain"
              />
            </View>

            {/* Shimmer effect */}
            <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]}>
              <LinearGradient
                colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.shimmerGradient}
              />
            </Animated.View>
          </View>
        </Animated.View>

        {/* App Name with amazon-style branding */}
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Animated.Text style={styles.appName}>
            amazon
          </Animated.Text>
          <View style={styles.smileContainer}>
            <View style={styles.smileLine} />
            <View style={styles.smileArrow} />
          </View>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
          <Animated.Text style={styles.appSubtitle}>
            BESTSELLERS EXPLORER
          </Animated.Text>
          <View style={styles.taglineContainer}>
            <View style={styles.taglineDot} />
            <Animated.Text style={styles.tagline}>
              Discover Top Products
            </Animated.Text>
            <View style={styles.taglineDot} />
          </View>
        </Animated.View>

        {/* Loading Dots */}
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingDot, dot1Style]} />
          <Animated.View style={[styles.loadingDot, dot2Style]} />
          <Animated.View style={[styles.loadingDot, dot3Style]} />
        </View>

        {/* Bottom branding */}
        <View style={styles.bottomBranding}>
          <Animated.Text style={styles.poweredBy}>
            Powered by Rainforest API
          </Animated.Text>
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
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  particle1: {
    width: 100,
    height: 100,
    top: '10%',
    left: '10%',
  },
  particle2: {
    width: 60,
    height: 60,
    top: '20%',
    right: '15%',
  },
  particle3: {
    width: 80,
    height: 80,
    bottom: '30%',
    left: '20%',
  },
  particle4: {
    width: 50,
    height: 50,
    bottom: '15%',
    right: '25%',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  glow: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
  },
  orbitContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitItem: {
    position: 'absolute',
  },
  orbitDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  orbitEmoji: {
    fontSize: 16,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 36,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#FF9900',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  logoGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  logoIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    borderRadius: 16,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    overflow: 'hidden',
  },
  shimmerGradient: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  smileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    marginLeft: 60,
  },
  smileLine: {
    width: 80,
    height: 5,
    backgroundColor: '#FF9900',
    borderRadius: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#FF9900',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
      },
    }),
  },
  smileArrow: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderLeftColor: '#FF9900',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    marginLeft: -2,
    marginTop: 6,
    transform: [{ rotate: '95deg' }],
  },
  subtitleContainer: {
    alignItems: 'center',
    gap: 12,
  },
  appSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  taglineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF9900',
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 48,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  bottomBranding: {
    position: 'absolute',
    bottom: -SCREEN_HEIGHT / 2 + 80,
    alignItems: 'center',
  },
  poweredBy: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
  },
});
