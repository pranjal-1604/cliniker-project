import React, {useState, useEffect} from 'react';

import {connect} from 'react-redux';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';

import BookingHeader from '../components/BookingHeader';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import links from '../components/links';
import colors from '../components/colors';

const Profilescreen = props => {
  // console.log('inside user profile');
  const [user, setUser] = useState('');
  const [userdetail, setuserdetail] = useState({});
  const [activeaddress, setactiveaddress] = useState({});
  const [firstaddress, setfirstaddress] = useState({});
  // const [activefamily, setactivefamily] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = auth().currentUser;
    setUser(user);
    getuserdetail(user.uid);
    getfirstaddress(user.uid);
  }, []);

  const getuserdetail = uid => {
    const subscriber = firestore()
      .collection('user')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        // console.log('User data: ', documentSnapshot.data().Info);
        setuserdetail(documentSnapshot.data().Info);
        setactiveaddress(documentSnapshot.data().activeaddress);
        // setactivefamily(documentSnapshot.data().activefamily);
      });

    // Stop listening for updates when no longer required
    // return () => subscriber();
  };

  const getfirstaddress = uid => {
    const subscriber = firestore()
      .collection('user')
      .doc(uid)
      .collection('address')
      .limit(1)
      .onSnapshot(documentSnapshot => {
        documentSnapshot.forEach(
          doc => {
            setfirstaddress(doc.data());
          },
          (error = () => {
            console.log('no document exist');
          }),
        );
      });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.mainView}>
          {!loading && (
            <View style={styles.container}>
              <View style={[styles.headerBackground]}>
                <BookingHeader title="" navigation={props.navigation} />

                <View style={styles.profileContainer}>
                  <View style={styles.profileBox}>
                    <Image
                      source={
                        userdetail.img == ''
                          ? links.doctor
                          : {
                              uri: `data:${userdetail.img?.type};base64,${userdetail.img?.code}`,
                            }
                      }
                      style={styles.thumb}
                    />
                    {/* <TouchableOpacity style={styles.uploadBtn}>
                      <Image source={camIcon} style={styles.IconXl} />
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity>
                      <Text style={[styles.textOrange]}>Add Password</Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
                <View style={[styles.roundBox]}>
                  <View style={styles.nameC}>
                    <Text
                      style={[
                        {
                          textAlign: 'center',
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: '#373737',
                        },
                      ]}>
                      {userdetail.name}
                    </Text>
                  </View>
                  {/* <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate('UpdateProfile');
                    }}>
                    <Text style={[styles.textOrange, styles.subAction]}>
                      <Image source={editIcon} style={styles.iconSm} /> Edit
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </View>

              <View style={styles.page}>
                <View style={styles.pageContent}>
                  <View style={styles.card}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colors.purple,
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}>
                      Personal Information
                    </Text>
                    <View style={[styles.spaceBetween, {marginTop: 14}]}>
                      <Text style={styles.main}>Email</Text>
                      <Text style={styles.sub}>{userdetail.email}</Text>
                    </View>
                    <View style={[styles.spaceBetween, {marginTop: 14}]}>
                      <Text style={styles.main}>Contact No.</Text>
                      <Text style={styles.sub}>{userdetail.phone_no}</Text>
                    </View>
                    <View style={[styles.spaceBetween, {marginTop: 14}]}>
                      <Text style={styles.main}>Age</Text>
                      <Text style={styles.sub}>{userdetail.age}</Text>
                    </View>
                    <View style={[styles.spaceBetween, {marginTop: 14}]}>
                      <Text style={styles.main}>Gender</Text>
                      <Text style={styles.sub}>{userdetail.gender}</Text>
                    </View>
                  </View>

                  <View style={styles.card}>
                    <Text style={styles.main}>Selected Address -</Text>
                    {/* <Text style={styles.sub}>{}</Text> */}
                    <Text style={styles.sub}>
                      {activeaddress.address_line1
                        ? activeaddress.address_line1
                        : firstaddress.address_line1}
                    </Text>
                    <Text style={styles.sub}>
                      {activeaddress.address_line2
                        ? activeaddress.address_line2
                        : firstaddress.address_line2}
                    </Text>
                    <Text style={styles.sub}>
                      {activeaddress.address_line3
                        ? activeaddress.address_line3
                        : firstaddress.address_line3}{' '}
                      {activeaddress.pincode
                        ? activeaddress.pincode
                        : firstaddress.pincode}
                    </Text>
                  </View>
                  <View style={styles.card}>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate('Managerecords')}
                      style={styles.withsep}>
                      <Image
                        style={{height: 12, width: 12, marginRight: 5}}
                        source={links.report}
                      />
                      <Text style={styles.main}>Attachments and reports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate('Notifications')}
                      style={styles.withsep}>
                      <Image
                        style={{height: 12, width: 12, marginRight: 5}}
                        source={links.bell}
                      />
                      <Text style={styles.main}>Notifications/Reminders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('AllProfiles', {
                          profile: userdetail,
                          // activefamily: activefamily,
                        })
                      }
                      style={styles.withsep}>
                      <Text
                        style={[
                          styles.main,
                          {
                            paddingLeft: 17,
                          },
                        ]}>
                        MyProfile
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate('Addresses')}
                      style={[styles.withsep, {borderBottomWidth: 0}]}>
                      <Image
                        style={{height: 12, width: 12, marginRight: 5}}
                        source={links.edit}
                      />
                      <Text style={styles.main}>My Addresses</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  profileBox: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 9,
    width: 150,
  },
  thumb: {
    borderColor: '#ccc',
    borderRadius: 100,
    width: 130,
    height: 130,
  },
  spaceBetween: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CalenderContainer: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
  },
  infoRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  inputGroup: {
    width: 100,
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: '#f4f4f4',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  feeArea: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  fees: {
    color: '#fff',
  },
  price: {
    fontSize: 26,
    color: '#f58634',
    fontWeight: '700',
  },
  textOrange: {
    paddingTop: 16,
    color: '#f58634',
  },
  pt0: {
    paddingTop: 0,
  },
  textBlue: {
    marginRight: 8,
    marginTop: 16,
    fontWeight: '700',
  },
  helperText: {
    fontWeight: '700',
    color: '#003974',
  },
  IconXl: {
    width: 36,
    height: 36,
  },
  Icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  iconSm: {
    width: 18,
    height: 18,
  },
  textWhite: {
    color: '#fff',
  },

  safeContainer: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    backgroundColor: colors.bg,
  },
  pageContent: {
    width: SCREEN_WIDTH - 32,
    paddingVertical: 16,
  },
  headerBackground: {
    width: '100%',
    height: 250,
    flex: 1,
    backgroundColor: '#835CB9',
    justifyContent: 'flex-start',
  },
  roundBox: {
    height: 120,
    backgroundColor: colors.bg,
    // borderTopLeftRadius: 50,
    // borderTopRightRadius: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 75,
    // borderWidth: 1,
    borderColor: '#003974',
    flex: 1,
    // alignItems: 'flex-end',
  },
  nameC: {
    paddingHorizontal: 15,
    paddingVertical: 3,
    backgroundColor: '#FFDE70',
    borderRadius: 15,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.white,
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 13,
  },
  main: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#373737',
  },
  sub: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#646464',
  },
  withsep: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderColor: '#373737',
  },
});

export default Profilescreen;
