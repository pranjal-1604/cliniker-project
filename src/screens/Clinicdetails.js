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
  Animated,
} from 'react-native';
import links from '../components/links';
import colors from '../components/colors';
import {getDoctorList, getClinicList} from '../services/firebase';
import {Rating} from '../components/ratings/index.tsx';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import backIcon from '../assets/back-black.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Clinicdetails({navigation, route}) {
  const {details} = route.params;
  const doctors = [{key: 1}, {key: 2}];
  const photos = [{key: 1}, {key: 2}, {key: 3}];
  const labs = [{key: 1}, {key: 2}];
  const [doctord, setdoctord] = useState(false);
  const scrollX = new Animated.Value(0);
  const [labd, setlabd] = useState(false);
  const [doctor, setdoctor] = useState([]);
  const [lab, setlab] = useState([]);
  let position = Animated.divide(scrollX, SCREEN_WIDTH - 50);
  const [search, setsearch] = useState();

  useState(() => {

    firestore()
    .collection('doctor')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        console.log('User ID: ', documentSnapshot.data());
        setdoctor(prev => [...prev,documentSnapshot.data()]);
      });
    });

    console.log("details", details);
    console.log("doctor data", doctors)
  }, []);
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.customHeader]}>
          <View style={[styles.headerLeft]}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Image source={backIcon} style={styles.headerIcon} />
            </TouchableOpacity>
            <Text style={[styles.font, styles.headerTitle]}>
              {details.name.toUpperCase()}
            </Text>
            <Text></Text>
          </View>
        </View>
        <View
          style={{
            paddingTop: 10,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{height: 160, width: SCREEN_WIDTH - 50}}>
            <ScrollView
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                {
                  useNativeDriver: false,
                },
              )}
              scrollEventThrottle={16}>
              {photos.map((source, i) => {
                return (
                  <TouchableOpacity key={source.photoKey} activeOpacity={0.7}>
                    <Image
                      key={i}
                      style={styles.clinicimg}
                      // resizeMode={'cover'}
                      source={links.clinic}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View style={{flexDirection: 'row'}}>
            {photos.map((_, i) => {
              let opacity = position.interpolate({
                inputRange: [i - 1, i, i + 1],
                outputRange: [0.3, 1, 0.3],
                // inputRange: [i - 0.50000000001, i - 0.5, i, i + 0.5, i + 0.50000000001], // only when position is ever so slightly more than +/- 0.5 of a dot's index
                // outputRange: [0.3, 1, 1, 1, 0.3], // is when the opacity changes from 1 to 0.3
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={i}
                  style={{
                    opacity,
                    height: 10,
                    width: 10,
                    backgroundColor: '#595959',
                    margin: 8,
                    borderRadius: 5,
                  }}
                />
              );
            })}
          </View>
        </View>
        <View style={styles.main}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={links.loc} style={styles.locimg} />
            <Text style={styles.name}>{details.location.place}</Text>
          </View>
          <Text style={[styles.speciality, {marginTop: 7, marginLeft: 16}]}>
            {details.facility.map(source => {
              return source + ', ';
            })}
          </Text>
          <View style={{marginTop: 15}}>
            <TouchableOpacity
              onPress={() => {
                setdoctord(!doctord);
              }}
              style={styles.spacebetween}>
              <Text style={styles.headerTitle}>Doctor Consultation</Text>

              <Image
                source={doctord == true ? links.arrow_up : links.arrow_down}
                style={styles.arr}
              />
            </TouchableOpacity>
            {doctord == true ? (
              <View>
                {doctor.map((source, index) => {
                  return (
                    <>
                    {source.clinics.map((s, i)=>{
                      return (
                        <>
                        {s.id == details.id ? 
                        <View key={index} style={styles.card}>
                        <View style={styles.spacebetween}>
                          <View>
                            <Text style={styles.name}>Dr. {source.name}</Text>
                            <Text style={styles.speciality}>{source.specialist[0]}</Text>
                          </View>
                          <View style={{}}>
                            <Rating
                              showRating={false}
                              startingValue={4}
                              ratingCount={5}
                              readonly
                              imageSize={12}
                              style={{backgroundColor: colors.bg}}
                            />
                          </View>
                        </View>
                        <View
                          style={[
                            styles.spacebetween,
                            {marginTop: 13, alignItems: 'flex-start'},
                          ]}>
                          <View style={{width: '50%'}}>
                            <Text style={styles.name}>Area of Expertise</Text>
                            <Text style={styles.speciality}>
                              {source.expertise[0]}
                            </Text>
                            <Text style={styles.speciality}>
                              {source.expertise[1]}
                            </Text>
                            <Text style={styles.speciality}>
                              {source.expertise[2]}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: '50%',
                              alignItems: 'flex-end',
                            }}>
  
                            {source.clinics.map((sourcee, index)=>{
                              return (
                                <>
                                  {sourcee.id == details.id ? 
                                      <View style={{alignItems: 'flex-start'}}>
                                        <Text style={styles.time}>
                                          Timing - {sourcee.timing.intime}:00am-{sourcee.timing.outime}:00am
                                        </Text>
                                        <Text style={styles.time}>
                                          Days -
                                          {sourcee.days.map((ss, index)=>{
                                            return (
                                              <>
                                                {" "+ss+" "}
                                              </>
                                            )
                                          })}
                                        </Text>
                                      </View> : null
                                  }
                                </>
                              )
                            })}
                          </View>
                        </View>
                        <View style={[styles.spacebetween, {marginTop: 13}]}>
                          <Text style={styles.name}>
                            Consultation Fee -{' '}
                            <Text style={{color: colors.purple}}>{source.fees}</Text>
                          </Text>
                          <TouchableOpacity style={styles.button}
                            onPress={()=>{
                              console.log(JSON.stringify(source, null, 2))
                              console.log("id ",i," ",s.id)
                              navigation.navigate('Bookcliniccalender',{clinic_details: i, doctor_details: source})
                            }}
                          >
                            <Text style={styles.buttonT}>BOOK APPOINTMENT</Text>
                          </TouchableOpacity>
                        </View>
                      </View> : null
                      
                      }
                        </>
                      )
                    })}
                    </>
                  );
                })}
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                console.log("doctoree ",doctor);
                setlabd(!labd);
              }}
              style={[
                styles.spacebetween,
                {marginTop: 15, borderTopWidth: 1, paddingTop: 10},
              ]}>
              <Text style={styles.headerTitle}>Lab Consultation</Text>

              <Image
                source={labd == true ? links.arrow_up : links.arrow_down}
                style={styles.arr}
              />
            </TouchableOpacity>
            {labd == true ? (
              <View>
                <View>
                  <TextInput
                    placeholder="Search"
                    onChangeText={text => setsearch(text)}
                    value={search}
                    style={styles.textinput}
                  />
                  <Image source={links.search} style={styles.search} />
                </View>
                {details.lab_services.map((source, index) => {
                  return (
                    <View>
                      <View style={styles.card}>
                        <View style={styles.spacebetween}>
                          <View>
                            <Text style={styles.name}>{source.lab_name}</Text>
                            <Text style={styles.speciality}>{source.lab_test_name}</Text>
                          </View>
                          <View style={{}}>
                            <Rating
                              showRating={false}
                              startingValue={4}
                              ratingCount={5}
                              readonly
                              imageSize={12}
                              style={{backgroundColor: colors.bg}}
                            />
                          </View>
                        </View>
                        <View
                          style={[
                            styles.spacebetween,
                            {marginTop: 13, alignItems: 'flex-start'},
                          ]}>
                          <View style={{width: '50%'}}>
                            <Text style={styles.name}>Facilities</Text>
                            <Text style={styles.speciality}>
                              Doctor Consultation , Lab Test
                            </Text>
                          </View>
                          <View
                            style={{
                              width: '50%',
                              alignItems: 'flex-end',
                            }}>
                            <View style={{alignItems: 'flex-start'}}>
                              <Text style={styles.time}>
                                Report in - 5 Hours
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={[styles.spacebetween, {marginTop: 13}]}>
                          <Text style={styles.name}>
                            Consultation Fee -{' '}
                            <Text style={{color: colors.purple}}>{source.fees}</Text>
                          </Text>
                          <TouchableOpacity style={styles.button}
                            onPress={()=>{
                              // props.navigation.navigate('', {})
                              // console.log("source ",{
                              //   test_name : source.lab_test_name,
                              //   lab_name: source.lab_name,
                              //   clinic_name: details.name,
                              //   fees: source.fees,
                              //   clinic: details,
                              //   type: 'labtest',
                              //   date: new Date()
                              // });
                              console.log(JSON.stringify({
                                test_name : source.lab_test_name,
                                lab_name: source.lab_name,
                                clinic_name: details.name,
                                fees: source.fees,
                                clinic: details,
                                type: 'labtest',
                                date: new Date()
                              }, null, 2));
                              navigation.navigate('BooklabCalender', {source: {
                                test_name : source.lab_test_name,
                                lab_name: source.lab_name,
                                clinic_name: details.name,
                                fees: source.fees,
                                clinic: details,
                                type: 'labtest',
                                date: new Date()
                              }})
                            }}
                          >
                            <Text style={styles.buttonT}>BOOK APPOINTMENT</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  customHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    height: 56,
    paddingHorizontal: 16,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    elevation: 4,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcon: {
    width: 22,
    height: 22,
  },
  headerTitle: {
    color: '#373737',
    fontSize: 16,
    fontWeight: 'bold',
  },
  main: {
    width: SCREEN_WIDTH - 32,
    paddingVertical: 12,
    alignSelf: 'center',
  },
  clinicimg: {
    width: SCREEN_WIDTH - 50,
    height: 150,
    alignSelf: 'center',
    borderRadius: 12,
    marginTop: 10,
  },
  name: {
    color: '#373737',
    fontSize: 12,
    fontWeight: 'bold',
  },
  speciality: {
    color: '#646464',
    fontSize: 12,
  },
  time: {
    color: '#373737',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subT: {
    color: '#646464',
    fontSize: 11,
    fontWeight: 'bold',
  },
  locimg: {
    width: 7,
    height: 10,
    marginRight: 8,
  },
  spacebetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  arr: {
    height: 20,
    width: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 6,
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 10,
    elevation: 4,
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
    width: 130,
    elevation: 6,
  },
  textinput: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 6,
    alignSelf: 'center',
    height: 50,
    marginTop: 12,
    paddingLeft: 70,
    elevation: 4,
    color: colors.black,
  },
  search: {
    height: 30,
    width: 30,
    position: 'absolute',
    left: 20,
    top: 20,
    elevation: 5,
  },
});
