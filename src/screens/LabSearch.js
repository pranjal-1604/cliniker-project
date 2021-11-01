import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import colors from '../components/colors';
import links from '../components/links';
import {Rating} from '../components/ratings/index.tsx';
// import {getDoctorList, getClinicList} from '../services/firebase';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import auth from '@react-native-firebase/auth';
import getDistance from 'geolib/es/getDistance';

import firestore from '@react-native-firebase/firestore';
const Lab = [
  {
    id: '1',
    name: 'cold',
  },
  {
    id: '2',
    name: 'Fever',
  },
  {
    id: '3',
    name: 'HeadAche',
  },
];

export default function LabSearch({navigation}) {
  const [labs, setlabs] = useState([]);
  const [labsfilter, setlabsfilter] = useState([]);
  const [diseases, setdiseases] = useState([
    {
      id: '1',
      name: 'cold',
    },
    {
      id: '2',
      name: 'Fever',
    },
    {
      id: '3',
      name: 'HeadAche',
    },
    {
      id: '4',
      name: 'cold',
    },
    {
      id: '5',
      name: 'cold',
    },
    {
      id: '6',
      name: 'cold',
    },
    {
      id: '7',
      name: 'cold',
    },
    {
      id: '8',
      name: 'cold',
    },
  ]);
  const [specialisation, setspecialisation] = useState([
    {
      id: '1',
      name: 'General Physician',
    },
    {
      id: '2',
      name: 'cardiologiest',
    },
    {
      id: '3',
      name: 'dentist',
    },
    {
      id: '4',
      name: 'cardiologiest',
    },
    {
      id: '5',
      name: 'dentist',
    },
    {
      id: '6',
      name: 'cardiologiest',
    },
    {
      id: '7',
      name: 'dentist',
    },
    {
      id: '8',
      name: 'dentist',
    },
  ]);
  const [searchquery, setsearchquery] = useState('');
  const [knowmore, setknowmore] = useState();

  const [addressadded, setaddressadded] = useState(false);
  const [activeaddress, setactiveaddress] = useState({});

  useEffect(() => {
    setcompletelabs();
    const user = auth().currentUser;
    // checkifaddressadded(user.uid);
  }, []);

  const onChangeSearch = query => {
    setsearchquery(query);
    setlabsfilter(
      labs.filter(
        i =>
          i.test_name.toLowerCase().includes(query.toLowerCase()) ||
          i.clinic_name.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

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

  async function setcompletelabs() {
    setlabs([]);
    const lab = await firestore()
      .collection('clinic')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          // console.log('labss ', documentSnapshot.data().location.lat);
          documentSnapshot.data().lab_services.map((source, id) => {
            setlabs(prevstate => [
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
          });
        });
      });
    console.log('labs ', labs);
  }

  const ItemViewDisease = ({item, index}) => {
    return (
      <View style={{padding: 5}}>
        <TouchableOpacity onPress={() => {}}>
          <View>
            <View
              style={{
                // height: 100,
                width: (SCREEN_WIDTH - 60) / 4,
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: (SCREEN_WIDTH - 60) / 6.5,
                  width: (SCREEN_WIDTH - 60) / 6.5,
                  borderRadius: 30,
                  backgroundColor: colors.grey,
                }}></View>
              <Text
                style={{
                  color: colors.dark,
                  paddingTop: 2,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 14,
                }}>
                {item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const ItemSeparatorViewDisease = () => {
    return <View style={{}} />;
  };

  const ItemViewSpecialisation = ({item, index}) => {
    return (
      <View style={{padding: 5}} key={index}>
        <TouchableOpacity onPress={() => {}}>
          <View>
            <View
              style={{
                height: 100,
                width: (SCREEN_WIDTH - 40) / 2,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.dark,
                flexDirection: 'row',
                borderRadius: 15,
              }}>
              <View
                style={{
                  width: '40%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 40,
                    backgroundColor: colors.grey,
                  }}></View>
              </View>
              <View
                style={{
                  width: '60%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    color: colors.white,
                    alignSelf: 'center',
                    paddingTop: 2,
                    paddingHorizontal: 5,
                  }}>
                  {item.name}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const ItemSeparatorViewSpecialisation = () => {
    return <View style={{}} />;
  };

  const renderItem = ({source, i}) => (
    <View style={styles.doctorlist} key={i}>
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
                {addressadded ? getDistancefromact(source.lat, source.lon) : ''}{' '}
                km
              </Text>
            </View>
          </View>
        </View>
        <View style={{marginLeft: 7, width: '50%', alignItems: 'flex-start'}}>
          <Text style={[styles.name, {}]}>{source.test_name} </Text>
          <Text style={[styles.profession, {}]}>{source.clinic_name}</Text>

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
          <Text style={{fontSize: 12, fontWeight: 'bold', color: colors.black}}>
            Report In{' '}
            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#373737'}}>
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
            <Text style={{color: colors.white, fontSize: 14}}>Book lab</Text>
          </TouchableOpacity>
        </View>
      </View>
      {knowmore == i ? (
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
            onPress={() => setknowmore(null)}
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
              <Text style={styles.subT}>Fasting of 12 hours is a must</Text>
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
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                Additional charge of Rs. X is levied over a distance of Xkm
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
            setknowmore(i);
          }}
          style={{
            marginBottom: 10,
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          <Text style={[styles.stories, {textAlign: 'center'}]}>knowmore</Text>
          <Image
            style={{height: 12, width: 12, marginLeft: 4}}
            source={links.arrow_down}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.searchT}>Search</Text>
          <View style={{marginBottom: 10}}>
            <Image
              source={links.search}
              style={{
                position: 'absolute',
                height: 30,
                width: 30,
                top: 20,
                // left: 40,
              }}
            />
            <TextInput
              style={styles.Input}
              value={searchquery}
              editable
              placeholder={'Search doctors, Labs and more'}
              placeholderTextColor={colors.dark}
              onChangeText={onChangeSearch}
            />
          </View>
        </View>
        {searchquery.length == 0 ? (
          <View style={styles.mainView}>
            <View style={styles.space_between}>
              <Text style={styles.heading}>Search by Diseases</Text>
            </View>
            <View style={styles.dname}>
              <FlatList
                data={diseases}
                scrollEnabled={false}
                numColumns={4}
                renderItem={ItemViewDisease}
                ItemSeparatorComponent={ItemSeparatorViewDisease}
                style={{
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}
              />
            </View>
            <View style={styles.space_between}>
              <Text style={styles.heading}>Search by Specialisation</Text>
            </View>
            <View style={styles.dname}>
              <FlatList
                data={specialisation}
                scrollEnabled={false}
                numColumns={2}
                renderItem={ItemViewSpecialisation}
                ItemSeparatorComponent={ItemSeparatorViewSpecialisation}
                style={{
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.mainView}>
            {labsfilter.map((source, i) => {
              return (
                <View key={source.doc_id} style={{paddingHorizontal: 16}}>
                  {renderItem({source, i})}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  searchT: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.grey,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'android' ? 15 : 0,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.bg,
    width: SCREEN_WIDTH,
    alignSelf: 'center',
    marginTop: 5,
  },
  bet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});
