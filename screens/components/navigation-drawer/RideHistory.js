import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';


const RideHistory = () => {
    const [rideHistory, setRideHistory] = useState([]);
    const [savedEmissions, setSavedEmissions] = useState(0);
    const [rating, setRating] = useState(0);

    useEffect(() => {
      const docRef = doc(db, 'Users', auth.currentUser.uid);
      getDoc(docRef).then((doc) => {
          if (doc.exists()) {
              setRideHistory(doc.data().tripsTaken);
              setSavedEmissions(doc.data().savedEmissions.toFixed(2));
              setRating(doc.data().rating.toFixed(2));
          } else {
              console.log('No such document!');
          }
      }).catch((error) => {
          console.log('Error getting document:', error);
      });
    }, []);

  return (
    <View style={styles.mainBody}>
      <Text style={styles.title}>Your Oober Ride History</Text>
      <Text style={styles.info}>Overall Rider Rating: {rating} Stars</Text>
      <Text style={styles.info}>Total Trips Taken: {rideHistory.length}</Text>
      <Text style={styles.info}>Carbon Emissions Saved: {savedEmissions} g CO2e/km</Text>
      <ScrollView>
        {rideHistory.map((trip, index) => (
          <View key={index} style={styles.tripContainer}>
            <Text style={styles.tripInfoTitle}>Trip {index + 1}</Text>
            <Text style={styles.tripInfo}>
              <Text style={{fontWeight: 'bold'}}>From: </Text>{trip.startName.split(',')[0]}
            </Text>
            <Text style={styles.tripInfo}>
              <Text style={{fontWeight: 'bold'}}>To: </Text>{trip.endName.split(',')[0]}
            </Text>
            <Text style={styles.tripInfo}>
              <Text style={{fontWeight: 'bold'}}>Fare: </Text>${trip.fare.toFixed(2)}
            </Text>
            <Text style={styles.tripInfo}>
              <Text style={{fontWeight: 'bold'}}>Carbon Emissions Saved: </Text>{trip.emissionsSaved.toFixed(2)} g CO2e/km
            </Text>
          </View>
        ))}
        {rideHistory.length === 0 && (
          <Text style={{fontSize: 18, textAlign: 'center', marginTop: 20}}>
            You have not taken any trips yet.
          </Text>
        )}  
      </ScrollView>
    </View>
  );
};

export default RideHistory;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#A7A8A8',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  info: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  tripContainer: {
    backgroundColor: '#E5E5E5',
    marginTop: 20,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  tripInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tripInfo: {
    fontSize: 16,
    textAlign: 'center',
  },
});