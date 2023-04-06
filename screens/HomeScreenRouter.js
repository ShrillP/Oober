import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { auth } from '../firebaseConfig';
import IonIcons from '@expo/vector-icons/Ionicons';

import HomeScreen from './components/navigation-drawer/HomeScreen';
import UpdateAccount from './components/navigation-drawer/UpdateAccount';
import CarpoolRequest from './components/request-carpool/CarpoolRequest';
import CarpoolCompleted from './components/request-carpool/CarpoolCompleted';
import CustomDrawerMenu from './components/navigation-drawer/CustomDrawerMenu';
import RideHistory from './components/navigation-drawer/RideHistory';

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

const HomeStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName='HomeScreen'>
      <Stack.Screen name='HomeScreen' component={HomeScreen} options={{ 
        headerTitle: 'Welcome, ' + getDisplayName() + '!',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#5FBAA7',
        },
        headerTintColor: '#2b2b2b',
        headerLeft: () => (
          <IonIcons.Button name='menu' size={30} color='#2b2b2b' backgroundColor='#5FBAA7' onPress={() => navigation.openDrawer()} />
        ),
      }}/>
      <Stack.Screen name='Carpool Request' component={CarpoolRequest} options={{ 
        headerTitle: 'Carpool Request Results',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#5FBAA7',
        },
        headerTintColor: '#2b2b2b',
        headerLeft: () => (
          <IonIcons.Button name='arrow-back' size={30} color='#2b2b2b' backgroundColor='#5FBAA7' onPress={() => navigation.goBack()} />
        ),
      }}/>
      <Stack.Screen name='Carpool Completed' component={CarpoolCompleted} options={{
        headerTitle: 'Carpool Completed',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#5FBAA7',
        },
        headerTintColor: '#2b2b2b',
        headerLeft: () => (
          <IonIcons.Button name='home' size={30} color='#2b2b2b' backgroundColor='#5FBAA7' onPress={() => navigation.popToTop()} />
        ),
      }}/>
    </Stack.Navigator>
  );
};

const UpdateAccountStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName='UpdateAccount'>
      <Stack.Screen name='UpdateAccount' component={UpdateAccount} options={{ 
        headerTitle: 'Edit Account',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#5FBAA7',
        },
        headerTintColor: '#2b2b2b',
        headerLeft: () => (
          <IonIcons.Button name='arrow-back' size={30} color='#2b2b2b' backgroundColor='#5FBAA7' onPress={() => navigation.goBack()} />
        ),
      }}/>
    </Stack.Navigator>
  );
};

const CarpoolRequestStack = () => {
  return (
    <Stack.Navigator initialRouteName='CarpoolRequest'>
      <Stack.Screen name='CarpoolRequest' component={CarpoolRequest} options={{ headerShown: false}}/>
      <Stack.Screen name='Carpool Completed' component={CarpoolCompleted} options={{ headerShown: false}}/>
    </Stack.Navigator>
  );
};

const RideHistoryStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName='RideHistory'>
      <Stack.Screen name='RideHistory' component={RideHistory} options={{
        headerTitle: 'Ride History',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#5FBAA7',
        },
        headerTintColor: '#2b2b2b',
        headerLeft: () => (
          <IonIcons.Button name='arrow-back' size={30} color='#2b2b2b' backgroundColor='#5FBAA7' onPress={() => navigation.goBack()} />
        ),
      }}/>
    </Stack.Navigator>
  );
};

const HomeScreenRouter = ({navigation}) => {
  return (
    <Drawer.Navigator 
      screenOptions={{ headerShown: false }}
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
        }}
      />
      <Drawer.Screen name='Ride History' component={RideHistoryStack}
        options={{
          drawerIcon: () => (
            <IonIcons name='time' size={30} color='#2b2b2b' />
          ),
        }}
      />
      <Drawer.Screen name='Carpool Request' component={CarpoolRequestStack}
        options={{
          drawerItemStyle: {
            height: 0,
          },
        }}
      />
      <Drawer.Screen name='Carpool Completed' component={CarpoolRequestStack}
        options={{
          drawerItemStyle: {
            height: 0,
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default HomeScreenRouter;