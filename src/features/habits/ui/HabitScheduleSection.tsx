import { Text, View } from 'react-native';

import { habitFormStyles } from './habitFormStyles';

export function HabitScheduleSection() {
  return (
    <>
      <Text style={habitFormStyles.sectionTitle}>РАСПИСАНИЕ</Text>
      <View style={habitFormStyles.group}>
        <View style={habitFormStyles.row}>
          <Text style={habitFormStyles.rowLabel}>Повторять</Text>
          <Text style={habitFormStyles.secondaryValue}>Каждый день</Text>
        </View>
      </View>
    </>
  );
}
