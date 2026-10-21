import { StyleSheet, Text, View } from 'react-native';

export function ProgressScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Прогресс</Text>
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
    fontSize: 28,
    fontWeight: '700',
  },
});
