import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import IonIcon from 'react-native-vector-icons/Ionicons';


const finderWidth = 280;
const finderHeight = 280;
const width = Dimensions.get('window').width * 0.93;
const height = Dimensions.get('window').height * 0.85;
const viewMinX = ((width - finderWidth) / 2) * 0.9;
const viewMinY = ((height - finderHeight) / 2) * 0.9;

const ScanQRCode = ({ route, navigation }) => {
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = () => {
    setScanned(true);
    Alert.alert(
        'Offer Carpool Information Loaded',
        'You can now offer your carpool. To see the offer details, click OK.',
        [
            {
                text: 'Cancel',
                onPress: () => { return null; },
                style: 'cancel'
            },
            { 
                text: 'OK', 
                onPress: () => {
                    navigation.navigate('Offer Carpool', route.params);
                }
            },
        ],
        );
    };

    if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
    return <Text>No access to camera</Text>;
    }

    return (
    <View style={styles.container}>
        <Text style={styles.pageTitle}>Scan QR Code to Offer Your Carpool</Text>
        <IonIcon name="camera-outline" size={80} color="#2b2b2b" />
        <Text style={{ fontSize: 18, color: '#2b2b2b' }}>Move your camera to scan the QR code</Text>
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            style={styles.qr}
        >
            <View style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: finderWidth,
                height: finderHeight,
                marginLeft: -finderWidth/2,
                marginTop: -finderHeight/2,
                borderColor: '#5FBAA7',
                borderWidth: 5,
            }} />
        </BarCodeScanner>
        {scanned && (
            <TouchableOpacity 
                style={styles.scanAgainButton} 
                onPress={() => setScanned(false)
            }>
                <Text style={styles.buttonText}>Scan Again</Text>
            </TouchableOpacity>
        )}
    </View>
    );
};

export default ScanQRCode;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A7A8A8',
        alignItems: 'center',
    },
    qr: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '90%',
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2b2b2b',
        marginTop: 20,
    },
    scanAgainButton: {
        backgroundColor: '#5FBAA7',
        width: '80%',
        height: 50,
        borderRadius: 10,
        marginBottom: 50,
    },
    buttonText: {
        color: '#2b2b2b',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10, 
    },
});
