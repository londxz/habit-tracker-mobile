import {
  DynamicColorIOS,
  Platform,
  PlatformColor,
  type ColorValue,
} from 'react-native';

type AppColorName =
  | 'background'
  | 'surface'
  | 'control_background'
  | 'selected_surface'
  | 'text_primary'
  | 'text_secondary'
  | 'text_tertiary'
  | 'separator'
  | 'border'
  | 'track'
  | 'placeholder'
  | 'danger';

function dynamicColor(
  name: AppColorName,
  light: string,
  dark: string,
): ColorValue {
  if (Platform.OS === 'ios') {
    return DynamicColorIOS({ light, dark });
  }

  if (Platform.OS === 'android') {
    return PlatformColor(`@color/${name}`);
  }

  return light;
}

export const appColors = {
  accent: '#0A84FF',
  background: dynamicColor('background', '#F2F2F7', '#000000'),
  surface: dynamicColor('surface', '#FFFFFF', '#1C1C1E'),
  controlBackground: dynamicColor('control_background', '#E5E5EA', '#2C2C2E'),
  selectedSurface: dynamicColor('selected_surface', '#EDF4FF', '#102A43'),
  textPrimary: dynamicColor('text_primary', '#111111', '#FFFFFF'),
  textSecondary: dynamicColor('text_secondary', '#747480', '#AEAEB2'),
  textTertiary: dynamicColor('text_tertiary', '#8E94A5', '#8E8E93'),
  separator: dynamicColor('separator', '#D1D1D6', '#38383A'),
  border: dynamicColor('border', '#A8AEC0', '#636366'),
  track: dynamicColor('track', '#D8D8DC', '#3A3A3C'),
  placeholder: dynamicColor('placeholder', '#C7C7CC', '#636366'),
  danger: dynamicColor('danger', '#FF3B30', '#FF453A'),
  onAccent: '#FFFFFF',
  shadow: '#000000',
  celebrationOverlay: 'rgba(8, 8, 12, 0.94)',
  celebrationSecondary: '#C7C7CC',
} as const;
