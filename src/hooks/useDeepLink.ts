import {useEffect} from 'react';
import {Linking} from 'react-native';
// Placeholder — wire to deeplink.service in Phase 1b
export function useDeepLink() {
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({url}) => {
      console.log('[DeepLink]', url);
    });
    return () => sub.remove();
  }, []);
}
