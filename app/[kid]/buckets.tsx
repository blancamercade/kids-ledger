import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { GlobalStyles, Colors } from '@/constants/styles';

export default function BucketsScreen() {
  const { kid } = useLocalSearchParams();
  const [buckets, setBuckets] = useState([]);
  const [newBucketName, setNewBucketName] = useState('');

  const storageKey = `buckets-${kid}`;

  useEffect(() => {
    const loadBuckets = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) {
          setBuckets(JSON.parse(stored));
        } else {
          const defaults = [
            { id: '1', name: 'Spend Now', amount: 0 },
            { id: '2', name: 'Save for Something Big', amount: 0 },
            { id: '3', name: 'Gift for Others', amount: 0 },
            { id: '4', name: 'Give', amount: 0 },
          ];
          setBuckets(defaults);
        }
      } catch (e) {
        console.error('Error loading buckets', e);
      }
    };
    loadBuckets();
  }, [kid]);

  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify(buckets));
  }, [buckets]);

  const updateBucket = (id, field, value) => {
    setBuckets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : b))
    );
  };

  const deleteBucket = (id) => {
    Alert.alert('Delete Bucket', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setBuckets((prev) => prev.filter((b) => b.id !== id)),
      },
    ]);
  };

  const addBucket = () => {
    if (!newBucketName.trim()) return;
    const newBucket = {
      id: Date.now().toString(),
      name: newBucketName.trim(),
      amount: 0,
    };
    setBuckets([newBucket, ...buckets]);
    setNewBucketName('');
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text style={GlobalStyles.title}>{kid}’s Buckets</Text>

      <View style={styles.addRow}>
        <TextInput
          placeholder="New bucket name"
          value={newBucketName}
          onChangeText={setNewBucketName}
          style={GlobalStyles.input}
          placeholderTextColor={Colors.subtext}
        />
        <TouchableOpacity onPress={addBucket} style={GlobalStyles.button}>
          <Text style={GlobalStyles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={buckets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bucketCard}>
            <TextInput
              value={item.name}
              onChangeText={(text) => updateBucket(item.id, 'name', text)}
              style={[GlobalStyles.input, { flex: 2, marginRight: 8 }]}
            />
            <TextInput
              value={item.amount.toString()}
              onChangeText={(text) => updateBucket(item.id, 'amount', text)}
              keyboardType="numeric"
              style={[GlobalStyles.input, { width: 80 }]}
            />
            <TouchableOpacity onPress={() => deleteBucket(item.id)}>
              <Text style={{ fontSize: 18, color: Colors.subtext, marginLeft: 10 }}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20, color: Colors.subtext }}>No buckets yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  bucketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
});
