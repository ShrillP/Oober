import React, { useState, createRef } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { AUTH_DOMAIN } from '@env';

const RegisterScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
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
        if (!firstName) {
            alert('Please fill in First Name field!');
            return;
        }
        AsyncStorage.setItem('firstName', JSON.stringify(firstName));
        if (!lastName) {
            alert('Please fill in Last Name field!');
            return;
        }
        AsyncStorage.setItem('lastName', JSON.stringify(lastName));
        if (!age) {
            alert('Please fill in Age field!');
            return;
        }
        AsyncStorage.setItem('age', JSON.stringify(age));
        if (!address) {
            alert('Please fill in Address field!');
            return;
        }
        AsyncStorage.setItem('address', JSON.stringify(address));
        if (!email) {
            alert('Please fill in Email field!');
            return;
        }
        AsyncStorage.setItem('email', JSON.stringify(email));
        if (!password) {
            alert('Please fill in Password field!');
            return;
        }
        AsyncStorage.setItem('password', JSON.stringify(password));
        createUserWithEmailAndPassword(auth, email, password) 
        .then((user) => {
            sendEmailVerification(user.user, {
                handleCodeInApp: true,
                url: `https://${AUTH_DOMAIN}`,
            })
            .then(() => {
                alert('Registration successful! Email Verification Sent!');
                navigation.navigate('LoginScreen');
         })
        .catch((error) => {
            console.log(error);
            if (error.code === 'auth/email-already-in-use') {
                setError('That email address is already in use!');
            } else if (error.code === 'auth/invalid-email') {
                setError('That email address is invalid!');
            } else if (error.code === 'auth/weak-password') {
                setError('Password is too weak!');
            } else {
                setError('Something went wrong, please try again later!');
            }
        });
        updateProfile(auth.currentUser, {
            displayName: firstName,
        });
        setDoc(doc(db, 'Users', auth.currentUser.uid), {
            firstName: firstName,
            lastName: lastName,
            age: age,
            address: address,
            email: email,
            uuid: user.user.uid,
        });
    })};

    return (
    <SafeAreaView style={styles.mainBody}>
        <ScrollView
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                alignContent: 'center',
            }}>
            <View style={{alignItems: 'center'}}>
                <Image
                    source={require('../assets/registrationicon.png')}
                    style={{
                        width: '100%',
                        resizeMode: 'contain',
                    }}
                />
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
                        onChangeText={age => setAge(age)}
                        underlineColorAndroid="#f000"
                        placeholder="Age"
                        placeholderTextColor="#2b2b2b"
                        keyboardType="numeric"
                        returnKeyType="next"
                        ref={ageInputRef}
                        onSubmitEditing={() =>
                            addressInputRef.current &&
                            addressInputRef.current.focus()
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
                        onChangeText={email => setEmail(email)}
                        underlineColorAndroid="#f000"
                        placeholder="Email"
                        placeholderTextColor="#2b2b2b"
                        keyboardType="email-address"
                        returnKeyType="next"
                        ref={emailInputRef}
                        onSubmitEditing={() =>
                            passwordInputRef.current &&
                            passwordInputRef.current.focus()
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
                    <Text style={styles.buttonTextStyle}>Register</Text>
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
});

export default RegisterScreen;