import {useState, useEffect} from 'react';
import {Keyboard, KeyboardEvent} from 'react-native';
export function useKeyboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) => {
      setIsVisible(true);
      setHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setIsVisible(false);
      setHeight(0);
    });
    return () => { show.remove(); hide.remove(); };
  }, []);
  return {isVisible, height};
}
