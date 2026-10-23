import { StyleSheet } from 'react-native';

import { appColors } from '../../shared/theme/colors';

export const habitFormStyles = StyleSheet.create({
  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: appColors.textSecondary,
  },
  group: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: appColors.surface,
  },
  row: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: appColors.textPrimary,
  },
  secondaryValue: {
    fontSize: 17,
    color: appColors.textSecondary,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
    backgroundColor: appColors.separator,
  },
});
