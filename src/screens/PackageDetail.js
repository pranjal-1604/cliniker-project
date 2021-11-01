import React, {useEffect, useState} from 'react';
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
  TextInput,
  Modal,
} from 'react-native';

import backIcon from '../assets/back-black.png';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import colors from '../components/colors';
import firestore from '@react-native-firebase/firestore';
import links from '../components/links';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import getDistance from 'geolib/es/getDistance';

export default function PackageDetail({navigation, route}) {
  const {source} = route.params;
  const [knowmore, setknowmore] = useState(true);
  const [addressadded, setaddressadded] = useState(false);
  const [activeaddress, setactiveaddress] = useState({});
  console.log(source + 'kn');
  useEffect(() => {
    const user = auth().currentUser;
    // checkifaddressadded(user.uid);
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

  const getDistancefromact = (lat, long) => {
    // console.log(pos);
    if (lat != undefined && long != undefined) {
      let k = getDistance(
        {latitude: activeaddress.lat, longitude: activeaddress.lon},
        {latitude: lat, longitude: long},
      );
      return k / 1000;
    } else return 'NA';
  };

  async function addtocart(source) {
    console.log('source ', source);
    console.log('source', source.fees);
    // console.log(JSON.stringify(source, null, 2))
    navigation.navigate('BooklabCalender', {source});
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image style={{height: 20, width: 20}} source={backIcon} />
          </TouchableOpacity>
          <Text style={styles.head}></Text>
          <Text></Text>
        </View>
        <View style={styles.mainView}>
          <View style={styles.doctorlist}>
            <View style={styles.up}>
              <View>
                <Image source={links.clinic} style={styles.thumb} />
                <View
                  style={{
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // width: 100,
                    paddingHorizontal: 3,
                    backgroundColor: '#979797CC',
                    alignSelf: 'center',
                    borderRadius: 7,
                    marginTop: 2,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{marginRight: 2}} source={links.loc} />
                    <Text
                      style={{
                        color: colors.black,
                        fontWeight: 'bold',
                        opacity: 0.5,
                        fontSize: 11,
                      }}>
                      {addressadded
                        ? getDistancefromact(source.lat, source.lon)
                        : ''}{' '}
                      km
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{marginLeft: 7, width: '50%', alignItems: 'flex-start'}}>
                <Text style={[styles.name, {}]}>{source.test_name} </Text>
                <Text style={[styles.profession, {}]}>
                  {source.clinic_name}
                </Text>

                {/* <Text style={styles.experieance}>
            {source.experience} years of Experience overall
          </Text> */}
                {/* <Text style={styles.stories}>55 Happy Patients Stories</Text> */}
                <Text style={[styles.profession, {opacity: 0.5}]}>
                  25 Tests in Total
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginTop: 10,
                  width: 80,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: colors.black,
                  }}>
                  Report In{' '}
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: '#373737',
                    }}>
                    5 hours
                  </Text>
                </Text>
              </View>
            </View>
            {/* <View style={styles.seperator}></View> */}
            <View style={styles.down}>
              {/* Book Appointment*/}
              <View style={styles.bet}>
                <View style={{}}>
                  <Text style={styles.profession}>
                    Consultation Fees -
                    <Text style={styles.stories}>₹ {source.fees} </Text>
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    // navigation.navigate('Cart');
                    addtocart(source);
                  }}
                  style={styles.appointmentB}>
                  <Text style={{color: colors.white, fontSize: 14}}>
                    Book lab
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {knowmore == true ? (
              <View style={{paddingHorizontal: 10, paddingBottom: 15}}>
                <View
                  style={{
                    height: 1,
                    width: '90%',
                    backgroundColor: '#D2D2D2',
                    position: 'absolute',
                    top: 13,
                    alignSelf: 'center',
                  }}
                />
                <TouchableOpacity
                  onPress={() => setknowmore(false)}
                  style={{
                    height: 26,
                    width: 100,
                    borderColor: '#D2D2D2',
                    borderWidth: 1,
                    borderRadius: 12,
                    alignSelf: 'center',
                    backgroundColor: colors.white,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#646464',
                      fontWeight: 'bold',
                    }}>
                    Show less
                  </Text>
                </TouchableOpacity>
                <View style={{marginVertical: 15}}>
                  <View>
                    <Text style={styles.mainT}>Sample Collection</Text>
                    <Text style={styles.subT}>
                      Home collection and Lab collection
                    </Text>
                  </View>
                  <View style={{marginTop: 10}}>
                    <Text style={styles.mainT}>Requirements</Text>
                    <Text style={styles.subT}>
                      Fasting of 12 hours is a must
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFDE70',
                    borderRadius: 12,
                    padding: 10,
                  }}>
                  <Text style={styles.mainT}>Test Included(x)</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{width: '50%'}}>
                      <Text style={styles.mainT}>1. Lipid Profile</Text>
                      <Text style={styles.mainT}>2. Complete Hemogram</Text>
                      <Text style={styles.mainT}>3. Diabetes</Text>
                      <Text style={styles.mainT}>4. Thyroid Profile</Text>
                    </View>
                    <View style={{width: '50%'}}>
                      <Text style={styles.mainT}>1. Lipid Profile</Text>
                      <Text style={styles.mainT}>2. Complete Hemogram</Text>
                      <Text style={styles.mainT}>3. Diabetes</Text>
                      <Text style={styles.mainT}>4. Thyroid Profile</Text>
                    </View>
                  </View>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.mainT}>Requirements</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={[
                        styles.dot,
                        {
                          position: 'relative',
                          top: 8,
                        },
                      ]}
                    />
                    <Text style={styles.subT}>
                      Additional charge of Rs. X is levied over a distance of
                      Xkm
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={[styles.dot, {alignSelf: 'center'}]} />
                    <Text style={styles.subT}>Not serviceable beyond Ykm</Text>
                  </View>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.mainT}>Process</Text>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 8,
                          backgroundColor: colors.purple,
                          alignSelf: 'center',
                          marginRight: 5,
                        }}
                      />
                      <Text
                        style={{
                          color: '#7F8386',
                          fontSize: 13,
                          fontWeight: 'bold',
                        }}>
                        Sample collection
                      </Text>
                    </View>
                    <View
                      style={{
                        height: 35,
                        width: 1,
                        backgroundColor: '#00000029',
                        marginLeft: 5,
                      }}></View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 8,
                          backgroundColor: colors.purple,
                          alignSelf: 'center',
                          marginRight: 5,
                        }}
                      />
                      <Text
                        style={{
                          color: '#7F8386',
                          fontSize: 13,
                          fontWeight: 'bold',
                        }}>
                        Dummy text
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setknowmore(true);
                }}
                style={{
                  marginBottom: 10,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <Text style={[styles.stories, {textAlign: 'center'}]}>
                  knowmore
                </Text>
                <Image
                  style={{height: 12, width: 12, marginLeft: 4}}
                  source={links.arrow_down}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  mainView: {
    flex: 1,
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
    paddingBottom: 10,
  },
  header: {
    backgroundColor: colors.white,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    flexDirection: 'row',
    elevation: 4,
  },
  card: {
    width: '100%',
    // backgroundColor: '#fff',
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    padding: 10,
    paddingTop: 0,
    borderRadius: 6,
  },
  head: {
    color: '#373737',
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#FFDE70',
    borderRadius: 6,
    height: 52,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  purpletext: {
    color: colors.purple,
    fontWeight: 'bold',
    fontSize: 20,
  },
  textinput: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 6,
    alignSelf: 'center',
    height: 50,
    marginTop: 12,
    paddingLeft: 70,
    color: colors.purple,
    elevation: 4,
  },
  search: {
    height: 30,
    width: 30,
  },
  blogimg: {
    width: SCREEN_WIDTH - 32,
    height: 150,
    alignSelf: 'center',
    borderRadius: 6,
  },
  spacebetween: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    flexDirection: 'row',
  },
  smalltext: {
    fontSize: 12,
    color: '#646464',
    fontWeight: 'bold',
  },
  seperator: {
    height: 1,
    backgroundColor: '#646464',
    width: '100%',
    marginVertical: 2,
  },
  mainte: {
    fontSize: 15,
    color: '#373737',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    color: '#373737',
    fontWeight: 'bold',
  },
  space_between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 16,
  },
  Input: {
    backgroundColor: colors.white,
    borderRadius: 20,
    color: colors.dark,
    textAlign: 'center',
    fontWeight: 'bold',
    width: SCREEN_WIDTH - 50,
    fontSize: 12,
    height: 55,
    marginVertical: 5,
    opacity: 0.7,
  },
  dname: {
    width: '100%',
    backgroundColor: colors.white,
    marginTop: 10,
    borderRadius: 20,
  },
  doctorlist: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 20,
    elevation: 4,
    paddingTop: 10,
  },
  thumb: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 70,
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  up: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
  },
  profession: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.black,
    opacity: 0.7,
  },
  experieance: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.black,
  },
  stories: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.purple,
    opacity: 0.9,
  },
  seperator: {
    width: '95%',
    alignSelf: 'center',
    height: 1,
    backgroundColor: '#707070',
    marginVertical: 10,
  },
  down: {
    paddingHorizontal: 10,
  },
  appointmentB: {
    height: 33,
    width: 100,
    backgroundColor: colors.purple,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  knowmore: {
    height: 40,
    width: 150,
    backgroundColor: '#835CB961',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainT: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#373737',
  },
  subT: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.black,
    opacity: 0.5,
  },
  dot: {
    height: 4,
    width: 4,
    borderRadius: 4,
    backgroundColor: '#373737',
    marginRight: 3,
  },
  bet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
