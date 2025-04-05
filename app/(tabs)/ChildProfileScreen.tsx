import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ChildProfileScreen({ route, navigation }) {
  const { kid } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>{kid.name}’s Profile</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
