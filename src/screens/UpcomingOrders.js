/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
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
  Modal,
} from 'react-native';

import links from '../components/links';
import colors from '../components/colors';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import backIcon from '../assets/back-black.png';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const UpcomingOrders = ({navigation}) => {
  const [appointments, setappointments] = useState([]);
  const [doctor, setdoctor] = useState([]);
  const [memlist, setmemlist] = useState([]);
  const [doctorfilter, setdoctorfilter] = useState([]);
  const [clinic, setclinic] = useState({type:null});
  const [clinice, setclinice] = useState({type:null});
  const [clinics, setclinics] = useState({type:null});
  const [familymem, setFamilymem] = React.useState([]);
  const [labs, setlabs] = useState([
    {
      patientName: 'Demo Name',
      testName: 'XYZ test',
      Timimg: '7:00am-9:00am',
      clinicName: 'XYZ Name',
      labName: 'XYZ lab Name',
      location: 'Location of clinc',
      coll: 1,
      day: 'Monday',
      address: 'C 23 A Random Vihar, Sector - xyz Noida',
    },
  ]);
  const [coll, setcoll] = useState(1);
  const [empty, setempty] = useState(false);

  const [dialogdoc, setDialogdoc] = useState(null);
  const [dialogalab, setDialoglab] = useState(null);
  const d =new Date();

  useEffect(()=>{
    const user = auth().currentUser;
    const subscriber = firestore()
      .collection('appointment_doctor')
      .doc(user.uid)
      .onSnapshot(documentSnapshot => {
        // console.log('User scheduled data: ', documentSnapshot.data().schedule);
        setdoctor(documentSnapshot.data().schedule);
        setdoctorfilter(documentSnapshot.data().schedule);
        documentSnapshot.data().schedule.forEach((s)=>{
          console.log("patient name",s.patient_name)
          setmemlist(prev=>[...prev,s.patient_name])
        })
    });
    console.log("memlist  ",memlist)
    clinicdata(user);
  },[])

  const onChangeSearch = query => {
    setdoctorfilter(
      doctor.filter(
        i =>
          i.patient_name.includes(query)
      ),
    );
    setDialogdoc(null);
    setDialoglab(null);
  };

  async function clinicdata(user) {
    doctor.forEach(async (element,index) => {
      await firestore().collection('clinic')
      .where('id','==', element.clinic_id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          clinic.push(documentSnapshot.data());
          // setclinic(prevstate => ([...prevstate,documentSnapshot.data()]))
        });
      });
    })
    const datas = await firestore().collection('user').doc(user.uid).collection('family').get();
      datas.forEach(doc =>{
        if (familymem.some(mem => mem.email === doc.data().email)) {
          console.log('already exists');
        }
        else{
          familymem.push(doc.data());
        }
      })
    setclinics(clinic);
    setclinic(clinic);
  }

  function DoctorScreen() {
    return (
      <View style={{flex: 1, backgroundColor: colors.bg}}>
        <View style={styles.mainView}>
          <TouchableOpacity
            onPress={() => setDialogdoc('show')}
            style={styles.username}>
            <Text style={styles.usertext}>User Name</Text>
            <Image style={{height: 16, width: 16}} source={links.arr_right} />
          </TouchableOpacity>
          <View style={styles.date}>
            <Text style={styles.dateT}>{moment(d).format('L')}</Text>
          </View>
          {doctorfilter.map((source, index) => {
            return (
              <>
              {source.type=="checkup" ? 
                <View style={styles.card} key={index}>
                <Text style={styles.usertext}>{source.patient_name}</Text>
                <View style={styles.seperator} />
                <View style={styles.spacebetween}>
                  <View style={styles.left}>
                    <Text
                      // onPress={() => navigation.navigate('Doctordetails', {})}
                      style={styles.usertext}>
                      Dr. {source.doctor.name}
                    </Text>
                  </View>
                  <View style={styles.right}>
                    <View style={{alignItems: 'flex-start'}}>
                      <Text style={styles.time}>
                        Timing -{' '}
                        <Text style={styles.subText}>{source.time}</Text>
                      </Text>
                      <Text style={styles.time}>
                        Day - <Text style={styles.subText}>{moment(source.date.datestring).format('dddd')}</Text>
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.spacebetween, {marginTop: 8}]}>
                  <View style={styles.left}>
                    <Text style={styles.usertext}>{clinics.type ==null ? "" : clinics[index].name}</Text>
                    <Text style={styles.subText}>{clinics.type ==null ? "" : clinics[index].location.place}</Text>
                  </View>
                  <View style={styles.right}></View>
                </View>
              </View> : null}
              </>
            );
          })}
        </View>
      </View>
    );
  }

  function LabScreen() {
    return (
      <View style={{flex: 1, backgroundColor: colors.bg}}>
        <View style={styles.mainView}>
          <TouchableOpacity
            onPress={() => setDialoglab('show')}
            style={styles.username}>
            <Text style={styles.usertext}>User Name</Text>
            <Image style={{height: 16, width: 16}} source={links.arr_right} />
          </TouchableOpacity>
          <View style={styles.date}>
            <Text style={styles.dateT}>{moment(d).format('L')}</Text>
          </View>
          {doctor.map((source, index) => {
            return (
              <>
              {source.type=="labtest" ? <View style={styles.card} key={index}>
                <Text style={styles.usertext}>{source.patient_name}</Text>
                <View style={styles.seperator} />
                <View style={styles.spacebetween}>
                  <View style={styles.left}>
                    <Text style={styles.usertext}>{source.labtest_name}</Text>
                    <Text style={styles.usertext}>{source.clinic.name}</Text>
                    <Text style={styles.subText}>{source.lab_name}</Text>
                  </View>
                  <View style={styles.right}>
                    <View style={{alignItems: 'flex-start'}}>
                      <Text style={styles.time}>
                        Timing -{' '}
                        <Text style={styles.subText}>{source.time}</Text>
                      </Text>
                      <Text style={styles.time}>
                        Day - <Text style={styles.subText}>{moment(source.date.dateString).format('dddd')}</Text>
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.usertext, {fontSize: 14, marginTop: 8}]}>
                  Selected Collection Option
                </Text>
                <View style={[styles.spacebetween, {marginTop: 8}]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      onPress={() => {
                        let newArray = [...labs];
                        newArray[index] = {...source, coll: 0};
                        setlabs(newArray);
                      }}
                      style={[styles.radioBorder, {}]}>
                      {source.collection_option.clinic == true ? (
                        <View
                          style={{
                            height: 10,
                            width: 10,
                            borderRadius: 6,
                            backgroundColor: colors.purple,
                          }}
                        />
                      ) : null}
                    </View>
                    <Text style={styles.time}>Clinic</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      onPress={() => {
                        let newArray = [...labs];
                        newArray[index] = {...source, coll: 1};
                        setlabs(newArray);
                      }}
                      style={[styles.radioBorder, {}]}>
                      {source.collection_option.home == true ? (
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: colors.purple,
                          }}
                        />
                      ) : null}
                    </View>
                    <Text style={styles.time}>Home</Text>
                  </View>
                  <View></View>
                </View>
                {source.collection_option.home == true ? (
                  <View style={{marginTop: 8}}>
                    <Text
                      style={[styles.usertext, {fontSize: 14, marginTop: 8}]}>
                      Address
                    </Text>
                    <Text style={[styles.subText, {fontSize: 16}]}>
                      {source.patient_address}
                    </Text>
                    <Text style={[styles.subText, {fontSize: 16}]}>
                      {source.patient_addresstwo}
                    </Text>
                    <Text style={[styles.subText, {fontSize: 16}]}>
                      {source.patient_addressthree}
                    </Text>
                  </View>
                ) : null}
              </View> : null}
              </>
            );
          })}
        </View>
      </View>
    );
  }

  const ModalDoctor = () => {
    return (
      <Modal
        visible={dialogdoc !== null}
        animated
        onRequestClose={() => {
          setDialogdoc(null);
        }}
        transparent={true}
        animationType="fade">
        <View style={styles.Modalmem}>
          <View style={styles.modalViewMem}>
            <View style={styles.spacebetween}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#373737',
                }}>
                Select Profile -
              </Text>
              <TouchableOpacity onPress={() => setDialogdoc(null)}>
                <Image style={{height: 17, width: 17}} source={links.wrong} />
              </TouchableOpacity>
            </View>
            <View style={[styles.seperator, {marginVertical: 15}]} />
            <TouchableOpacity
                    onPress={() => {
                      onChangeSearch("")
                      // setDialogdoc(null);
                    }}
                    style={[
                      styles.spacebetween,
                      {
                        borderBottomWidth: 1,
                        // backgroundColor: selectedoption == true ? '#835CB980' : null,
                        paddingVertical: 8,
                      },
                    ]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={{height: 11, width: 11, marginRight: 10}}
                        source={links.user}
                      />
                      <Text style={[styles.time, {color: '#373737'}]}>
                        All
                      </Text>
                    </View>
                  </TouchableOpacity>
            {
              familymem.map((source, id)=>{
                return (
                  <TouchableOpacity
                  key={id}
                    onPress={() => {
                      onChangeSearch(source.name)
                      // setDialogdoc(null);
                    }}
                    style={[
                      styles.spacebetween,
                      {
                        borderBottomWidth: 1,
                        // backgroundColor: selectedoption == true ? '#835CB980' : null,
                        paddingVertical: 8,
                      },
                    ]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={{height: 11, width: 11, marginRight: 10}}
                        source={links.user}
                      />
                      <Text style={[styles.time, {color: '#373737'}]}>
                        {source.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })
              }
            {/* <View style={[styles.spacebetween, {paddingVertical: 5}]}>
              <TouchableOpacity
                onPress={() => {
                  setDialogdoc(null);

                  navigation.navigate('AddProfile');
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    backgroundColor: colors.dark,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 14,
                    width: 14,
                    borderRadius: 8,
                    marginRight: 10,
                  }}>
                  <Image source={links.add} style={{height: 10, width: 10}} />
                </View>
                <Text style={[styles.time, {color: '#373737'}]}>
                  Add New Profile
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </Modal>
    );
  };

  const ModalLab = () => {
    return (
      <Modal
        visible={dialogalab !== null}
        animated
        onRequestClose={() => {
          setDialoglab(null);
        }}
        transparent={true}
        animationType="fade">
        <View style={styles.Modalmem}>
          <View style={styles.modalViewMem}>
            <View style={styles.spacebetween}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#373737',
                }}>
                Select Profile -
              </Text>
              <TouchableOpacity onPress={() => setDialoglab(null)}>
                <Image style={{height: 17, width: 17}} source={links.wrong} />
              </TouchableOpacity>
            </View>

            <View style={[styles.seperator, {marginVertical: 15}]} />
            <TouchableOpacity
              onPress={() => {
                onChangeSearch("")
                // setDialoglab(null);
              }}
              style={[
                styles.spacebetween,
                {
                  borderBottomWidth: 1,
                  // backgroundColor: selectedoption == true ? '#835CB980' : null,
                  paddingVertical: 8,
                },
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{height: 11, width: 11, marginRight: 10}}
                  source={links.user}
                />
                <Text style={[styles.time, {color: '#373737'}]}>
                  All
                </Text>
              </View>
            </TouchableOpacity>
            {
              familymem.map((source, id)=>{
                return (
                  <TouchableOpacity
                  key={id}
                    onPress={() => {
                      onChangeSearch(source.name)
                      // setDialogdoc(null);
                    }}
                    style={[
                      styles.spacebetween,
                      {
                        borderBottomWidth: 1,
                        // backgroundColor: selectedoption == true ? '#835CB980' : null,
                        paddingVertical: 8,
                      },
                    ]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={{height: 11, width: 11, marginRight: 10}}
                        source={links.user}
                      />
                      <Text style={[styles.time, {color: '#373737'}]}>
                        {source.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })
              }
            {/* <View style={[styles.spacebetween, {paddingVertical: 5}]}>
              <TouchableOpacity
                onPress={() => {
                  setDialoglab(null);
                  navigation.navigate('AddProfile');
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    backgroundColor: colors.dark,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 14,
                    width: 14,
                    borderRadius: 8,
                    marginRight: 10,
                  }}>
                  <Image source={links.add} style={{height: 10, width: 10}} />
                </View>
                <Text style={[styles.time, {color: '#373737'}]}>
                  Add New Profile
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image style={{height: 16, width: 16}} source={backIcon} />
          </TouchableOpacity>
          <Text style={styles.head}>Upcoming Orders</Text>
          <Text></Text>
        </View>
        {empty == true ? (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <View style={{}}></View>
            <Image
              style={{
                height: SCREEN_WIDTH / 2,
                width: SCREEN_WIDTH / 2,
                // alignSelf: 'center',
                marginTop: SCREEN_WIDTH / 2.5,
              }}
              source={links.island}
            />
            <Text
              style={{
                color: '#979797',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 16,
                width: SCREEN_WIDTH / 1.7,
              }}>
              No Upcoming Orders
            </Text>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <Tab.Navigator
              tabBarOptions={{
                labelStyle: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#373737',
                },
                style: {
                  backgroundColor: colors.white,
                  borderBottomLeftRadius: 6,
                  borderBottomRightRadius: 6,
                },
                indicatorStyle: {backgroundColor: colors.purple},
              }}>
              <Tab.Screen name="Doctor" component={DoctorScreen} />
              <Tab.Screen name="Lab" component={LabScreen} />
            </Tab.Navigator>
          </View>
        )}
        <ModalDoctor />
        <ModalLab />
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
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
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
  usertext: {
    color: '#373737',
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    height: 52,
    width: 160,
    borderRadius: 30,
    backgroundColor: '#FFDE70',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },
  dateT: {
    color: '#373737',
    fontWeight: 'bold',
    fontSize: 16,
  },
  seperator: {
    height: 1,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 5,
    backgroundColor: '#373737',
  },
  spacebetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  left: {
    width: '50%',
  },
  right: {
    width: '50%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#373737',
  },
  subText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#979797',
  },
  radioBorder: {
    height: 18,
    width: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  Modalmem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  modalViewMem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 10,
    width: SCREEN_WIDTH,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
});

export default UpcomingOrders;
