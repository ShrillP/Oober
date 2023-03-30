import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const Auth = () => {
  return (
    <Stack.Navigator initialRouteName='LoginScreen'>
      <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='RegisterScreen'
        component={RegisterScreen} 
        options={{
          title: 'Register',
          headerStyle: {
            backgroundColor: '#5FBAA7',
          },
          headerTintColor: '#2b2b2b',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Auth'>
        <Stack.Screen name='Auth' component={Auth} options={{ headerShown: false }}/>
        <Stack.Screen name='HomeScreen' component={HomeScreen} 
          options={{
            title: 'Home',
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
