/**
 * Icon — CoBuddy unified icon wrapper
 *
 * Renders a MaterialIcons icon by default.
 * Falls back to MaterialCommunityIcons for icons only available in MD3/MCIcons.
 *
 * Usage:
 *   <Icon name="arrow-back" size={24} color={Colors.onSurface} />
 *   <Icon name="shield-account" library="community" size={20} color={Colors.primary} />
 *
 * Icon name reference:
 *   MaterialIcons:          https://oblador.github.io/react-native-vector-icons/#MaterialIcons
 *   MaterialCommunityIcons: https://oblador.github.io/react-native-vector-icons/#MaterialCommunityIcons
 */

import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../theme/colors';

export type IconLibrary = 'material' | 'community';

interface IconProps {
  /** Icon name. For 'material' library use MaterialIcons names (e.g. 'arrow-back').
   *  For 'community' library use MaterialCommunityIcons names (e.g. 'shield-account'). */
  name: string;
  /** Library to use. Defaults to 'material' (MaterialIcons). */
  library?: IconLibrary;
  size?: number;
  color?: string;
}

export default function Icon({
  name,
  library = 'material',
  size = 24,
  color = Colors.onSurface,
}: IconProps) {
  if (library === 'community') {
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  }
  return <MaterialIcons name={name} size={size} color={color} />;
}
