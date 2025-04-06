import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { GlobalStyles, Colors } from '@/constants/styles';
import { PieChart } from 'react-native-chart-kit';

export default function BucketsScreen() {
  const { kid } = useLocalSearchParams();
  const [buckets, setBuckets] = useState([]);
  const [ledgerTotal, setLedgerTotal] = useState(0);
  const [newBucketName, setNewBucketName] = useState('');
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const storageKey = `buckets-${kid}`;
  const ledgerKey = `ledger-${kid}`;
  const chartColors = ['#00bfa6', '#ffcc00', '#ff8a65', '#7986cb', '#4dd0e1', '#a1887f'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const ledgerData = await AsyncStorage.getItem(ledgerKey);
        const parsedLedger = ledgerData ? JSON.parse(ledgerData) : [];
        const total = parsedLedger.reduce((sum, t) => sum + t.amount, 0);
        setLedgerTotal(total);

        const storedBuckets = await AsyncStorage.getItem(storageKey);
        if (storedBuckets) {
          setBuckets(JSON.parse(storedBuckets));
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
        console.error('Error loading data', e);
      }
    };
    loadData();
  }, [kid]);

  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify(buckets));
  }, [buckets]);

  const updateBucket = (id, field, value) => {
    setBuckets((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : b
      )
    );
  };

  const deleteBucket = (id) => {
    setBuckets((prev) => prev.filter((b) => b.id !== id));
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

  const openEditModal = (bucket) => {
    setSelectedBucket(bucket);
    setEditAmount(bucket.amount.toString());
    setModalVisible(true);
  };

  const saveEditAmount = () => {
    updateBucket(selectedBucket.id, 'amount', editAmount);
    setModalVisible(false);
  };

  const allocated = buckets.reduce((sum, b) => sum + b.amount, 0);
  const unallocated = ledgerTotal - allocated;

  const chartData = [
    ...buckets.map((b, index) => ({
      name: b.name,
      population: b.amount,
      color: chartColors[index % chartColors.length],
      legendFontColor: Colors.text,
      legendFontSize: 12,
      onPress: () => openEditModal(b),
    })),
    {
      name: 'Unallocated',
      population: unallocated,
      color: '#cccccc',
      legendFontColor: Colors.text,
      legendFontSize: 12,
    },
  ];

  return (
    <KeyboardAvoidingView
      style={GlobalStyles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={GlobalStyles.title}>{kid}’s Buckets</Text>

      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => Colors.primary,
            propsForLabels: {
              fontSize: '10',
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"
          center={[0, 0]}
          absolute
          hasLegend={true}
        />
        <Text style={{ position: 'absolute', fontSize: 18, fontWeight: 'bold', color: Colors.text }}>
          ${ledgerTotal.toFixed(2)}
        </Text>
      </View>

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
        keyboardShouldPersistTaps="handled"
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

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={GlobalStyles.title}>Edit "{selectedBucket?.name}"</Text>
            <TextInput
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="numeric"
              style={GlobalStyles.input}
            />
            <TouchableOpacity onPress={saveEditAmount} style={GlobalStyles.button}>
              <Text style={GlobalStyles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: Colors.subtext }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
    width: '100%',
  },
});
