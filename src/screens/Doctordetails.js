/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import links from '../components/links';
import colors from '../components/colors';
import firestore from '@react-native-firebase/firestore';
import {Rating} from '../components/ratings/index.tsx';
import StepIndicator from 'react-native-step-indicator';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

import auth from '@react-native-firebase/auth';
import getDistance from 'geolib/es/getDistance';

const Doctordetails = ({navigation, route}) => {
  const [loading, setloading] = useState(false);
  const [renderclinic, setRenderClinic] = useState({array: []});
  const [addressadded, setaddressadded] = useState(false);
  const [activeaddress, setactiveaddress] = useState({});
  const {details} = route.params;
  var found = null;

  useEffect(() => {
    // console.log('doctor details', details);
    const user = auth().currentUser;
    details.clinics.map(clinic => {
      const subscriber = firestore()
        .collection('clinic')
        .where('id', '==', clinic.id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            console.log('kjbk' + documentSnapshot.data().location);
            setRenderClinic(prevState => ({
              array: [...prevState.array, documentSnapshot.data()],
            }));
          });

          // checkifaddressadded(user.uid);
        });
    });
  }, []);

  const checkifaddressadded = uid => {
    const subscriber = firestore()
      .collection('user')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        console.log('User data: ', documentSnapshot.data().activeaddress);
        setactiveaddress(documentSnapshot.data().activeaddress);
        if (
          documentSnapshot.data().activeaddress.lat > 0 &&
          documentSnapshot.data().activeaddress.lon > 0
        ) {
          setaddressadded(true);
        }
        // setactivefamily(documentSnapshot.data().activefamily);
      });
  };

  const getDistancefromact = pos => {
    console.log(pos);
    if (pos.lat != undefined && pos.long != undefined) {
      let k = getDistance(
        {latitude: activeaddress.lat, longitude: activeaddress.lon},
        {latitude: pos.lat, longitude: pos.long},
      );
      return k / 1000;
    } else return 'NA';
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.spaceBetween}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.back} source={links.back_black}></Image>
          </TouchableOpacity>
          <Text style={styles.head}>DOCTOR DETAILS</Text>
          <Text></Text>
        </View>
        <View style={styles.mainView}>
          <Image
            style={{
              height: 152,
              width: 152,
              alignSelf: 'center',
              marginTop: 20,
              borderRadius: 100,
            }}
            source={links.doctor}
          />
        </View>
        <View>
          <Text style={styles.name}>{details.name}</Text>
          <Text style={styles.speciality}>{details.specialist}</Text>
        </View>
        <View style={[styles.spaceBetween, {marginTop: 15, width: '95%'}]}>
          <View
            style={{
              height: 50,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.teup}>Experience</Text>
            <Text style={styles.tedown}>{details.experience} Years</Text>
          </View>
          <View style={{height: 50, width: 1, backgroundColor: '#707070'}} />
          <View
            style={{
              height: 50,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.teup}>Rating</Text>
            <View style={{}}>
              <Rating
                showRating={false}
                startingValue={details.rating}
                ratingCount={5}
                readonly
                imageSize={12}
                style={{backgroundColor: colors.bg}}
              />
            </View>
          </View>
          <View style={{height: 50, width: 1, backgroundColor: '#707070'}} />
          <View
            style={{
              height: 50,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.teup}>Fee</Text>
            <Text style={styles.tedown}>₹ {details.fees}</Text>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <FlatList
            horizontal
            bounces={true}
            showsHorizontalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            style={[styles.packageList, {marginBottom: 10, marginLeft: 10}]}
            scroll
            data={details.clinics}
            renderItem={({item}) => {
              found = renderclinic.array.find(element => element.id == item.id);
              console.log('clinic ', item.id, found);
              return (
                <View style={styles.nearby}>
                  <Image source={links.clinic} style={styles.upgrey}></Image>
                  <View style={{marginTop: 4}}>
                    <Text style={styles.mainT}>
                      {found == null ? 'name' : found.name}
                    </Text>
                    <Text style={styles.subT}>
                      Location, {found == null ? 'name' : found.location.place}
                    </Text>
                    <Text style={styles.distance}>
                      {addressadded ? getDistancefromact(item.pos) : ''} km away
                    </Text>
                    <Text style={styles.timingT}>
                      Timing -
                      {item.timing.intime > 12
                        ? item.timing.intime - 12
                        : item.timing.intime}
                      {item.timing.intime > 12 ? 'pm' : 'am'} -{' '}
                      {item.timing.outime > 12
                        ? item.timing.outime - 12
                        : item.timing.outime}
                      {item.timing.outime > 12 ? 'pm' : 'am'}
                    </Text>
                    <Text style={styles.timingT}>
                      Days -
                      {item.days.map(source => {
                        return `${source} `;
                      })}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('BookCalender', {
                        clinic_details: found,
                        doctor_details: details,
                      })
                    }
                    style={styles.book}>
                    <Text style={styles.appT}>BOOK APPOINTMENT</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
        <View
          style={{
            marginVertical: 15,
            backgroundColor: colors.white,
            width: '95%',
            alignSelf: 'center',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}>
          <View>
            <Text style={[styles.name, {textAlign: 'left'}]}>
              Area Of Expertise
            </Text>
            <Text style={[styles.speciality, {textAlign: 'left'}]}>
              {details.expertise.map(source => {
                return `${source} ,`;
              })}
            </Text>
            <Text style={[styles.name, {textAlign: 'left', marginTop: 40}]}>
              Past Affiliation
            </Text>
            <View style={{marginTop: 20}}>
              {details.pastaff.map((source, index) => {
                return (
                  <View>
                    {index == 0 ? null : (
                      <View
                        style={{
                          height: 60,
                          width: 1,
                          backgroundColor: colors.black,
                          marginLeft: 6,
                        }}></View>
                    )}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{height: 13, width: 13, marginRight: 2}}
                        source={links.hospital}
                      />
                      <Text
                        style={{
                          color: '#646464',
                          fontSize: 13,
                          fontWeight: 'bold',
                        }}>
                        {source}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 35,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={[styles.mainT, {textAlign: 'left'}]}>Reviews</Text>
              <Text
                style={{color: colors.dark, fontSize: 12, fontWeight: 'bold'}}>
                See All
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
              }}>
              <Image style={styles.thumbR} source={links.doctor} />
              <Text
                style={{fontWeight: 'bold', fontSize: 12, color: '#373737'}}>
                Vibhor
              </Text>
            </View>
            <View style={{alignSelf: 'flex-start', marginTop: 5}}>
              <Rating
                showRating={false}
                startingValue={4}
                ratingCount={5}
                readonly
                imageSize={12}
              />
            </View>
            <Text
              style={{
                marginTop: 5,
                color: '#373737',
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              Title Of The Comment
            </Text>
            <Text
              style={{
                marginTop: 5,
                color: '#373737',
                fontSize: 14,
                fontWeight: '800',
              }}>
              The doctor was really professional and it was a good experience
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 15,
  },
  back: {
    height: 30,
    width: 30,
  },
  stepIndicator: {
    marginVertical: 50,
    paddingHorizontal: 20,
  },
  head: {
    color: colors.black,
    fontSize: 15,
    fontWeight: 'bold',
  },
  name: {
    color: '#373737',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  speciality: {
    color: '#646464',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  mainT: {
    color: '#373737',
    fontSize: 15,
    fontWeight: 'bold',
  },
  subT: {
    color: '#646464',
    fontSize: 11,
    fontWeight: 'bold',
  },
  distance: {
    color: colors.dark,
    fontSize: 10,
    fontWeight: 'bold',
  },
  timingT: {
    color: '#373737',
    fontWeight: 'bold',
    fontSize: 13,
  },
  teup: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#979797',
  },
  tedown: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.dark,
  },
  upgrey: {
    height: 70,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  nearby: {
    width: 178,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 10,
    elevation: 4,
    marginBottom: 10,
  },
  book: {
    marginVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 120,
    backgroundColor: colors.dark,
    borderRadius: 9,
  },
  appT: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  thumbR: {
    height: 36,
    width: 36,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default Doctordetails;
