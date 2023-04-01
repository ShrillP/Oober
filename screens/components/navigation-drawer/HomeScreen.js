import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const HomeScreen = () => {
  return (
    <View style={styles.mainBody}>
        <View style={styles.body}>
            <Text>Stuff will go here</Text> 
        </View>
        <View style={styles.container}>
            <MapView provider={PROVIDER_GOOGLE} style={styles.map}/>
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
        flex: 0.5,
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