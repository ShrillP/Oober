import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, createRef, useEffect } from "react";
import { Rating } from 'react-native-ratings';
import {doc, getDoc, updateDoc} from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
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
  FlatList
  
} from "react-native";
import {auth, db} from '../../../firebaseConfig';
import {updateProfile, updatePassword, signOut} from 'firebase/auth';
import { floor } from "react-native-reanimated";
import firestore from '@react-native-firebase/firestore';

  


  const CustomerReview = ({ navigation }) => {

    const currUser = auth.currentUser.displayName;
    const docRefCarpool= doc(db, 'activeCarpools','Carpool1')
    const [range, setRange]= useState('')
    const [carpoolRiders, setCarpoolRiders]= useState([]);
    getDoc(docRefCarpool).then((docSnap) => {
      setCarpoolRiders(docSnap.data().activeCarpoolers);
    })


    
    const handleSubmitPress = () => {
      console.log("rated John:" + range)
      const docRef = doc(db, 'Users', '12345')
      getDoc(docRef).then((doc) => {
        const currentRating = doc.data().Rating;
        console.log('Current rating:', currentRating);
        updateDoc(docRef, {
          Rating: (currentRating + range)/2
        });
      })
    }

    return (
      <ScrollView>
        {carpoolRiders.map((item, index) => (
        <View key={index}>
            <Text style={styles.contentStyle}>Please provide a customer review for {item.Name} based on your experience</Text>
                  <Rating
                    type='star'
                    ratingCount={5}
                    startingValue={0}
                    imageSize={60}
                    showRating
                    onFinishRating={(value) => setRange(value)}
                  />
          </View>
      ))}
       <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => handleSubmitPress()}>
              <Text style={styles.buttonTextStyle}>Submit Review</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView enabled>
            <View style={styles.sectionStyle}></View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  };

    const styles = StyleSheet.create({
        mainBody: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
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

export default CustomerReview;