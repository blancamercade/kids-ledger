import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChildProfile() {
  const { kid } = useLocalSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const storageKey = `ledger-${kid}`;

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(storageKey);
        if (storedData) {
          setTransactions(JSON.parse(storedData));
        }
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };
    loadData();
  }, [kid]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(transactions));
      } catch (e) {
        console.error('Failed to save data', e);
      }
    };
    saveData();
  }, [transactions]);

  const addTransaction = () => {
    if (!description || !amount) return;

    const newTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description,
      amount: parseFloat(amount),
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
  };

  const getBalance = () => {
    return transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{kid}’s Ledger</Text>
      <Text style={styles.balance}>Balance: ${getBalance()}</Text>

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Transaction" onPress={addTransaction} />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <Text>{item.date}</Text>
            <Text>{item.description}</Text>
            <Text>{item.amount >= 0 ? `+$${item.amount}` : `-$${Math.abs(item.amount)}`}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>No transactions yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  balance: { fontSize: 18, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  transaction: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
