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
  Modal,
  TextInput,
  Button,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import links from '../components/links';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import colors from '../components/colors';
import moment from 'moment';
import backIcon from '../assets/back-black.png';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Rating} from '../components/ratings/index.tsx';
import StepIndicatorComp from '../components/StepIndicatorComp';

const Tab = createMaterialTopTabNavigator();

const MyOrders = ({navigation}) => {
  const [coll, setcoll] = useState(1);
  const [doctors, setdoctors] = useState([]);
  const [doctorsfilter, setdoctorsfilter] = useState([]);
  const [labs, setlabs] = useState([]);
  const [labsfilter, setlabsfilter] = useState([]);
  const [clinics, setclinics] = useState([]);
  const [memlist,setMemlist] = useState([]);
  const [empty, setempty] = useState(false);
  const [review, setreview] = useState('');
  const refRBSheet = useRef();
  const [dialogdoc, setDialogdoc] = useState(null);
  const [dialogalab, setDialoglab] = useState(null);
  const [removed, setremoved] = useState(null);
  const [reschuduled, setreschuduled] = useState(null);
  const [isModalVisible, setModalVisible] = useState(null);
  const [familymem,setFamilymem] = useState(null);

  // This is to manage TextInput State
  const [userreview, setuserreview] = useState('');

  // Create toggleModalVisibility function that will
  // Open and close modal upon button clicks.
  const toggleModalVisibility = () => {
    console.log(userreview + 'name');
    setModalVisible(null);
    navigation.navigate('Confetti');
  };

  const clinicname = (id) => {
    const found = clinics.find(element => element.id = id);
    return found?.name;
  }
  const clinicaddress = (id) => {
    const found = clinics.find(element => element.id = id);
    return found?.location.place ;
  }

  const removeorder = (removed) =>{
    const orders = [...doctors,...labs];
    if(removed.type=="checkup"){
      orders.splice(removed.index,1)
    }
    else{
      orders.splice(doctors.length+index,1)
    }
    const user = auth().currentUser;
    firestore().collection('appointment_cart').doc(user.uid).set({
      schedule: orders,
    })
  }
  const onChangeSearch = query => {
    setdoctorsfilter(
      doctors.filter(
        i =>
          i.patient_name.includes(query)
      ),
    );
    setlabsfilter(
      labs.filter(
        i =>
          i.patient_name.includes(query)
      ),
    );
    setDialogdoc(null);
    setDialoglab(null);
  };

  useEffect(async ()=>{
    const user = auth().currentUser;
    const datas = await firestore().collection('appointment_doctor').doc(user.uid).get();
    // setdoctors(datas.data().schedule);
    // console.log(JSON.stringify(datas.data().schedule,null,2))
    datas.data().schedule.map((source, index)=>{
      if(source.type=="labtest"){
        console.log(JSON.stringify(source,null,2))
        if (labs.some(mem => mem.timestamp === source.timestamp)) {
          console.log('already exists');
        }
        else{
          setlabs((prev)=>[...prev,source]);
          setlabsfilter((prev)=>[...prev,source]);
          setMemlist((prevs)=>[...prevs,source.patient_name]);
          console.log('already exists  patient ',source.patient_name);

        }
      }
      else{
        console.log(JSON.stringify(source,null,2))
        if (doctors.some(mem => mem.timestamp === source.timestamp)) {
          console.log('already exists', source.patient_name);
        }
        else{
          setdoctors((prev)=>[...prev,source]);
          setdoctorsfilter((prev)=>[...prev,source]);
          setMemlist((prevs)=>[...prevs,source.patient_name]);
          console.log('already exists  patient ',source.patient_name);
        }
      }
    })

    const datass = await firestore().collection('clinic').get();
    datass.forEach((documentsnapshot)=>{
      console.log(documentsnapshot.data());
      if (clinics.some(mem => mem.id === documentsnapshot.data().id)) {
        console.log('already exists');
      }
      else{
        setclinics((prev)=>[...prev,documentsnapshot.data()])
      }
    })


    const familydatas = await firestore().collection('user').doc(user.uid).collection('family').get();
    console.log(familydatas);
    familydatas.forEach(doc =>{
      if (familymem.some(mem => mem.email === doc.data().email)) {
        console.log('already exists');
      }
      else{
        familymem.push(doc.data());
      }
    })

  },[])

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
          {doctorsfilter.map((source, index) => {
            console.log("sourcessss ",source);
            return (
              <View style={styles.card}
              key={index}>
                <Text style={styles.usertext}>{source?.patient_name}</Text>
                <View style={styles.seperator} />
                <View style={styles.spacebetween}>
                  <View style={styles.left}>
                    <Text style={styles.usertext}>{source?.doctor.name}</Text>
                  </View>
                  <View style={styles.right}>
                    <View style={{alignItems: 'flex-start'}}>
                      <Text style={styles.time}>
                        Timing -{' '}
                        <Text style={styles.subText}>{source.time}</Text>
                      </Text>
                      <Text style={styles.time}>
                        Day - <Text style={styles.subText}>{moment(source.date.datestring).format('llll').slice(0,11)}</Text>
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.spacebetween, {marginTop: 8}]}>
                  <View style={styles.left}>
                    <Text style={styles.usertext}>{clinicname(source.clinic_id)}</Text>
                    <Text style={styles.subText}>{clinicaddress(source.clinic_id)}</Text>
                  </View>
                  <View style={styles.right}></View>
                </View>
                <View style={{marginTop: 8}}>
                  <Text style={styles.usertext}>Status -</Text>
                </View>

                <View style={styles.stepIndicator}>
                  <StepIndicatorComp
                    obj={{
                      step: source.step,
                      stepcount: 3,
                      success: false,
                      label: [
                        'Booked',
                        'Consultation completed',
                        'Prescription Uploaded',
                      ],
                    }}
                  />
                  {/* <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text>slenf</Text>
                  </View> */}
                </View>
                {source.reschedule_times < 3 ? (
                  <View>
                    <View
                      style={[
                        styles.spacebetween,
                        {marginTop: 10, justifyContent: 'space-around'},
                      ]}>
                      <TouchableOpacity
                        onPress={() => {
                          // setreschuduled({type: 'doc', ind: index});
                          // console.log(JSON.stringify(doctors,null,2));
                          navigation.navigate('Bookcheckupupdate',{cart: {data:doctors, ordered: true},index});
                        }}
                        style={styles.butt}>
                        <Text style={[styles.name, {color: colors.white}]}>
                          RESCHEDULE
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setremoved({type:"checkup", data: doctors, index: index});
                        }}
                        style={styles.cancelbutt}>
                        <Text style={[styles.name, {color: '#DB5461'}]}>
                          CANCEL
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
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
            onPress={() => setDialogdoc('show')}
            style={styles.username}>
            <Text style={styles.usertext}>User Name</Text>
            <Image style={{height: 16, width: 16}} source={links.arr_right} />
          </TouchableOpacity>
          {labsfilter.map((source, index) => {
            return (
              <View style={styles.card}
              key={index}>
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
                        Report in - <Text style={styles.subText}>5 days</Text>
                      </Text>
                      <Text style={styles.time}></Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.usertext, {fontSize: 14, marginTop: 8}]}>
                  Selected Collection Option
                </Text>
                <View style={[styles.spacebetween, {marginTop: 8}]}>
                  <View
                  onPress={() => {
                    // let newArray = [...labs];
                    // newArray[index] = {...source, collection_option: {clinic: true,home: false}};
                    // setlabs(newArray);
                    console.log(JSON.stringify(newArray,null,2))
                  }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      onPress={() => {
                        // let newArray = [...labs];
                        // newArray[index] = {...source, collection_option: {clinic: true,home: false}};
                        // setlabs(newArray);
                        console.log(JSON.stringify(newArray,null,2))
                      }}
                      style={[styles.radioBorder, {}]}>
                      {source.collection_option.clinic ? (
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
                        newArray[index] = {...source, collection_option: {clinic: false,home: true}};
                        setlabs(newArray);
                      }}
                      style={[styles.radioBorder, {}]}>
                      {source.collection_option.home ? (
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
                {source.collection_option.home ? (
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
                <View style={{marginTop: 8}}>
                  <Text style={styles.usertext}>Status -</Text>
                </View>

                <View style={styles.stepIndicator}>
                  <StepIndicatorComp
                    obj={{
                      step: source.step,
                      stepcount: 4,
                      success: source.alldone,
                      label: [
                        'Order Placed',
                        source.staff == ''
                          ? 'Proffessional Assigned'
                          // : `${source.staff} is assigned for collection`,
                          : `No Staff is assigned for collection`,
                        'Sample Collected',
                        'Report Uploaded',
                      ],
                    }}
                  />
                  {source.step == 2 ? (
                    <View style={{alignSelf: 'center'}}>
                      <TouchableOpacity
                        style={[
                          styles.butt,
                          {flexDirection: 'row', width: 135},
                        ]}>
                        <Text style={[styles.name, {color: colors.white}]}>
                          Call collector
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
                {!source.status.order_placed.confirmed ? (
                  <View>
                    <View
                      style={[
                        styles.spacebetween,
                        {marginTop: 10, justifyContent: 'space-around'},
                      ]}>
                      <TouchableOpacity
                        onPress={() => {
                          setreschuduled({type: 'lab', ind: index});
                        }}
                        style={styles.butt}>
                        <Text style={[styles.name, {color: colors.white}]}>
                          RESCHUDLE
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setremoved({type: 'lab', ind: index});
                        }}
                        style={styles.cancelbutt}>
                        <Text style={[styles.name, {color: '#DB5461'}]}>
                          CANCEL
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
                {source.step == 3 ? (
                  <View style={{marginVertical: 12, width: '100%'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        width: '100%',
                      }}>
                      <TouchableOpacity>
                        <Text style={[styles.time, {color: '#373737'}]}>
                          Prescription.pdf
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#373737',
                        textAlign: 'center',
                        marginVertical: 10,
                      }}>
                      RATE YOUR EXPERIENCE
                    </Text>
                    <View style={{alignSelf: 'center'}}>
                      <Rating
                        showRating={false}
                        startingValue={4}
                        ratingCount={5}
                        imageSize={27}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(index);
                        // refRBSheet.current.open()
                      }}
                      style={[
                        styles.butt,
                        {
                          height: 27,
                          marginTop: 15,
                          alignSelf: 'center',
                          width: 101,
                        },
                      ]}>
                      <Text style={[styles.name, {color: colors.white}]}>
                        ADD A REVIEW
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
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
            {memlist.map((source,i)=>{
              return (
                <TouchableOpacity
                key={i}
                  onPress={() => {
                    onChangeSearch(source)
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
                      {source}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
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
                setDialoglab(null);
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
                  Family member 1
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDialoglab(null);
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
                  Family member 2
                </Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.spacebetween, {paddingVertical: 5}]}>
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
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const ModalReschedule = () => {
    return (
      <Modal
        visible={reschuduled !== null}
        animated
        onRequestClose={() => {
          setreschuduled(null);
        }}
        transparent={true}
        animationType="fade">
        <View style={styles.Modalmem}>
          <View
            style={[
              styles.modalViewMem,
              {backgroundColor: '#FFDE70', width: '95%', alignSelf: 'center'},
            ]}>
            <View style={styles.spacebetween}>
              <Text style={{}}></Text>
              <TouchableOpacity onPress={() => setreschuduled(null)}>
                <Image style={{height: 17, width: 17}} source={links.wrong} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#373737',
                textAlign: 'center',
                marginVertical: 10,
              }}>
              You can only reschedule two times and once you reschedule you
              cannot cancel the appointment
            </Text>
            <TouchableOpacity style={[styles.butt, {alignSelf: 'center'}]}>
              <Text style={[styles.name, {color: colors.white}]}>
                RESCHUDLE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const ModalRemove = () => {
    return (
      <Modal
        visible={removed !== null}
        animated
        onRequestClose={() => {
          setremoved(null);
        }}
        transparent={true}
        animationType="fade">
        <View style={styles.Modalmem}>
          <View
            style={[
              styles.modalViewMem,
              {backgroundColor: '#FFDE70', width: '95%', alignSelf: 'center'},
            ]}>
            <View style={styles.spacebetween}>
              <Text style={{}}></Text>
              <TouchableOpacity onPress={() => setremoved(null)}>
                <Image style={{height: 17, width: 17}} source={links.wrong} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#373737',
                textAlign: 'center',
                marginVertical: 10,
              }}>
              Are you sure you want to cancel
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#373737',
                textAlign: 'center',
                marginVertical: 10,
              }}>
              *Cancellation can only be done one hour before the selected time
            </Text>
            <TouchableOpacity
              style={[
                styles.cancelbutt,
                {alignSelf: 'center', backgroundColor: '#DB5461'},
              ]}
              onPress={()=>{
                removeorder(removed);
              }}>
              <Text style={[styles.name, {color: colors.white}]}>CANCEL</Text>
            </TouchableOpacity>
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
          <Text style={styles.head}>My Orders</Text>
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
        <ModalReschedule />
        <ModalRemove />
        <Modal
          animationType="slide"
          transparent
          visible={isModalVisible !== null}
          presentationStyle="overFullScreen"
          onDismiss={toggleModalVisibility}>
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
              <View
                style={{
                  width: '80%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={styles.name}>Add a Written review</Text>
                <TouchableOpacity onPress={() => toggleModalVisibility()}>
                  <Image style={{height: 17, width: 17}} source={links.wrong} />
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder="Enter Name..."
                placeholderTextColor={'#979797'}
                value={userreview}
                multiline={true}
                numberOfLines={3}
                style={styles.textInput}
                onChangeText={value => setuserreview(value)}
              />

              {/** This button is responsible to close the modal */}
              <Button
                color={colors.purple}
                title="Submit"
                onPress={toggleModalVisibility}
              />
            </View>
          </View>
        </Modal>
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

  stepIndicator: {
    height: 200,
    // width: '100%',
    flexDirection: 'row',
  },
  butt: {
    height: 35,
    width: 129,
    borderRadius: 6,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelbutt: {
    height: 35,
    width: 91,
    borderRadius: 6,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0000001F',
  },
  buttonT: {
    fontSize: 10,
    color: colors.white,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
    borderRadius: 6,
    height: 30,
    width: 77,
    alignSelf: 'center',
  },
  BottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  review: {
    height: 158,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#707070',
    fontSize: 12,
    paddingLeft: 10,
    marginVertical: 10,
    alignItems: 'flex-start',
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '40%',
    elevation: 5,
    transform: [{translateX: -(SCREEN_WIDTH * 0.4)}, {translateY: -90}],
    height: 230,
    width: SCREEN_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 7,
  },
  textInput: {
    width: '80%',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    color: '#373737',
    marginBottom: 8,
    height: 120,
  },
});

export default MyOrders;
