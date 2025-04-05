import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';

const kids = [
  { id: '1', name: 'Emma' },
  { id: '2', name: 'Neil' },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Kids' Money Tracker</Text>
      <FlatList
        data={kids}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            onPress={() => navigation.navigate('ChildProfile', { kid: item })}
          />
        )}
      />
    </View>
  );
}
