import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, createRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  
} from "react-native";
import { auth, db} from '../../../firebaseConfig';
import {updateProfile, updatePassword, signOut} from 'firebase/auth';

  const UpdateScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const firstNameInputRef = createRef();
    const lastNameInputRef = createRef();
    const ageInputRef = createRef();
    const addressInputRef = createRef();
    const emailInputRef = createRef();
    const passwordInputRef = createRef();

    const handleSubmitPress = () => {
        setError("");
        console.log(auth.currentUser.uid)
        const docRef = doc(db, 'Users', auth.currentUser.uid)
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
            alert('Password updated!');
          }).catch((error) => {
              console.log(error);
          });
          signOut(auth).then(() => {
            console.log('Signed out successfully.');
            }).catch((error) => {
            console.log('Error signing out: ' + error);
            });
            AsyncStorage.clear();
            navigation.replace('Auth');
        }
        alert('Account Updated Successfully!');
    }

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
                            placeholder="First Name"
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
                            placeholder="Last Name"
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
                            placeholder="Address"
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
                        activeOpacity={0.5}
                        onPress={() => handleSubmitPress()}>
                        <Text style={styles.buttonTextStyle}>Update Information</Text>
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