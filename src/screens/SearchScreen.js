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

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import getDistance from 'geolib/es/getDistance';
import {getDoctorList, getClinicList} from '../services/firebase';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export default function SearchScreen({navigation}) {
  const [doctors, setdoctors] = useState([]);
  const [labs, setlabs] = useState([]);
  const [labsfilter, setlabsfilter] = useState([]);
  const [doctorsfilter, setdoctorsfilter] = useState([]);
  const [clinics, setclinics] = useState([]);
  const [clinicsfilter, setclinicsfilter] = useState([]);
  const [searchquery, setsearchquery] = useState('');
  const [addressadded, setaddressadded] = useState(false);
  const [activeaddress, setactiveaddress] = useState({});

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

  const getDoctors = async () => {
    const k = await getDoctorList();
    console.log(k);
    // k[0].pastaff.map((source, i) => {
    //   console.log(source);
    // });
    setdoctors(k);
  };
  const getClinics = async () => {
    const k = await getClinicList();
    console.log(k);
    // k[0].pastaff.map((source, i) => {
    //   console.log(source);
    // });
    setclinics(k);
  };

  async function getlabs() {
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
                place: documentSnapshot.data().location.place,
              },
            ]);
          });
        });
      });
    console.log('labs ', labs);
  }

  useEffect(() => {
    getDoctors();
    getClinics();
    getlabs();
    const user = auth().currentUser;
    // checkifaddressadded(user.uid);
  }, []);

  const onChangeSearch = query => {
    setsearchquery(query);
    setdoctorsfilter(
      doctors.filter(i => i.name.toLowerCase().includes(query.toLowerCase())),
    );
    setclinicsfilter(
      clinics.filter(i => i.name.toLowerCase().includes(query.toLowerCase())),
    );
    setlabsfilter(
      labs.filter(i => i.lab_name.toLowerCase().includes(query.toLowerCase())),
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
    console.log(lat);
    if (lat != undefined && long != undefined) {
      let k = getDistance(
        {latitude: activeaddress.lat, longitude: activeaddress.lon},
        {latitude: lat, longitude: long},
      );
      return k / 1000;
    } else return 'NA';
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

  const ItemViewDoctors = ({source, i}) => {
    return (
      <View>
        {i == 0 ? null : (
          <View
            style={{
              height: 1,
              width: '80%',
              alignSelf: 'center',
              backgroundColor: colors.black,
              opacity: 0.7,
              marginVertical: 2,
            }}
          />
        )}
        <View style={{marginVertical: 7}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Doctordetails', {details: source});
            }}
            style={styles.docList}>
            <Image source={links.doctor} style={styles.thumb} />
            <View style={{width: '60%'}}>
              <Text style={styles.name}>{source.name}</Text>
              <Text style={styles.profession}>
                Specialised in {source.specialist}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ItemViewClinics = ({item, i}) => {
    return (
      <View>
        {i == 0 ? null : (
          <View
            style={{
              height: 1,
              width: '80%',
              alignSelf: 'center',
              backgroundColor: colors.black,
              opacity: 0.7,
              marginVertical: 2,
            }}
          />
        )}

        <View style={{marginVertical: 7}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Clinicdetails', {details: item});
            }}
            style={styles.docList}>
            <Image source={links.doctor} style={styles.thumb} />
            <View style={{width: '60%'}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.profession}>{item.location.place} </Text>

              <Text style={styles.distance}>
                (
                {addressadded
                  ? getDistancefromact(item.location.lat, item.location.long)
                  : ''}{' '}
                km away from your place)
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ItemViewLabs = ({item, i}) => {
    return (
      <View>
        {i == 0 ? null : (
          <View
            style={{
              height: 1,
              width: '80%',
              alignSelf: 'center',
              backgroundColor: colors.black,
              opacity: 0.7,
              marginVertical: 2,
            }}
          />
        )}

        <View style={{marginVertical: 7}}>
          <TouchableOpacity style={styles.docList}>
            <Image source={links.clinic} style={styles.thumb} />
            <View style={{width: '60%'}}>
              <Text style={styles.name}>{item.lab_name}</Text>
              <Text style={styles.profession}>{item.place} </Text>

              <Text style={styles.distance}>
                ( {addressadded ? getDistancefromact(item.lat, item.lon) : ''}{' '}
                km away from your place)
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
                // left: 30,
              }}
            />
            <TextInput
              style={styles.Input}
              value={searchquery}
              placeholder={'Search doctors, clinics and more'}
              placeholderTextColor={colors.dark}
              onChangeText={onChangeSearch}
              editable
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
            <View style={styles.space_between}>
              <Text style={styles.heading}>Doctors</Text>
            </View>
            <View style={styles.dname}>
              {/* <FlatList
                data={doctorsfilter}
                scrollEnabled={false}
                renderItem={ItemViewDoctors}
                ItemSeparatorComponent={ItemSeparatorViewDoctors}
                // style={{
                //   marginTop: 10,
                // }}
              /> */}
              {doctorsfilter.map((source, i) => {
                return (
                  <View key={source.doc_id} style={{paddingHorizontal: 16}}>
                    {ItemViewDoctors({source, i})}
                  </View>
                );
              })}
            </View>
            <View style={styles.space_between}>
              <Text style={styles.heading}>Clinics</Text>
            </View>
            <View style={styles.dname}>
              {/* <FlatList
                data={clinicsfilter}
                scrollEnabled={false}
                renderItem={ItemViewClinics}
                ItemSeparatorComponent={ItemSeparatorViewClinics}
              /> */}
              {clinicsfilter.map((item, i) => {
                return (
                  <View key={item.doc_id} style={{paddingHorizontal: 16}}>
                    {ItemViewClinics({item, i})}
                  </View>
                );
              })}
            </View>
            <View style={styles.space_between}>
              <Text style={styles.heading}>Labs</Text>
            </View>
            <View style={styles.dname}>
              {/* <FlatList
                data={clinicsfilter}
                scrollEnabled={false}
                renderItem={ItemViewClinics}
                ItemSeparatorComponent={ItemSeparatorViewClinics}
              /> */}
              {labsfilter.map((item, i) => {
                return (
                  <View key={item.doc_id} style={{paddingHorizontal: 16}}>
                    {ItemViewLabs({item, i})}
                  </View>
                );
              })}
            </View>
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
    elevation: 4,
    marginBottom: 10,
  },
  doctorlist: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 4,
  },
  thumb: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 50,
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
  },
  profession: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.dark,
    opacity: 0.7,
  },
  distance: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.black,
    opacity: 0.7,
  },
  docList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
