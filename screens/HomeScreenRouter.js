import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './components/navigation-drawer/HomeScreen';
import UpdateAccount from './components/navigation-drawer/UpdateAccount';
import { auth } from '../firebaseConfig';
import CustomDrawerMenu from './components/navigation-drawer/CustomDrawerMenu';
import IonIcons from '@expo/vector-icons/Ionicons';
import CustomerReview from './components/navigation-drawer/CustomerReview';

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

const CustomerReviewStack = () => {
  return (
    <Stack.Navigator initialRouteName='CustomerReview'>
      <Stack.Screen name='CustomerReview' component={CustomerReview} options={{ headerShown: false}}/>
    </Stack.Navigator>
  );
};


const HomeScreenRouter = () => {
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
        }}
      />
      <Drawer.Screen name='Customer Review' component={CustomerReviewStack}
        options={{
          drawerIcon: () => (
            <IonIcons name='create' size={30} color='#2b2b2b' />
          ),
          headerTitle: 'Customer Review',
        }}
        />
    </Drawer.Navigator>
  );
};

export default HomeScreenRouter;