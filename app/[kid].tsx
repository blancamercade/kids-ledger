import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
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
    const numericAmount = parseFloat(amount);
    if (!description || isNaN(numericAmount)) return;

    const newTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description,
      amount: numericAmount,
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
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
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Amount (e.g. 1 or -5)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="default"
        style={styles.input}
        placeholderTextColor="#888"
      />
      <Button title="Add Transaction" onPress={addTransaction} />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <View style={{ flex: 1 }}>
              <Text style={styles.transactionText}>{item.date}</Text>
              <Text style={styles.transactionText}>{item.description}</Text>
            </View>
            <Text
              style={[
                styles.transactionText,
                {
                  color: item.amount < 0 ? 'red' : 'green',
                  fontWeight: 'bold',
                  marginRight: 10,
                },
              ]}
            >
              {item.amount >= 0 ? `+$${item.amount}` : `-$${Math.abs(item.amount)}`}
            </Text>
            <Text
              onPress={() => deleteTransaction(item.id)}
              style={{ color: 'gray', fontSize: 18 }}
            >
              ❌
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20, color: '#444' }}>No transactions yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'black' },
  balance: { fontSize: 18, marginBottom: 20, color: 'black' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black',
  },
  transaction: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionText: {
    color: 'black',
  },
});
