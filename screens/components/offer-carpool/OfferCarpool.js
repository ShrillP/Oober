import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState, useRef } from 'react'
import { GOOGLE_MAPS_API_KEY } from '@env';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Slider from '@react-native-community/slider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { collection, getCountFromServer, doc, setDoc, GeoPoint } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

const OfferCarpool = ({ route, navigation }) => {
  const {
    startLat,
    startLong,
    startLocationName,
    endLat,
    endLong,
    endLocationName,
    distance,
    duration,
    fare
  } = route.params;
  const mapRef = useRef(null);
  const [maxPassengerSliderValue, setMaxPassengerSliderValue] = useState(0);

  const handleOfferSubmission = async () => {
    const carpoolData = await getCountFromServer(collection(db, 'AvailableCarpools'));
    const carpoolID = 'carpool' + (carpoolData.data().count + 1);
    Alert.alert(
      'Offering Carpool',
      'Are you sure you want to offer this carpool?',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            try {
              setDoc(doc(db, 'AvailableCarpools', carpoolID), {
                id: carpoolID,
                activeCarpoolers: [auth.currentUser.displayName],
                maxPassengers: maxPassengerSliderValue + 1,
                isActive: true,
                isFull: false,
                fare: fare,
                distance: distance,
                totalEmissions: (186 * distance).toFixed(2),
                startingPoint: new GeoPoint(startLat, startLong),
                endingPoint: new GeoPoint(endLat, endLong),
              });
              navigation.replace('HomeScreen');
              Alert.alert(
                'Carpool Offered',
                'Your carpool has been offered successfully!',
                [
                  {
                    text: 'OK',
                    onPress: () => { },
                    style: 'cancel',
                  },
                ],
                { cancelable: false }
              );
            } catch (error) {
              console.log(error);
              Alert.alert(
                'Error',
                'There was an error offering your carpool. Please try again.',
                [
                  {
                    text: 'OK',
                    onPress: () => { },
                    style: 'cancel',
                  },
                ],
                { cancelable: false }
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.mainBody}>
      <View style={{ flex: 1, backgroundColor: '#A7A8A8' }}>
      <MapView 
        provider={PROVIDER_GOOGLE} 
        style={styles.map} 
        pitchEnabled={false}
        rotateEnabled={false}
        zoomEnabled={false}
        scrollEnabled={false}
        ref={mapRef}
      >
        <Marker
          coordinate={{ latitude: startLat, longitude: startLong }}
          title={startLocationName}
          pinColor={"#5FD365"}
        />
        <Marker
          coordinate={{ latitude: endLat, longitude: endLong }}
          title={endLocationName}
        />
        <MapViewDirections
          origin={{ latitude: startLat, longitude: startLong }}
          destination={{ latitude: endLat, longitude: endLong }}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={5}
          strokeColor="blue"
          onReady={() => {
            mapRef.current.fitToCoordinates([{ latitude: startLat, longitude: startLong }, { latitude: endLat, longitude: endLong }], {
              edgePadding: {
                right: 15,
                bottom: 10,
                left: 15,
                top: 10,
              },
            });
          }}
        />
      </MapView>
      </View>
      <Text style={styles.pageTitle}>Carpool Offer Information</Text>
      <View style={styles.tripContainer}>
        <Text style={styles.tripInfo}>
          <Text style={{fontWeight: 'bold'}}>From: </Text>{startLocationName.split(',')[0]}
        </Text>
        <Text style={styles.tripInfo}>
          <Text style={{fontWeight: 'bold'}}>To: </Text>{endLocationName.split(',')[0]}
        </Text>
        <Text style={styles.tripInfo}>
          <Text style={{fontWeight: 'bold'}}>Distance: </Text>{distance.toFixed(2)} km
        </Text>
        <Text style={styles.tripInfo}>
          <Text style={{fontWeight: 'bold'}}>Duration: </Text>{duration.toFixed(0)} min
        </Text>
        <Text style={styles.tripInfo}>
          <Text style={{fontWeight: 'bold'}}>Your Estimated Fare: </Text>${(fare / (maxPassengerSliderValue + 1)).toFixed(2)}
        </Text>
      </View>
      <Text style={styles.pageTitle}>Modify Your Offer Details</Text>
      <View style={styles.tripContainer}>
        <Text style={styles.tripInfo}>
          <Text style={{fontWeight: 'bold'}}>Maximum Passengers: </Text>{maxPassengerSliderValue}
        </Text>
        <Slider
          style={{width: 300, height: 40, alignSelf: 'center'}}
          minimumValue={0}
          maximumValue={6}
          step={1}
          minimumTrackTintColor="#2b2b2b"
          maximumTrackTintColor="#000000"
          thumbTintColor="#5FBAA7"
          value={maxPassengerSliderValue}
          onValueChange={(value) => setMaxPassengerSliderValue(value)}
        />
        <Text style={styles.tripInfo}>
          <Text style={{fontWeight: 'bold'}}>Your Potential Savings: </Text>${(fare - (fare / (maxPassengerSliderValue + 1))).toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity style={styles.buttonStyle} onPress={handleOfferSubmission}>
        <Text style={styles.buttonTextStyle}>Submit Carpool Offer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OfferCarpool;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#A7A8A8',
  },
  map: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  tripContainer: {
    backgroundColor: '#E5E5E5',
    marginTop: 0,
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
  buttonStyle: {
    backgroundColor: '#5FBAA7',
    borderWidth: 0,
    color: '#2b2b2b',
    height: 43,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonTextStyle: {
    color: '#2b2b2b',
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});