import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function NavigationMenu() {
  const router = useRouter();

  return (
    <View style={styles.menu}>
      <Button title="Home" onPress={() => router.push('/')} />
      <Button title="Login" onPress={() => router.push('/login')} />
      <Button title="Signup" onPress={() => router.push('/signup')} />
      <Button title="Book" onPress={() => router.push('/book-appointment')} />
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#eee',
  },
});
