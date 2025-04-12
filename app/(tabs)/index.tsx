import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { GlobalStyles, Colors } from '@/constants/styles';
import { useKid } from '@/context/KidContext';

const STORAGE_KEY = 'kids-list';

export default function HomeScreen() {
  const router = useRouter();
  const { setSelectedKid } = useKid(); // ✅ called correctly here
  const [kids, setKids] = useState([]);
  const [newKid, setNewKid] = useState('');

  useEffect(() => {
    const loadKids = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setKids(JSON.parse(stored));
        } else {
          const defaultKids = [
            { id: 'Emma', name: 'Emma' },
            { id: 'Neil', name: 'Neil' },
          ];
          setKids(defaultKids);
        }
      } catch (e) {
        console.error('Failed to load kids:', e);
      }
    };
    loadKids();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(kids));
  }, [kids]);

  const addKid = () => {
    const trimmed = newKid.trim();
    if (!trimmed || kids.find((k) => k.id === trimmed)) return;
    const newEntry = { id: trimmed, name: trimmed };
    setKids((prev) => [...prev, newEntry]);
    setNewKid('');
  };

  const confirmRemoveKid = (id) => {
    Alert.alert(
      'Delete Kid',
      `Are you sure you want to delete ${id}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setKids((prev) => prev.filter((kid) => kid.id !== id)),
        },
      ]
    );
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text style={GlobalStyles.title}>Kids' Money Tracker</Text>

      <FlatList
        data={kids}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 20 }}
        renderItem={({ item }) => (
          <View style={styles.kidRow}>
            <TouchableOpacity
              style={[GlobalStyles.button, { flex: 1 }]}
              onPress={() => {
                setSelectedKid(item.id);
                router.push('/ledger');
              }}
            >
              <Text style={GlobalStyles.buttonText}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmRemoveKid(item.id)}>
              <Text style={{ fontSize: 18, marginLeft: 12, color: Colors.subtext }}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.addRow}>
        <TextInput
          placeholder="Add new kid"
          value={newKid}
          onChangeText={setNewKid}
          style={GlobalStyles.input}
          placeholderTextColor={Colors.subtext}
        />
        <TouchableOpacity onPress={addKid} style={GlobalStyles.button}>
          <Text style={GlobalStyles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
