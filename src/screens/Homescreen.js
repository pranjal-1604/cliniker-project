import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';

import colors from '../components/colors';
import links from '../components/links';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { getDoctorList, getClinicList } from '../services/firebase';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import Carousel from 'react-native-snap-carousel';

// Labs
const Labs = [
  {
    id: '1',
    item: require('../assets/lab01.jpg'),
  },
  {
    id: '2',
    item: require('../assets/lab02.jpg'),
  },
  {
    id: '3',
    item: require('../assets/lab03.jpg'),
  },
  {
    id: '4',
    item: require('../assets/lab01.jpg'),
  },
  {
    id: '5',
    item: require('../assets/lab02.jpg'),
  },
  {
    id: '6',
    item: require('../assets/lab03.jpg'),
  },
];

// Packages
// const Packages = [
//   {
//     id: '1',
//     title: 'Diabetes Package',
//     subtitle: 'Includes 30 Tests',
//     price: '799',
//   },
//   {
//     id: '2',
//     title: 'Full Body Checkup',
//     subtitle: 'Includes 30 Tests',
//     price: '799',
//   },
//   {
//     id: '3',
//     title: 'Advanced Body Checkup',
//     subtitle: 'Includes 30 Tests',
//     price: '799',
//   },
// ];

const card = [
  {
    img: links.doctor,
    time: 'mon, 12 march,12:00 pm - 1:00 pm',
    docName: 'Dr Name Surname',
    speciality: 'Gynacologiest',
  },
  {
    img: links.doctor,
    time: 'mon, 12 march,12:00 pm - 1:00 pm',
    docName: 'Dr Name Surname',
    speciality: 'Cardiologiest',
  },
  {
    img: links.doctor,
    time: 'mon, 12 march,12:00 pm - 1:00 pm',
    docName: 'Dr Name Surname',
    speciality: 'Cardiologiest',
  },
];

const Homescreen = props => {
  const [useraddress, setUseraddress] = useState('');
  const [user, setUser] = useState('');
  const carouselRef = useRef(null);
  const [clinics, setclinics] = useState([]);
  const [packages, setpackages] = useState([]);
  const [cards, setCards] = useState([]);
  const [userdetail, setuserdetail] = useState({
    first_name: '',
    last_name: '',
    loyalty_points: 0,
    addresses: [null],
  });
  // const HERE_API_KEY = 'FWve0lEXWzCmLD2FZ1Y2eINotemgtqCSQkRHj8ceNYQ';

  const getClinics = async () => {
    const k = await getClinicList();
    // console.log(k);
    // k[0].pastaff.map((source, i) => {
    //   console.log(source);
    // });
    setclinics(k);
  };

  async function setcompletelabs() {
    setpackages([]);
    const lab = await firestore()
      .collection('clinic')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          // console.log('labss ', documentSnapshot.data().location.lat);
          documentSnapshot.data().lab_services.map((source, id) => {
            if (source.package) {
              setpackages(prevstate => [
                ...prevstate,
                {
                  test_name: source.lab_test_name,
                  lab_name: source.lab_name,
                  clinic_name: documentSnapshot.data().name,
                  fees: source.fees,
                  clinic: documentSnapshot.data(),
                  type: 'labtest',
                  lab_id: source.lab_id,
                  date: new Date(),
                  lon: documentSnapshot.data().location.long,
                  lat: documentSnapshot.data().location.lat,
                },
              ]);
            }
          });
        });
      });
    console.log('packages ', packages);
  }

  useEffect(() => {
    const user = auth().currentUser;
    setUser(user);
    getClinics();
    setcompletelabs();
    getuserdetail(user.uid);
    getSchedule(user.uid);
    // (async () => {
    //   let userType = await AsyncStorage.getItem('userType');
    //   setUser(userType);
    // })();
    // console.log("cards",cards);
  }, []);

  const getuserdetail = uid => {
    const subscriber = firestore()
      .collection('user')
      .doc(uid)
      .onSnapshot(async documentSnapshot => {
        // console.log('User data: ', documentSnapshot.data());
        let savedtoken = await AsyncStorage.getItem('pushToken');
        if (
          documentSnapshot.data().Info.pushToken == undefined ||
          documentSnapshot.data().Info.pushToken != savedtoken
        ) {
          console.log(savedtoken + 'add to firebase');
          updatePushToken(savedtoken, uid);
        } else {
          console.log('already added push token');
        }
        setuserdetail(documentSnapshot.data().Info);
        setUseraddress(documentSnapshot.data().activeaddress);
        let addr = documentSnapshot.data().activeaddress;
      });
    // console.log("user address",userdetail);
    // Stop listening for updates when no longer required
    return () => subscriber();
  };

  const updatePushToken = (token, uid) => {
    firestore()
      .collection('user')
      .doc(uid)
      .set(
        {
          Info: {
            pushToken: token,
          },
        },
        { merge: true },
      )
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  };

  // function getAddressFromCoordinates(latitude, longitude) {
  //   return new Promise(resolve => {
  //     const url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${HERE_API_KEY}&mode=retrieveAddresses&prox=${latitude},${longitude}`;
  //     fetch(url)
  //       .then(res => res.json())
  //       .then(resJson => {
  //         // the response had a deeply nested structure :/
  //         if (
  //           resJson &&
  //           resJson.Response &&
  //           resJson.Response.View &&
  //           resJson.Response.View[0] &&
  //           resJson.Response.View[0].Result &&
  //           resJson.Response.View[0].Result[0]
  //         ) {
  //           console.log(
  //             resJson.Response.View[0].Result[0].Location.Address.Label,
  //           );
  //         } else {
  //           console.log('not found');
  //         }
  //       })
  //       .catch(e => {
  //         console.log('Error in getAddressFromCoordinates', e);
  //         resolve();
  //       });
  //   });
  // }

  const getSchedule = uid => {
    if (
      firestore()
        .collection('appointment_doctor')
        .doc(uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            const subscriber = firestore()
              .collection('appointment_doctor')
              .doc(uid)
              .onSnapshot(documentSnapshot => {
                // console.log('User scheduled data: ', documentSnapshot.data().schedule);
                setCards(documentSnapshot.data().schedule);
              });
            // console.log("cards ",cards);
          }
        })
    )
      return () => subscriber();
  };

  const RenderItem = ({ item }) => {
    return (
      <View style={{}}>
        <View
          style={{
            width: SCREEN_WIDTH / 1.2,
            height: 240,
            borderRadius: 20,
            alignItems: 'center',
            backgroundColor: colors.purple,
            alignSelf: 'center',
            paddingVertical: 25,
            paddingHorizontal: 10,
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '90%',
              alignItems: 'center',
            }}>
            <Image
              source={links.doctor}
              style={{ height: 60, width: 60 }}
              borderRadius={20}></Image>
            <View>
              <Text
                style={{ fontWeight: 'bold', fontSize: 21, color: colors.white }}>
                {item.doctor != undefined
                  ? 'Dr.' + item.doctor.name
                  : item.lab_name}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  opacity: 0.48,
                  color: colors.white,
                }}>
                {item.doctor != undefined
                  ? item.doctor.specialist[0]
                  : item.labtest_name}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignItems: 'center',
              height: 60,
              backgroundColor: colors.dark,
              borderRadius: 15,
              paddingHorizontal: 10,
            }}>
            <Image source={links.event} style={{ height: 30, width: 30 }}></Image>
            <Text
              style={{
                width: '80%',
                fontWeight: 'bold',
                fontSize: 13,
                color: colors.white,
              }}>
              {moment(item.date.timestamp).format('llll').slice(0, 11) +
                '  ' +
                item.time}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
            <Image
              source={links.drawericon}
              style={{ height: 27, width: 27 }}></Image>
          </TouchableOpacity>
          <View>
            <Text style={styles.textL}>Current Location</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={links.loc}
                style={{ height: 10, width: 8, marginRight: 3 }}
              />
              <Text style={styles.textD}>
                {useraddress == ''
                  ? 'update address'
                  : useraddress?.address_line1}
              </Text>
              {/* <Text style={styles.textD}>{userdetail.addresses[0]}</Text> */}
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.icon}>
              <TouchableOpacity onPress={() => props.navigation.navigate('ChatScreen')}>
                <Image
                  style={{ height: 20, width: 20 }}
                  source={links.cliniker_white}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.icon}>
              <Image
                style={{ height: 20, width: 20 }}
                source={links.cliniker_white}
              />
            </View>

            <Text style={styles.textD}>{userdetail.loyalty_points}</Text>
          </View>
        </View>

        <View style={styles.mainView}>
          <View style={styles.space_between}>
            <Text style={styles.head}>Upcoming Schedule</Text>
            <Text
              onPress={() => props.navigation.navigate('UpcomingOrders')}
              style={styles.headS}>
              See All
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Carousel
              layout={'tinder'}
              ref={carouselRef}
              data={cards}
              firstItem={card.length - 1}
              renderItem={RenderItem}
              sliderWidth={SCREEN_WIDTH}
              itemWidth={SCREEN_WIDTH - 10}
              style={{ alignSelf: 'center' }}
              swipeThreshold={100}
              layoutCardOffset={+12}
              inactiveSlideOpacity={0.4}
              containerCustomStyle={{
                overflow: 'visible',
                marginVertical: 10,
              }}
              contentContainerCustomStyle={{
                paddingBottom: 14,
              }}
            />
          </View>
          <View style={styles.space_between}>
            <Text style={styles.head}>Lets find what you need</Text>
          </View>
          <View style={styles.choice}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('DoctorSearch')}
              style={styles.choicein}>
              <View style={styles.upgrey}>
                <Image
                  style={{ height: 80, width: 80 }}
                  source={links.doctorh}></Image>
              </View>
              <View>
                <Text style={styles.priT}>Consult Doctors</Text>
                <Text style={styles.secT}>
                  Specialised And Experienced Doctors
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('LabSearch')}
              style={styles.choicein}>
              <View style={styles.upgrey}>
                <Image
                  style={{ height: 80, width: 80 }}
                  source={links.Labs_and_cliinics}></Image>
              </View>
              <View>
                <Text style={styles.priT}>Lab And Clinic</Text>
                <Text style={styles.secT}>
                  Specialised And Experienced Doctors
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('AllPharmacies')}
            style={styles.pharma}>
            <Image
              source={links.vitamin_pill}
              style={{ height: 40, width: 40 }}
            />
            <View>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: '#373737',
                  textAlign: 'center',
                }}>
                View Pharmacy
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 12,
                  opacity: 0.8,
                  color: '#646464',
                  textAlign: 'center',
                }}>
                Contact And Place Order, Simple
              </Text>
            </View>
            {/* <View style={styles.arrow}>
              <Image style={styles.next} source={links.next_white}></Image>
            </View> */}
          </TouchableOpacity>
          <View style={styles.space_between}>
            <Text style={styles.head}>Our Packages</Text>
            <Text
              onPress={() => {
                props.navigation.navigate('AllPackages', { packages });
              }}
              style={styles.headS}>
              See All
            </Text>
          </View>

          <FlatList
            horizontal
            bounces={true}
            showsHorizontalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            style={[styles.packageList, {}]}
            scroll
            data={packages}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('PackageDetail', {
                      source: item,
                    });
                  }}>
                  <LinearGradient
                    colors={['#FFDE70', '#FFAE72', '#FFAE72']}
                    style={{
                      height: 150,
                      width: 150,
                      marginHorizontal: 10,
                      borderRadius: 13,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      padding: 10,
                      elevation: 4,
                      marginBottom: 10,
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        color: colors.black,
                      }}>
                      51+ Tests
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        // fontWeight: 'bold',
                        fontSize: 21,
                        color: colors.black,
                      }}>
                      Full Body Checkup
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }}
          />
          <View style={styles.space_between}>
            <Text style={styles.head}>Nearby Clinics</Text>
            <Text
              onPress={() => props.navigation.navigate('Allclinics')}
              style={styles.headS}>
              See All
            </Text>
          </View>
          <FlatList
            horizontal
            bounces={true}
            showsHorizontalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            style={[styles.packageList, { marginBottom: 10 }]}
            scroll
            data={clinics}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('Clinicdetails', { details: item });
                  }}
                  style={styles.nearby}>
                  <Image
                    source={links.clinic}
                    style={[styles.upgrey, { height: '50%' }]}
                    borderRadius={12}></Image>
                  <View style={{ marginTop: 10 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 9,
                        opacity: 0.6,
                        textAlign: 'center',
                      }}>
                      More Information
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={links.loc}
                        style={{ height: 10, width: 8, marginRight: 3 }}
                      />
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 9,
                          textAlign: 'center',
                          color: colors.black,
                        }}>
                        {item.location.place}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: colors.bg,
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 15 : 0,
  },
  doctorCard: {
    borderWidth: 1,
    borderColor: '#dfdfdf',
    backgroundColor: '#fff',
    borderRadius: 16,
    width: SCREEN_WIDTH / 2,
    marginRight: 16,
    overflow: 'hidden',
  },
  doctorImage: {
    resizeMode: 'cover',
    width: null,
    height: 180,
  },
  doctorDetails: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ///new styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.bg,
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.bg,
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
    marginTop: 5,
  },
  textL: {
    color: colors.black,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    opacity: 0.27,
  },
  textD: {
    color: colors.black,
    fontSize: 12,
    fontWeight: 'bold',
  },
  icon: {
    backgroundColor: colors.dark,
    height: 30,
    width: 30,
    borderRadius: 25,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  space_between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  flex_start: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  head: {
    fontSize: 18,
    fontWeight: 'bold',
    opacity: 0.7,
    color: colors.black,
  },
  headS: {
    fontSize: 13,
    color: colors.dark,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  choicein: {
    width: '45%',
    backgroundColor: colors.white,
    height: 170,
    borderRadius: 12,
    elevation: 4,
  },
  upgrey: {
    height: '60%',
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#B9B9B9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priT: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secT: {
    fontWeight: 'bold',
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  pharma: {
    height: 62,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 15,
    backgroundColor: colors.white,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 4,
  },
  arrow: {
    height: 45,
    width: 45,
    borderRadius: 25,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  next: {
    height: 40,
    width: 40,
  },
  packageList: {
    paddingTop: 10,
  },
  nearby: {
    width: 150,
    backgroundColor: colors.white,
    height: 170,
    borderRadius: 12,
    marginHorizontal: 10,
    elevation: 4,
    marginBottom: 10,
  },
});

export default Homescreen;
