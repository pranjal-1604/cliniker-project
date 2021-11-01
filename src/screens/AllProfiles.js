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
import links from '../components/links';
import colors from '../components/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import backIcon from '../assets/back-black.png';

export default function AllProfiles({navigation, route}) {
  const {profile} = route.params;
  const [user, setUser] = useState('');
  const [familymembers, setfamilymembersdetail] = useState([]);
  const [activefamily, setactivefamily] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log('profile ', profile);
    const user = auth().currentUser;
    setUser(user);
    getactivefamily(user.uid);
    getfamilymemberdetail(user.uid);
  }, []);

  const getactivefamily = uid => {
    const subscriber = firestore()
      .collection('user')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        // console.log('User data: ', documentSnapshot.data().activefamily);
        setactivefamily(documentSnapshot.data().activefamily);
      });
  };

  const getfamilymemberdetail = async uid => {
    var familymembers_list = [];
    const snapshot = await firestore()
      .doc('user/' + uid)
      .collection('family')
      .get();
    snapshot.docs.map(doc => {
      // console.log(doc.id);
      familymembers_list.push({...doc.data(), doc_id: doc.id});
    });
    setfamilymembersdetail(familymembers_list);
    // console.log('Family Memebers:', familymembers_list);
  };

  const setAsActive = async member => {
    delete member.loc;
    delete member.loyalty_points;
    delete member.img;
    const subscriber = await firestore()
      .collection('user')
      .doc(user.uid)
      .set({activefamily: member}, {merge: true});
    console.log('Member with id:' + member?.doc_id + 'set as active');
  };

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
            <Text style={[styles.font, styles.headerTitle]}>My Profiles</Text>
            <Text></Text>
          </View>
        </View>
        <View style={styles.main}>
          <View style={styles.card}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={styles.img}
                source={
                  profile.img == ''
                    ? links.doctor
                    : {
                        uri: `data:${profile.img.type};base64,${profile.img.code}`,
                      }
                }
              />
              <View>
                <Text style={styles.add}>{profile.name}</Text>
                <Text style={styles.subtext}>Age - {profile.age}</Text>
                <Text style={styles.subtext}>Gender - {profile.gender}</Text>
              </View>
            </View>
            <View style={styles.spacebetween}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditProfile', {
                    details: {type: 'main', ...profile},
                  })
                }
                style={[styles.button, {backgroundColor: '#835CB961'}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[styles.buttonT, {color: '#373737'}]}>
                    EDIT PROFILE
                  </Text>
                  <Image
                    style={{height: 20, marginLeft: 4, width: 20}}
                    source={links.arrow_grey}
                  />
                </View>
              </TouchableOpacity>
              {activefamily?.doc_id == user.uid ? (
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: 'green'}]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.buttonT, {}]}>ACTIVE</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setAsActive({...profile, doc_id: user.uid})}
                  style={[styles.button, {backgroundColor: '#835CB9'}]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.buttonT, {}]}>SET AS ACTIVE</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {familymembers.map((member, index) => {
            return (
              <View style={styles.card} key={index}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image style={styles.img} source={links.doctor} />
                  <View>
                    <Text style={styles.add}>{member.name}</Text>
                    <Text style={styles.subtext}>Age - {member.age}</Text>
                    <Text style={styles.subtext}>Gender - {member.gender}</Text>
                  </View>
                </View>
                <View style={styles.spacebetween}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('EditProfile', {
                        details: {
                          type: 'member',
                          ...member,
                        },
                      })
                    }
                    style={[styles.button, {backgroundColor: '#835CB961'}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={[styles.buttonT, {color: '#373737'}]}>
                        EDIT PROFILE
                      </Text>
                      <Image
                        style={{height: 20, marginLeft: 4, width: 20}}
                        source={links.arrow_grey}
                      />
                    </View>
                  </TouchableOpacity>
                  {activefamily?.doc_id == member?.doc_id ? (
                    <TouchableOpacity
                      style={[styles.button, {backgroundColor: 'green'}]}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[styles.buttonT, {}]}>ACTIVE</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setAsActive(member)}
                      style={[styles.button, {backgroundColor: '#835CB9'}]}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[styles.buttonT, {}]}>SET AS ACTIVE</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddProfile', {routes: 'AllProfiles'})
            }
            style={[
              styles.button,
              {backgroundColor: '#835CB9', width: 160, marginVertical: 10},
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{height: 10, marginRight: 4, width: 10}}
                source={links.plus_yellow}
              />
              <Text style={[styles.buttonT, {}]}>ADD FAMILY MEMBER</Text>
            </View>
          </TouchableOpacity>
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
    marginTop: 20,
  },
  spacebetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '900',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    height: 32,
    width: 115,
    alignSelf: 'center',
    marginTop: 10,
  },
  add: {
    color: '#373737',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#646464',
    fontSize: 12,
    fontWeight: 'bold',
  },
  img: {
    height: 60,
    width: 60,
    borderRadius: 40,
    marginRight: 15,
  },
});
