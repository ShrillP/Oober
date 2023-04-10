import React, { useEffect, useState } from "react";
import { Rating } from 'react-native-ratings';
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {auth, db} from '../../../firebaseConfig';

  const RiderReview = ({ navigation, route }) => {
    const { carpoolID } = route.params;
    const [ratings, setRatings]= useState([]);
    const [carpoolRiders, setCarpoolRiders]= useState([]);

    const getAllCarpoolRiders = async () => {
      const docRef = doc(db, 'AvailableCarpools', carpoolID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCarpoolRiders(docSnap.data().activeCarpoolers.filter((rider) => rider.uid !== auth.currentUser.uid));
      } else {
        console.log("No such document!");
      }
    };
    getAllCarpoolRiders();

    useEffect(() => {
      const initializeRatings = new Array(carpoolRiders.length).fill(0);
      setRatings([...initializeRatings]);
    }, []);
    
    const updateRiderRating = (rating, index) => {
      const newRatings = ratings.map((r, i) => {
        if (i === index) {
          return rating;
        }
        return r;
      });
      setRatings(newRatings);
    };
    
    // const handleSubmitPress = () => {
    //   console.log("rated John:" + range)
    //   const docRef = doc(db, 'Users', '12345')
    //   getDoc(docRef).then((doc) => {
    //     const currentRating = doc.data().Rating;
    //     console.log('Current rating:', currentRating);
    //     updateDoc(docRef, {
    //       Rating: (currentRating + range)/2
    //     });
    //   })
    // }

    return (
      <View style={styles.mainBody}>
        <ScrollView>
          {carpoolRiders.map((rider, index) => {
            return (
              <View key={index}>
                <Text style={styles.contentStyle}>
                  Please provide a customer review for <Text style={{ fontWeight: 'bold' }}>{rider.name}</Text> based on your experience with them.
                </Text>
                <Rating
                  type='star'
                  tintColor="#A7A8A8"
                  ratingCount={5}
                  startingValue={0}
                  imageSize={60}
                  showRating
                  onFinishRating={(value) => updateRiderRating(value, index)}
                />
              </View>
            );
          })}
        <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => handleSubmitPress()}
            >
            <Text style={styles.buttonTextStyle}>Submit Review</Text>
          </TouchableOpacity>
          <KeyboardAvoidingView enabled>
            <View style={styles.sectionStyle}></View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
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
  },
});

export default RiderReview;