import { StyleSheet, Text, Alert, Platform } from 'react-native';
import { auth } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import IonIcons from '@expo/vector-icons/Ionicons';

const CustomDrawerMenu = (props) => {
  return (
    <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label='Sign Out' 
            icon={() => {
                return <IonIcons name='log-out' size={30} color='#2b2b2b' />;
            }}
            onPress={() => {
                Alert.alert(
                    'Sign Out',
                    'Are you sure you want to sign out?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => { return null; },
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                signOut(auth).then(() => {
                                    console.log('Signed out successfully.');
                                }).catch((error) => {
                                    console.log('Error signing out: ' + error);
                                });
                                AsyncStorage.clear();
                                props.navigation.replace('Auth');
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }
        } />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerMenu;