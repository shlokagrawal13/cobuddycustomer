import {Platform, Dimensions} from 'react-native';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
export const isSmallScreen = SCREEN_HEIGHT < 700;
export const isLargeScreen = SCREEN_HEIGHT > 900;
