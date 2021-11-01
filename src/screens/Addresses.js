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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import colors from '../components/colors';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import backIcon from '../assets/back-black.png';

export default function Addresses({navigation, route}) {
  // const {profile} = route.params;
  const [user, setUser] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [activeaddress, setactiveaddress] = useState({});

  useEffect(() => {
    const user = auth().currentUser;
    setUser(user);
    getactiveaddress(user.uid);
    getAddresses(user.uid);
  }, []);

  const getactiveaddress = uid => {
    const subscriber = firestore()
      .collection('user')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        // console.log('User data: ', documentSnapshot.data().activeaddress);
        setactiveaddress(documentSnapshot.data().activeaddress);
      });
  };

  const getAddresses = async uid => {
    var address_list = [];
    const snapshot = await firestore()
      .doc('user/' + uid)
      .collection('address')
      .get();
    snapshot.docs.map(doc => {
      // console.log(doc.data());
      address_list.push({...doc.data(), doc_id: doc.id});
    });
    setAddresses(address_list);
    console.log('Address:', address_list);
  };

  const setAsActive = async address => {
    const subscriber = await firestore()
      .collection('user')
      .doc(user.uid)
      .set({activeaddress: address}, {merge: true});
    // console.log('Address with id:' + address.doc_id + 'set as active');
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
            <Text style={[styles.font, styles.headerTitle]}>MY ADDRESSES</Text>
            <Text></Text>
          </View>
        </View>
        {addresses.map((address, index) => {
          return (
            <View key={index} style={styles.main}>
              <View style={styles.card}>
                <Text style={styles.add}>{address.address_line1}</Text>
                <Text style={styles.add}>{address.address_line2}</Text>
                <Text style={styles.add}>City -{address.address_line3}</Text>
                <Text style={styles.add}>Pincode - {address.pincode}</Text>
                <View style={styles.spacebetween}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AddAddress', {
                        details: {
                          type: 'edit',
                          doc_id: address?.doc_id,
                          address_line1: address.address_line1,
                          address_line2: address.address_line2,
                          address_line3: address.address_line3,
                          pincode: address.pincode,
                        },
                      })
                    }
                    style={[styles.button, {backgroundColor: '#835CB961'}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={[styles.buttonT, {color: '#373737'}]}>
                        EDIT ADDRESS
                      </Text>
                      <Image
                        style={{height: 20, marginLeft: 4, width: 20}}
                        source={links.arrow_grey}
                      />
                    </View>
                  </TouchableOpacity>
                  {activeaddress?.doc_id == address?.doc_id ? (
                    <TouchableOpacity
                      style={[styles.button, {backgroundColor: 'green'}]}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[styles.buttonT, {}]}>ACTIVE</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setAsActive(address)}
                      style={[styles.button, {backgroundColor: '#835CB9'}]}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[styles.buttonT, {}]}>SET AS ACTIVE</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddAddress', {
              details: {
                type: 'add',
              },
            })
          }
          style={[
            styles.button,
            {backgroundColor: '#835CB9', width: 140, marginVertical: 10},
          ]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{height: 10, marginRight: 4, width: 10}}
              source={links.plus_yellow}
            />
            <Text style={[styles.buttonT, {}]}>ADD ADDRESS</Text>
          </View>
        </TouchableOpacity>
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
});
