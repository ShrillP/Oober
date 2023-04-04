import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@env';
import MapViewDirections from 'react-native-maps-directions';

const HomeScreen = () => {
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

    return (
        <View style={styles.mainBody}>
            <View style={styles.container}>
            <View style={{ position: 'absolute', width: '100%', zIndex: 9999, top: 10, alignItems: 'center' }}>
                <GooglePlacesAutocomplete
                    istViewDisplayed='false'
                    fetchDetails={true}
                    placeholder='Enter Starting Location'
                    onPress={setStartingLocation}
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
                    />
                </View>
                <View style={{ position: 'absolute', width: '100%', zIndex: 100, top: 65, alignItems: 'center' }}>
                    <GooglePlacesAutocomplete
                    istViewDisplayed='false'
                    fetchDetails={true}
                    onPress={setEndingLocation}
                    placeholder='Enter Destination'
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
                    />
                </View>
                <MapView provider={PROVIDER_GOOGLE} style={styles.map}
                    initialRegion={region}
                    animateToRegion={region}
                    onRegionChangeComplete={(region) => setRegion(region)}
                    ref={mapRef}
                >
                    {startLocation && (
                        <Marker
                            coordinate={startLocation}
                            title="Start Location"
                            description={startLocationName}
                            pinColor={'#5FD365'}
                        />
                    )}
                    {endLocation && (
                        <Marker
                            coordinate={endLocation}
                            title="End Location"
                            description={endLocationName}
                        />
                    )}
                    {startLocation && endLocation && (
                        <MapViewDirections
                            origin={startLocation}
                            destination={endLocation}
                            apikey={GOOGLE_MAPS_API_KEY}
                            strokeWidth={5}
                            strokeColor="blue"
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
            <View style={styles.body}>
                <Text>Home Screen</Text>
            </View>
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
        flex: 0.4,
        backgroundColor: '#A7A8A8',
        alignItems: 'center',
        justifyContent: 'center',
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
});