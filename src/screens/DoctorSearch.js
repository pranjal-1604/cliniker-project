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
import {getDoctorList, getClinicList} from '../services/firebase';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import getDistance from 'geolib/es/getDistance';

export default function DoctorSearch({navigation}) {
  const [doctors, setdoctors] = useState([]);
  const [addressadded, setaddressadded] = useState(false);
  const [activeaddress, setactiveaddress] = useState({});

  const [doctorsfilter, setdoctorsfilter] = useState([]);
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
  const getDoctors = async () => {
    const k = await getDoctorList();
    // console.log(k);
    // console.log(k[0].clinics[k[0].clinic_index].pos.lat + 'sdo');
    setdoctors(k);
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

  useEffect(() => {
    const user = auth().currentUser;
    getDoctors();
    // checkifaddressadded(user.uid);
  }, []);

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

  const onChangeSearch = query => {
    setsearchquery(query);
    setdoctorsfilter(
      doctors.filter(
        i =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          i.specialist[0].toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

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
      <View style={{padding: 5}}>
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
    <View style={styles.doctorlist}>
      <View style={styles.up}>
        <View>
          <Image source={links.doctor} style={styles.thumb} />
          <View
            style={{
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              backgroundColor: colors.purple,
              alignSelf: 'center',
              borderRadius: 7,
            }}>
            <Text
              style={{color: colors.white, fontWeight: 'bold', fontSize: 10}}>
              {source.experience} years
            </Text>
          </View>
        </View>
        <View style={{width: 'auto', marginLeft: 4}}>
          <Text style={styles.name}>Dr.{source.name}</Text>
          <Text style={styles.profession}>{source.specialist}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image style={{height: 12, width: 12}} source={links.loc} />
            <Text
              style={{
                color: colors.black,
                fontWeight: 'bold',
                opacity: 0.5,
                fontSize: 11,
              }}>
              {addressadded
                ? getDistancefromact(source.clinics[source.clinic_index].pos)
                : ''}{' '}
              km away
            </Text>
          </View>
          <Text style={styles.profession}>
            {source.clinics[source.clinic_index].name}
          </Text>
          {/* <Text style={styles.experieance}>
            {source.experience} years of Experience overall
          </Text> */}
          {/* <Text style={styles.stories}>55 Happy Patients Stories</Text> */}
          <Text style={styles.profession}>
            Consultation Fees -
            <Text style={styles.stories}>₹ {source.fees}</Text>
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Rating
            showRating={false}
            startingValue={4}
            ratingCount={5}
            readonly
            imageSize={12}
          />
        </View>
      </View>
      <View style={styles.seperator}></View>
      <View style={styles.down}>
        {/* <Text style={styles.experieance}>Clinics</Text>
        {source.pastaff.map((source1, i) => {
          return (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '50%',
                  paddingRight: 10,
                }}>
                <View
                  style={{
                    height: 3,
                    width: 3,
                    borderRadius: 1,
                    backgroundColor: colors.black,
                    marginRight: 2,
                  }}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                  {source1}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingLeft: 10,
                  width: '50%',
                }}>
                <Text
                  style={{
                    color: colors.dark,
                    fontSize: 13,
                    fontWeight: 'bold',
                    marginRight: 3,
                  }}>
                  Rs 500
                </Text>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                  Consultation Fees
                </Text>
              </View>
            </View>
          );
        })} */}

        {/* Book Appointment*/}
        <View style={styles.bet}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Doctordetails', {details: source})
            }
            style={styles.knowmore}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{color: '#373737', fontWeight: 'bold', fontSize: 15}}>
                KNOW MORE
              </Text>
              <Image
                style={{height: 10, width: 10, marginLeft: 4}}
                source={links.arrow_grey}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('BookCalender', {
                clinic_details: null,
                doctor_details: source,
              })
            }
            style={styles.appointmentB}>
            <Text style={{color: colors.white, fontSize: 14}}>
              BOOK APPOINTMENT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
              placeholder={'Search doctors, clinics and more'}
              placeholderTextColor={colors.dark}
              onChangeText={onChangeSearch}
            />
          </View>
        </View>
        {searchquery.length == 0 ? (
          <View style={styles.mainView}>
            <View style={styles.space_between}>
              <Text style={styles.heading}>Search by Specialisation</Text>
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
            {doctorsfilter.map((source, i) => {
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
    paddingHorizontal: 8,
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
    marginVertical: 10,
    paddingTop: 10,
    elevation: 4,
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
    opacity: 0.7,
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
    height: 40,
    width: 150,
    backgroundColor: colors.purple,
    alignSelf: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  knowmore: {
    height: 40,
    width: 120,
    backgroundColor: '#835CB961',
    alignSelf: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
