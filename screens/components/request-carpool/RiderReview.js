import React, { useEffect, useState } from "react";
import Slider from '@react-native-community/slider';
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { auth, db } from '../../../firebaseConfig';

  const RiderReview = ({ navigation, route }) => {
    const { carpoolSelected, startName, endName } = route.params;
    const [ratings, setRatings]= useState([]);
    const [carpoolRiders, setCarpoolRiders]= useState([]);

    const getAllCarpoolRiders = async () => {
      const docRef = doc(db, 'AvailableCarpools', carpoolSelected.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCarpoolRiders(docSnap.data().activeCarpoolers.filter((rider) => rider.uid !== auth.currentUser.uid));
      } else {
        console.log("No such document!");
      }
    };

    const updateTripsTaken = async (riderUID) => {
      const docRef = doc(db, 'Users', riderUID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          tripsTaken: arrayUnion({
            id: carpoolSelected.id,
            startName: startName.split(',')[0],
            endName: endName.split(',')[0],
            fare: carpoolSelected.fare / (carpoolSelected.activeCarpoolers.length + 1),
            emissionsSaved: carpoolSelected.totalEmissions - (carpoolSelected.totalEmissions / (carpoolSelected.activeCarpoolers.length + 1)),
          }),
          savedEmissions: increment(carpoolSelected.totalEmissions - (carpoolSelected.totalEmissions / (carpoolSelected.activeCarpoolers.length + 1))),
        });
      } else {
        console.log("No such document!");
      }
    };

    useEffect(() => {
      getAllCarpoolRiders();
      const initializeRatings = new Array(carpoolRiders.length).fill(0);
      setRatings([...initializeRatings]);
    }, []);

    function handleRatingClick(rating, index) {
      const newRatings = ratings.map((r, i) => {
        if (i === index) {
          // Increment the clicked counter
          return rating;
        } else {
          // The rest haven't changed
          return r;
        }
      });
      setRatings(newRatings);
    }

    const handleSubmitPress = () => {
      Alert.alert(
        'Submit Ratings',
        'Are you sure you want to submit your ratings?',
        [
          {
            text: 'Cancel',
            onPress: () => { return null; },
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () => {
              carpoolRiders.forEach((rider, index) => {
                const docRef = doc(db, 'Users', rider.uid);
                getDoc(docRef).then((doc) => {
                  const currentRating = doc.data().rating;
                  updateDoc(docRef, {
                    rating: (currentRating + ratings[index]) / 2
                  });
                });
                updateTripsTaken(rider.uid);
              });
              updateTripsTaken(auth.currentUser.uid);
              navigation.replace('HomeScreen');
            }
          }
        ],
        { cancelable: false }
      );
    };

    return (
      <View style={styles.mainBody}>
        <ScrollView>
          {carpoolRiders.map((rider, index) => {
            return (
              <View key={index}>
                <Text style={styles.contentStyle}>
                  Please provide a customer review for <Text style={{ fontWeight: 'bold' }}>{rider.name}</Text> based on your experience with them.
                </Text>
                <Slider
                  style={{width: 300, height: 40, alignSelf: 'center'}}
                  minimumValue={0}
                  maximumValue={5}
                  step={1}
                  minimumTrackTintColor="#2b2b2b"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#5FBAA7"
                  value={0}
                  onValueChange={(value) => handleRatingClick(value, index)}
                />
                <Text style={styles.contentStyle}>
                  <Text style={{fontWeight: 'bold'}}>{ratings[index]} / 5 Stars</Text>
                </Text>
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