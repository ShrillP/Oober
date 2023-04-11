import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { GOOGLE_MAPS_API_KEY } from '@env';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { collection, getDocs, query, where, GeoPoint, doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
import { ScrollView } from 'react-native-gesture-handler';

const CarpoolRequest = ({ route, navigation }) => {
  // const forceUpdate = React.useCallback(() => updateState({}), []);
  const mapRef = useRef(null);
  const { startLat, startLong, startLocationName, endLat, endLong, endLocationName } = route.params;
  const [carpools, setCarpools] = useState([]);

  const handleRequestCarpool = (carpoolSelected) => {
    Alert.alert(
      'Requesting Carpool', 
      'Are you sure you want to request this carpool?', 
      [
        {
          text: 'Cancel',
          onPress: () => { return null; },
          style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () => {
              try {
                if (carpoolSelected) {
                  const carpoolRef = doc(db, 'AvailableCarpools', carpoolSelected.id);
                  updateDoc(carpoolRef, {
                    activeCarpoolers: arrayUnion({
                      name: auth.currentUser.displayName,
                      uid: auth.currentUser.uid,
                    }),
                    isFull: carpoolSelected.activeCarpoolers.length + 1 === carpoolSelected.maxPassengers,
                    isActive: false,
                  });
                  navigation.navigate('Rider Ratings', { 
                    carpoolSelected: carpoolSelected,
                    startName: startLocationName,
                    endName: endLocationName,
                  });
                  Alert.alert(
                    'Carpool Completed',
                    'Your carpool has been completed successfully! We hope you enjoyed your carpool! Please rate the passengers you carpooled with.',
                    [
                      {
                        text: 'OK',
                        onPress: () => { return null; },
                      },
                    ],
                    { cancelable: false }
                  );
                };
              } catch (error) {
                console.log(error);
              }
            },
          },
        ],
        { cancelable: false }
      );
  };

  const getAllCarpools = async () => {
    try {
      const q = query(collection(db, 'AvailableCarpools'), where('startingPoint', '==', new GeoPoint(startLat, startLong)), where('endPoint', '==', new GeoPoint(endLat, endLong)));
      const querySnapshot = await getDocs(q);
      const availableCarpools = querySnapshot.docs.map(doc => doc.data());
      setCarpools(availableCarpools);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCarpools();
  }, []);

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
      <Text style={styles.pageTitle}>Available Carpools from {startLocationName.split(',')[0]} to {endLocationName.split(',')[0]}</Text>
      <ScrollView style={styles.scrollContainer}>
      {carpools.filter(carpool => (!carpool.isFull && carpool.isActive)).map((carpool, index) => {
        return (
          <TouchableOpacity key={index} style={styles.availCarpoolContainer} onPress={() => { handleRequestCarpool(carpool); }}>
            <Text style={styles.carpoolInfoTextTitle}>Carpool {index + 1}</Text>
            <Text style={styles.carpoolInfoText}>Your Fare: ${(carpool.fare / (carpool.activeCarpoolers.length + 1)).toFixed(2)}</Text>
            <Text style={styles.carpoolInfoText}>Seats Available: {carpool.maxPassengers - carpool.activeCarpoolers.length}</Text>
            <Text style={styles.carpoolInfoText}>Emissions Saved: {(carpool.totalEmissions - (carpool.totalEmissions / (carpool.activeCarpoolers.length + 1))).toFixed(2)} g CO2e/km</Text>
          </TouchableOpacity>
        );
        })}
        {(carpools.length === 0 || carpools.filter(carpool => carpool.isActive === true).length === 0) && 
          <Text style={styles.noAvailableCarpools}>There are no available carpools with your desired starting and ending locations.</Text>
        }
      </ScrollView>
    </View>
  )
}

export default CarpoolRequest;

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
  availCarpoolContainer: {
    backgroundColor: '#5FBAA7',
    color: '#2b2b2b',
    height: 95,
    alignItems: 'center',
    borderRadius: 30,
    margin: 10,
    position: 'relative',
  },
  carpoolInfoText: {
    fontSize: 16,
    marginTop: 2,
  },
  carpoolInfoTextTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#A7A8A8',
  },
  noAvailableCarpools: {
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
  },
})