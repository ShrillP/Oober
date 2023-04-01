import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { auth } from '../firebaseConfig';

const getDisplayName = () => {
  const user = auth.currentUser;
  if (user != null) {
    return user.displayName;
  } else {
    return 'User';
  }
};

const HomeScreen = () => {
  return (
    <View style={styles.mainBody}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome, {getDisplayName()}!</Text>
        </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#A7A8A8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '15%',
    backgroundColor: '#5FBAA7',
  },
  headerText: {
    color: '#2b2b2b',
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 10,
    alignItems: 'baseline',
    paddingTop: '20%'
  },
});