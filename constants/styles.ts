import { StyleSheet } from 'react-native';

export const Colors = {
  background: '#f8fafa',
  card: '#ffffff',
  primary: '#00bfa6',
  accent: '#ffd700',
  text: '#333333',
  subtext: '#888888',
  border: '#e0e0e0',
  positive: '#4caf50',
  negative: '#f44336',
};

export const GlobalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.subtext,
    marginBottom: 4,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  transactionText: {
    fontSize: 16,
    color: Colors.text,
  },
});
