import {useNavigation as useNav, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/types';
export function useAppNavigation() {
  return useNav<NativeStackNavigationProp<RootStackParamList>>();
}
export {useRoute};
