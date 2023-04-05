import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './components/navigation-drawer/HomeScreen';
import UpdateAccount from './components/navigation-drawer/UpdateAccount';
import CarpoolRequest from './components/CarpoolRequest';
import { auth } from '../firebaseConfig';
import CustomDrawerMenu from './components/navigation-drawer/CustomDrawerMenu';
import IonIcons from '@expo/vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const getDisplayName = () => {
  const user = auth.currentUser;
  if (user != null) {
    return user.displayName;
  } else {
    return 'User';
  }
};

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName='HomeScreen'>
      <Stack.Screen name='HomeScreen' component={HomeScreen} options={{ headerShown: false}}/>
    </Stack.Navigator>
  );
};

const UpdateAccountStack = () => {
  return (
    <Stack.Navigator initialRouteName='UpdateAccount'>
      <Stack.Screen name='UpdateAccount' component={UpdateAccount} options={{ headerShown: false}}/>
    </Stack.Navigator>
  );
};

const CarpoolRequestStack = () => {
  return (
    <Stack.Navigator initialRouteName='CarpoolRequest'>
      <Stack.Screen name='CarpoolRequest' component={CarpoolRequest} options={{ headerShown: false}}/>
    </Stack.Navigator>
  );
};

const HomeScreenRouter = ({navigation}) => {
  return (
    <Drawer.Navigator 
      screenOptions={{
        headerTitle: 'Welcome, ' + getDisplayName() + '!',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#5FBAA7',
        },
        headerTintColor: '#2b2b2b',
        itemStyle: { marginVertical: 5 },
        drawerActiveTintColor: '#5FBAA7',
      }}
      drawerContent={CustomDrawerMenu}>
      <Drawer.Screen name='Home Page' component={HomeStack} 
        options={{
          drawerIcon: () => (
            <IonIcons name='home' size={30} color='#2b2b2b' />
          ),
        }}
      />
      <Drawer.Screen name='Edit Account' component={UpdateAccountStack}
        options={{
          drawerIcon: () => (
            <IonIcons name='create' size={30} color='#2b2b2b' />
          ),
          headerTitle: 'Edit Account',
          headerRight: () => (
            <IonIcons.Button name='home' size={30} color='#2b2b2b' backgroundColor='#5FBAA7' onPress={() => navigation.navigate('Home Page')} />
          ),
        }}
      />
      <Drawer.Screen name='Carpool Request' component={CarpoolRequestStack}
        options={{
          drawerIcon: () => (
            <IonIcons name='car-sport' size={30} color='#2b2b2b' />
          ),
          headerTitle: 'Carpool Request',
          headerRight: () => (
            <IonIcons.Button name='stop-circle-outline' size={30} color='#2b2b2b' backgroundColor='#5FBAA7' onPress={() => navigation.navigate('Home Page')} />
          ),
          drawerItemStyle: {
            height: 0,
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default HomeScreenRouter;