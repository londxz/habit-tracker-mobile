import { StyleSheet, Text, View } from 'react-native';

export function HabitDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Детали привычки</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
});
