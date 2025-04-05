import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button } from 'react-native';

export default function ChildProfile() {
  const { kid } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>{kid}’s Profile</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}
