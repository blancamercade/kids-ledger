import { View, Text, FlatList, Button } from 'react-native';
import { useRouter } from 'expo-router';

const kids = [
  { id: 'Emma', name: 'Emma' },
  { id: 'Neil', name: 'Neil' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Kids' Money Tracker</Text>
      <FlatList
        data={kids}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={item.name} onPress={() => router.push(`/${item.id}`)} />
        )}
      />
    </View>
  );
}
