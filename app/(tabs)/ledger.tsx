import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles, Colors } from '@/constants/styles';
import { useKid } from '@/context/KidContext';
import { useRouter } from 'expo-router';

export default function LedgerScreen() {
  const { selectedKid } = useKid();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const storageKey = `ledger-${selectedKid}`;

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
    if (selectedKid) loadData();
  }, [selectedKid]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(transactions));
      } catch (e) {
        console.error('Failed to save data', e);
      }
    };
    if (selectedKid) saveData();
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

  if (!selectedKid) {
    return (
      <View style={GlobalStyles.screenContainer}>
        <Text style={GlobalStyles.title}>No Kid Selected</Text>
        <TouchableOpacity onPress={() => router.push('/')} style={GlobalStyles.button}>
          <Text style={GlobalStyles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text style={GlobalStyles.title}>{selectedKid}’s Ledger</Text>
      <Text style={GlobalStyles.balanceText}>Balance: ${getBalance()}</Text>

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={GlobalStyles.input}
        placeholderTextColor={Colors.subtext}
      />
      <TextInput
        placeholder="Amount (e.g. 1 or -5)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="default"
        style={GlobalStyles.input}
        placeholderTextColor={Colors.subtext}
      />

      <TouchableOpacity style={GlobalStyles.button} onPress={addTransaction}>
        <Text style={GlobalStyles.buttonText}>Add Transaction</Text>
      </TouchableOpacity>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionRow}>
            <View style={{ flex: 1 }}>
              <Text style={GlobalStyles.transactionText}>{item.date}</Text>
              <Text style={GlobalStyles.transactionText}>{item.description}</Text>
            </View>
            <Text
              style={[
                GlobalStyles.transactionText,
                {
                  color: item.amount < 0 ? Colors.negative : Colors.positive,
                  fontWeight: 'bold',
                  marginRight: 10,
                },
              ]}
            >
              {item.amount >= 0 ? `+$${item.amount}` : `-$${Math.abs(item.amount)}`}
            </Text>
            <Text
              onPress={() => deleteTransaction(item.id)}
              style={{ color: Colors.subtext, fontSize: 18 }}
            >
              ❌
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20, color: Colors.subtext }}>No transactions yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  transactionRow: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
});
