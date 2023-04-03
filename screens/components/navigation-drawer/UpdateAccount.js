import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, createRef, } from "react";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { auth, db } from '../../../firebaseConfig';
import {updateProfile, updatePassword, signOut, deleteUser } from 'firebase/auth';

  const UpdateScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const firstNameInputRef = createRef();
    const lastNameInputRef = createRef();
    const ageInputRef = createRef();
    const addressInputRef = createRef();
    const emailInputRef = createRef();
    const passwordInputRef = createRef();

    const docRef = doc(db, 'Users', auth.currentUser.uid);
    const [oldFirstName, setOldFirstName] = useState('');
    const [oldLastName, setOldLastName] = useState('');
    const [oldAddress, setOldAddress] = useState('');
    getDoc(docRef).then((docSnap) => {
      setOldFirstName(docSnap.data().firstName);
      setOldLastName(docSnap.data().lastName);
      setOldAddress(docSnap.data().address);
    });

    const handleSubmitPress = () => {
        setError("");
        if (firstName) {
          updateDoc(docRef, {
            firstName: firstName
          });
          updateProfile(auth.currentUser, {
            displayName: firstName,
          });
        }
        if (lastName) {
          updateDoc(docRef, {
            lastName: lastName
          });
        }
        if (address) {
          updateDoc(docRef, {
            address: address
          });
        }
        if (password){
          updatePassword(auth.currentUser, password).then(() => {
            Alert.alert(
              'Password and account details updated!',
              'Click OK to sign out and login with your new password.',
              [
                {
                  text: 'OK',
                  onPress: () => { 
                    signOut(auth).then(() => {
                      console.log('Signed out successfully.');
                    }).catch((error) => {
                      console.log('Error signing out: ' + error);
                    });
                    AsyncStorage.clear();
                    navigation.replace('Auth');
                   },
                },
              ],
              { cancelable: false }
            );
          }).catch((e) => {
            if (e.code === 'auth/weak-password') {
              setError('Password was not changed since it was too weak!');
            } else {
              setError('Something went wrong, please try again later!');
            }
          });
        } else {
          Alert.alert(
            'Account Updated',
            'Your account has been updated successfully.',
            [
              {
                text: 'OK',
                onPress: () => { navigation.replace('HomeScreen') },
              },
            ],
            { cancelable: false }
          );
        }
    };

    const handleDeletePress = () => {
      setError("");
      const user = auth.currentUser;
      Alert.alert(
              'Delete Account Confirmation',
              'Are you sure you want to delete your Oober account?',
              [
                {
                  text: 'Cancel',
                  onPress: () => { return null; },
                  style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                      // Delete a user from firestore
                      deleteDoc(docRef)
                      .then(() => {
                        // Delete a user from firebase auth
                        deleteUser(user).then(() => {
                          AsyncStorage.clear();
                          navigation.replace('Auth');
                          alert ('Account Deleted Successfully!');
                        }).catch((error) => {
                          console.log(error);
                        });
                      })
                      .catch(error => {
                          console.log(error);
                          alert ('Something went wrong, please try again later!');
                      });
                    },
                },
              ],
              { cancelable: false }
            );
    };

    return (
        <SafeAreaView style={styles.mainBody}>
            <ScrollView
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                    <View>
                      <Text style={styles.headerStyle}>Update Account</Text>
                      <Text style={styles.contentStyle}>Please fill in the fields you wish to change</Text>
                    </View>
                <KeyboardAvoidingView enabled>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={firstName => setFirstName(firstName)}
                            underlineColorAndroid="#f000"
                            placeholder={"Current First Name: " + oldFirstName}
                            placeholderTextColor="#2b2b2b"
                            autoCapitalize="sentences"
                            returnKeyType="next"
                            ref={firstNameInputRef}
                            onSubmitEditing={() =>
                                lastNameInputRef.current &&
                                lastNameInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={lastName => setLastName(lastName)}
                            underlineColorAndroid="#f000"
                            placeholder={"Current Last Name: " + oldLastName}
                            placeholderTextColor="#2b2b2b"
                            autoCapitalize="sentences"
                            returnKeyType="next"
                            ref={lastNameInputRef}
                            onSubmitEditing={() =>
                                ageInputRef.current &&
                                ageInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={address => setAddress(address)}
                            underlineColorAndroid="#f000"
                            placeholder={"Current Address: " + oldAddress}
                            placeholderTextColor="#2b2b2b"
                            autoCapitalize="sentences"
                            returnKeyType="next"
                            ref={addressInputRef}
                            onSubmitEditing={() =>
                                emailInputRef.current &&
                                emailInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={password => setPassword(password)}
                            underlineColorAndroid="#f000"
                            placeholder="Password"
                            placeholderTextColor="#2b2b2b"
                            keyboardType="default"
                            ref={passwordInputRef}
                            onSubmitEditing={Keyboard.dismiss}
                            blurOnSubmit={false}
                            secureTextEntry={true}
                        />
                    </View>
                    {error !== '' ? (
                        <Text style={styles.errorTextStyle}>
                            {error}
                        </Text>
                    ) : null}
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        actirveOpacity={0.5}
                        onPress={() => handleSubmitPress()}>
                        <Text style={styles.buttonTextStyle}>Update Information</Text>
                    </TouchableOpacity>

                    {/* Delete Account  */}
                    <TouchableOpacity
                        style={styles.deleteButtonStyle}
                        actirveOpacity={0.5}
                        onPress={() => handleDeletePress()}>
                        <Text style={styles.buttonTextStyle}>Delete Account</Text>
                    
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
      );
    };

    const styles = StyleSheet.create({
        mainBody: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#A7A8A8',
            alignContent: 'center',
            alignSelf: 'stretch',
        },
        sectionStyle: {
            flexDirection: 'row',
            height: 40,
            margin: 5,
        },
        buttonStyle: {
            backgroundColor: '#5FBAA7',
            borderWidth: 0,
            color: '#2b2b2b',
            height: 43,
            alignItems: 'center',
            borderRadius: 30,
            marginLeft: 35,
            marginRight: 35,
            marginTop: 20,
            marginBottom: 20,
        },
        buttonTextStyle: {
            color: '#2b2b2b',
            paddingVertical: 10,
            fontSize: 16,
            fontWeight: 'bold',
        },
        // Delete Account Button
        deleteButtonStyle: {
          backgroundColor: '#ff312e',
          borderWidth: 0,
          color: '#2b2b2b',
          height: 43,
          alignItems: 'center',
          borderRadius: 30,
          marginLeft: 35,
          marginRight: 35,
          marginTop: 20,
          marginBottom: 20,
        },
        inputStyle: {
            flex: 1,
            color: '#2b2b2b',
            paddingLeft: 15,
            paddingRight: 15,
            borderWidth: 1,
            borderRadius: 30,
            borderColor: 'white',
            flexDirection: 'row',
            height: 40,
            margin: 5,
        },
        errorTextStyle: {
            color: 'red',
            textAlign: 'center',
            fontSize: 14,
        },
        headerStyle:{
          color: 'black',
          fontWeight: 'bold',
          fontSize: 36,
          textAlign: 'center',
        },
        contentStyle:{
          fontSize: 18,
          textAlign: 'center',
          paddingVertical: 15,
        }
    }
    );

export default UpdateScreen;