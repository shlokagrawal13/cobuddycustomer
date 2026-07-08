import {useRef} from 'react';
import {Animated} from 'react-native';
export function useFadeIn(duration = 250) {
  const opacity = useRef(new Animated.Value(0)).current;
  const fadeIn = () => Animated.timing(opacity, {toValue: 1, duration, useNativeDriver: true}).start();
  const fadeOut = () => Animated.timing(opacity, {toValue: 0, duration, useNativeDriver: true}).start();
  return {opacity, fadeIn, fadeOut};
}
export function useSlideUp(duration = 300) {
  const translateY = useRef(new Animated.Value(40)).current;
  const slideUp = () => Animated.timing(translateY, {toValue: 0, duration, useNativeDriver: true}).start();
  return {translateY, slideUp};
}
