import { Pressable, StyleSheet, Text, View } from 'react-native';

export type HistoryView = 'calendar' | 'history';

type HistoryViewSwitchProps = {
  selectedView: HistoryView;
  onViewChange: (view: HistoryView) => void;
};

const views: Array<{ value: HistoryView; title: string }> = [
  { value: 'calendar', title: 'Календарь' },
  { value: 'history', title: 'История' },
];

export function HistoryViewSwitch({
  selectedView,
  onViewChange,
}: HistoryViewSwitchProps) {
  return (
    <View accessibilityRole="tablist" style={styles.container}>
      {views.map(view => {
        const isSelected = view.value === selectedView;

        return (
          <Pressable
            key={view.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onViewChange(view.value)}
            style={({ pressed }) => [
              styles.button,
              isSelected && styles.buttonSelected,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.title, isSelected && styles.titleSelected]}>
              {view.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    backgroundColor: '#E5E5EA',
  },
  button: {
    minHeight: 38,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  buttonSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonPressed: {
    opacity: 0.65,
  },
  title: {
    fontSize: 16,
    color: '#747480',
  },
  titleSelected: {
    fontWeight: '600',
    color: '#111111',
  },
});
