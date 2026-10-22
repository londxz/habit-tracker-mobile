import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';

type ReminderTimePickerProps = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

export function ReminderTimePicker({
  value,
  disabled,
  onChange,
}: ReminderTimePickerProps) {
  const pickerValue = getTimePickerDate(value);

  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={pickerValue}
        disabled={disabled}
        display="compact"
        locale="ru-RU"
        mode="time"
        onValueChange={(_, date) => onChange(formatReminderTime(date))}
        style={styles.iosPicker}
      />
    );
  }

  function openAndroidPicker() {
    DateTimePickerAndroid.open({
      value: pickerValue,
      mode: 'time',
      is24Hour: true,
      onValueChange: (_, date) => onChange(formatReminderTime(date)),
    });
  }

  return (
    <Pressable
      accessibilityLabel={`Время напоминания ${value}`}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={openAndroidPicker}
      style={({ pressed }) => [styles.androidPicker, pressed && styles.pressed]}
    >
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function getTimePickerDate(value: string): Date {
  const [hours, minutes] = value.split(':').map(Number);
  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date;
}

function formatReminderTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

const styles = StyleSheet.create({
  iosPicker: {
    width: 104,
  },
  androidPicker: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 17,
    color: '#747B9A',
  },
  chevron: {
    marginLeft: 10,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '300',
    color: '#8E96B1',
  },
  pressed: {
    opacity: 0.55,
  },
});
