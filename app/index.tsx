import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GlobalStyles, Colors } from '@/constants/styles';

const kids = [
  { id: 'Emma', name: 'Emma' },
  { id: 'Neil', name: 'Neil' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text style={GlobalStyles.title}>Kids' Money Tracker</Text>

      <FlatList
        data={kids}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={GlobalStyles.button}
            onPress={() => router.push(`/${item.id}`)}
          >
            <Text style={GlobalStyles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
