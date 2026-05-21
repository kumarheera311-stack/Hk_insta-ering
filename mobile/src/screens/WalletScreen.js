import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { getWalletBalance, getUserEarnings, getTransactionHistory, requestWithdrawal } from '../api/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';

const WalletScreen = () => {
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [balanceRes, earningsRes, transactionsRes] = await Promise.all([
        getWalletBalance(),
        getUserEarnings(),
        getTransactionHistory(),
      ]);
      setBalance(balanceRes.data.walletBalance);
      setEarnings(earningsRes.data.earnings);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 100) {
      Alert.alert('Error', 'Minimum withdrawal amount is ₹100');
      return;
    }

    setWithdrawing(true);
    try {
      await requestWithdrawal(parseFloat(withdrawAmount));
      Alert.alert('Success', 'Withdrawal request submitted');
      setWithdrawAmount('');
      loadWalletData();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Wallet Balance</Text>
          <View style={styles.balanceAmount}>
            <MaterialCommunityIcons name="currency-inr" size={40} color="gold" />
            <Text style={styles.balanceValue}>{balance.toFixed(2)}</Text>
          </View>
        </View>
      </LinearGradient>

      {earnings && (
        <View style={styles.earningsCard}>
          <Text style={styles.cardTitle}>Earnings Summary</Text>
          <View style={styles.earningsGrid}>
            <View style={styles.earningsItem}>
              <MaterialCommunityIcons name="play-circle" size={30} color="#667eea" />
              <Text style={styles.earningsLabel}>Videos</Text>
              <Text style={styles.earningsValue}>₹{earnings.videoEarnings?.toFixed(2)}</Text>
              <Text style={styles.earningsCount}>{earnings.totalVideos || 0} uploads</Text>
            </View>
            <View style={styles.earningsItem}>
              <MaterialCommunityIcons name="image" size={30} color="#764ba2" />
              <Text style={styles.earningsLabel}>Photos</Text>
              <Text style={styles.earningsValue}>₹{earnings.photoEarnings?.toFixed(2)}</Text>
              <Text style={styles.earningsCount}>{earnings.totalPhotos || 0} uploads</Text>
            </View>
          </View>
          <View style={styles.totalEarnings}>
            <Text style={styles.totalLabel}>Total Earnings</Text>
            <Text style={styles.totalValue}>₹{earnings.totalEarnings?.toFixed(2)}</Text>
          </View>
        </View>
      )}

      <View style={styles.withdrawCard}>
        <Text style={styles.cardTitle}>Request Withdrawal</Text>
        <TextInput
          style={styles.withdrawInput}
          placeholder="Amount (minimum ₹100)"
          placeholderTextColor="#999"
          value={withdrawAmount}
          onChangeText={setWithdrawAmount}
          keyboardType="numeric"
          editable={!withdrawing}
        />
        <TouchableOpacity
          style={[styles.withdrawButton, withdrawing && styles.disabledButton]}
          onPress={handleWithdraw}
          disabled={withdrawing}
        >
          {withdrawing ? (
            <ActivityIndicator color="white" />
          ) : (
            <View style={styles.withdrawButtonContent}>
              <MaterialCommunityIcons name="bank-transfer" size={20} color="white" />
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsCard}>
        <Text style={styles.cardTitle}>Transaction History</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <MaterialCommunityIcons
                  name={
                    item.type === 'withdrawal' ? 'bank-transfer' :
                    item.type === 'video_upload' ? 'play-circle' : 'image'
                  }
                  size={24}
                  color="#667eea"
                />
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionType}>
                    {item.type.replace('_', ' ')}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>₹{item.amount}</Text>
                <Text
                  style={[
                    styles.transactionStatus,
                    { color: item.status === 'completed' ? '#4caf50' : '#ff9800' },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    margin: 15,
    borderRadius: 15,
    padding: 25,
    elevation: 5,
  },
  balanceContent: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  earningsCard: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 5,
  },
  earningsLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  earningsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  earningsCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  totalEarnings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  withdrawCard: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  withdrawInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  withdrawButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  withdrawButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  withdrawButtonText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionsCard: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    marginBottom: 30,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionInfo: {
    marginLeft: 12,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionStatus: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default WalletScreen;
