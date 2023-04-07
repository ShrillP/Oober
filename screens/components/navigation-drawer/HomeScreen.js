import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@env';
import MapViewDirections from 'react-native-maps-directions';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HomeScreen = ({navigation}) => {
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [region, setRegion] = useState(
        {
            latitude: 43.262920,
            longitude: -79.919410,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
    );
    const [startLocation, setStartLocation] = useState(null); //Long and Lat
    const [startLocationName, setStartLocationName] = useState(''); // Name of starting location
    const [endLocation, setEndLocation] = useState(null); //Long and Lat
    const [endLocationName, setEndLocationName] = useState(''); // Name of ending location
    const [distance, setDistance] = useState(0); // Distance between start and end location
    const [duration, setDuration] = useState(0); // Duration between start and end location
    const [fare, setFare] = useState(0); // Fare between start and end location
    const mapRef = React.useRef(null);

    const setStartingLocation = (data, details = null) => {
        setStartLocationName(data.description);
        setStartLocation({
            longitude: details.geometry.location.lng,
            latitude: details.geometry.location.lat,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    };

    const setEndingLocation = (data, details = null) => {
        setEndLocationName(data.description);
        setEndLocation({
            longitude: details.geometry.location.lng,
            latitude: details.geometry.location.lat,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    };

    const handleRequestCarpool = () => {
        if (startLocation == null || endLocation == null) {
            alert('Please enter a starting location and destination!');
        }
        if (startLocation != null && endLocation != null) {
            navigation.navigate('Carpool Request', {
                startLat: startLocation.latitude,
                startLong: startLocation.longitude,
                startLocationName: startLocationName,
                endLat: endLocation.latitude,
                endLong: endLocation.longitude,
                endLocationName: endLocationName,
            });
        }
    };

    const handleOfferCarpool = () => {
        if (startLocation == null || endLocation == null) {
            alert('Please enter a starting location and destination!');
        }
        if (startLocation != null && endLocation != null) {
            navigation.navigate('Scan QR Code', {
                startLat: startLocation.latitude,
                startLong: startLocation.longitude,
                startLocationName: startLocationName,
                endLat: endLocation.latitude,
                endLong: endLocation.longitude,
                endLocationName: endLocationName,
                distance: distance,
                duration: duration,
                fare: fare,
            });
        }
    };

    return (
        <View style={styles.mainBody}>
            <View style={styles.container}>
            <View style={{ position: 'absolute', width: '100%', zIndex: 9999, top: 10, alignItems: 'center' }}>
                <GooglePlacesAutocomplete
                    istViewDisplayed='false'
                    fetchDetails={true}
                    placeholder='Enter Starting Location'
                    onPress={setStartingLocation}
                    textInputProps={{
                        onChangeText: (text) => {
                            if (!text) {
                                setStartLocation(null);
                            }
                            setStartLocationName(text);
                        },
                    }}
                    styles={{
                        textInputContainer: {
                            width: '90%',
                            borderRadius: 5,
                            marginHorizontal: 10,
                        },
                        listView: {
                            backgroundColor: '#eee',
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: '#eee',
                            marginHorizontal: 10,
                            elevation: 3,
                        },
                        searchContainer: {
                            flex: 1,
                            width: '100%',
                            justifyContent: 'center',
                            top: 20,
                            zIndex: 100,
                            elevation: 3,
                            paddingHorizontal: 15,
                        },
                    }} 
                    query={{
                        key: GOOGLE_MAPS_API_KEY,
                    }}
                    enablePoweredByContainer={false}
                    />
                </View>
                <View style={{ position: 'absolute', width: '100%', zIndex: 100, top: 65, alignItems: 'center' }}>
                    <GooglePlacesAutocomplete
                    istViewDisplayed='false'
                    fetchDetails={true}
                    onPress={setEndingLocation}
                    placeholder='Enter Destination'
                    textInputProps={{
                        onChangeText: (text) => {
                            if (!text) {
                                setEndLocation(null);
                            }
                            setEndLocationName(text);
                        },
                    }}
                    styles={{
                        textInputContainer: {
                            width: '90%',
                            borderRadius: 5,
                            marginHorizontal: 10,
                        },
                    }} 
                    query={{
                        key: GOOGLE_MAPS_API_KEY,
                    }}
                    enablePoweredByContainer={false}
                    />
                </View>
                <MapView provider={PROVIDER_GOOGLE} style={styles.map}
                    initialRegion={region}
                    animateToRegion={region}
                    onRegionChangeComplete={(region) => setRegion(region)}
                    ref={mapRef}
                >
                    {startLocation ? (
                        <Marker
                            coordinate={startLocation}
                            title="Start Location"
                            description={startLocationName}
                            pinColor={'#5FD365'}
                        />
                    ) : null}
                    {endLocation ? (
                        <Marker
                            coordinate={endLocation}
                            title="End Location"
                            description={endLocationName}
                        />
                    ) : null}
                    {startLocation && endLocation && (
                        <MapViewDirections
                            origin={startLocation}
                            destination={endLocation}
                            apikey={GOOGLE_MAPS_API_KEY}
                            strokeWidth={5}
                            strokeColor="blue"
                            onReady={(result) => {
                                const baseFare = 4.90;
                                setDistance(result.distance);
                                setDuration(result.duration);
                                setFare(baseFare + (1.8 * result.distance));
                            }}
                        />
                    )}
                    {startLocation && endLocation && (
                        mapRef.current.fitToCoordinates([startLocation, endLocation], {
                            edgePadding: {
                                right: 50,
                                bottom: 50,
                                left: 50,
                                top: 150,
                            },
                            animated: true,
                        })
                    )}
                </MapView>
            </View>
            <Text style={styles.tripInfoHeaderText}>Trip Information</Text>
            <View style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.tripInfoRow}>
                    <Text style={styles.tripInfoText}>Distance: {distance ? distance.toFixed(2) : 0} km</Text>
                    <Text style={styles.tripInfoText}>Duration: {duration ? duration.toFixed(0) : 0} min</Text>
                    <Text style={styles.tripInfoText}>Fare: ${fare ? fare.toFixed(2) : 0}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.buttonStyle} onPress={handleRequestCarpool}>
                <Text style={styles.buttonTextStyle}>Request Carpool</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={handleOfferCarpool}>
                <Text style={styles.buttonTextStyle}>Offer Carpool</Text>
            </TouchableOpacity>
        </View>
  );
};

export default HomeScreen

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        backgroundColor: '#A7A8A8',
    },
    body: {
        flex: 0.3,
        backgroundColor: '#A7A8A8',
        alignItems: 'center',
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
      container: {
        flex: 1,
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
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
    tripInfoHeaderText: {
        color: '#2b2b2b',
        fontSize: 30,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 5,
    },
    tripInfoRow: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    tripInfoText: {
        color: '#2b2b2b',
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 5,
    },
});