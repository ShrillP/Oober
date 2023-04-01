import { 
    KeyboardAvoidingView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    Keyboard, 
    Image, 
    ScrollView, 
    SafeAreaView 
} from 'react-native'
import React, { useState, createRef } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const passwordInputRef = createRef();

    const handleSubmitPress = () => {
        setError("");
        if (!email) {
            alert('Please fill in Email field!');
            return;
        }
        if (!password) {
            alert('Please fill in Password field!');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then((user) => {
                if (user.user.emailVerified) {
                    navigation.replace('HomeScreen');
                } else {
                    alert('Please verify your email before logging in! The email may be in your spam folder.');
                }
            })
            .catch(error => {
                console.log(error);
                if (error.code === 'auth/email-already-in-use') {
                    setError('That email address is already in use!');
                } else if (error.code === 'auth/invalid-email') {
                    setError('That email address is invalid!');
                } else {
                    setError('Something went wrong, please try again later!');
                }
            }
        );
    };

  return (
    <SafeAreaView style={styles.mainBody}>
        <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
            }}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('../assets/applogo.png')}
                    style={{
                        width: '75%',
                        resizeMode: 'contain',
                    }}
                />
                </View>
                <KeyboardAvoidingView enabled>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={email => setEmail(email)}
                            placeholder="Email"
                            placeholderTextColor="#2b2b2b"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                passwordInputRef.current &&
                                passwordInputRef.current.focus()
                            }
                            underlineColorAndroid="#f000"
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={styles.sectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={password => setPassword(password)}
                            placeholder="Password"
                            placeholderTextColor="#2b2b2b"
                            keyboardType="default"
                            ref={passwordInputRef}
                            onSubmitEditing={Keyboard.dismiss}
                            blurOnSubmit={false}
                            secureTextEntry={true}
                            underlineColorAndroid="#f000"
                            returnKeyType="next"
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
                        onPress={handleSubmitPress}
                    >
                        <Text style={styles.buttonTextStyle}>Login</Text>
                    </TouchableOpacity>
                    <Text
                        style={styles.registerTextStyle}>
                        Not a member? <Text onPress={() => navigation.navigate('RegisterScreen')} style={styles.registerLink}>Register</Text>
                    </Text>
                </KeyboardAvoidingView>
        </ScrollView>
    </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#acacac',
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
        height: 45,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 25,
    },
    buttonTextStyle: {
        color: '#2b2b2b',
        paddingVertical: 10,
        fontSize: 18,
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
    },
    registerTextStyle: {
        color: '#2b2b2b',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'center',
        padding: 10,
    },
    registerLink: {
        color: '#2b2b2b',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'center',
        padding: 10,
        textDecorationLine: 'underline',
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
});