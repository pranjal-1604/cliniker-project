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
import AsyncStorage from '@react-native-community/async-storage';
import Geocoder from 'react-native-geocoding';
Geocoder.init('AIzaSyDnUKDaH4LHzlZXG91ptYgBBa8sX_jzw3k');

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import backIcon from '../assets/back-black.png';

export default function AddAddress({navigation, route}) {
  const {details} = route.params;
  const [userdetails, setUserdetails] = useState();
  const [uid, setUid] = useState();

  const mapquest = 'XwSSJqgzxK8fSevkqLWxOLM0ifFiABWN';
  const [address, setaddress] = useState({
    doc_id: details.doc_id,
    address_line1: details.address_line1,
    address_line2: details.address_line2,
    address_line3: details.address_line3,
    pincode: details.pincode,
    lon: details.lon,
    lat: details.lat,
  });

  function getCoordinatesFromAddress(type) {
    return new Promise(resolve => {
      const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${mapquest}&location=${address.address_line1},${address.address_line2},${address.address_line3},${address.pincode}`;
      fetch(url)
        .then(res => res.json())
        .then(resJson => {
          // the response had a deeply nested structure :/
          // console.log(resJson.results[0].locations[0].displayLatLng.lat);
          // console.log(resJson.results[0].locations[0].displayLatLng.lng);
          type == 'submit'
            ? submit(
                resJson.results[0].locations[0].displayLatLng.lng,
                resJson.results[0].locations[0].displayLatLng.lat,
              )
            : edit(
                address.doc_id,
                resJson.results[0].locations[0].displayLatLng.lng,
                resJson.results[0].locations[0].displayLatLng.lat,
              );
          // if (
          //   resJson &&
          //   resJson.Response &&
          //   resJson.Response.View &&
          //   resJson.Response.View[0] &&
          //   resJson.Response.View[0].Result &&
          //   resJson.Response.View[0].Result[0]
          // ) {
          //   console.log(
          //     resJson.Response.View[0].Result[0].Location.Address.Label,
          //   );
          // } else {
          //   console.log('not found');
          // }
        })
        .catch(e => {
          console.log('Error in getAddressFromCoordinates', e);
          resolve();
        });
    });
    // Geocoder.from('Colosseum')
    //   .then(json => {
    //     var location = json.results[0].geometry.location;
    //     console.log(location);
    //   })
    //   .catch(error => console.warn(error));
  }

  const submit = async (long, lati) => {
    // console.log('do add for' + address);
    // console.log({...address, lon: long, lat: lati});
    firestore()
      .collection('user')
      .doc(uid)
      .collection('address')
      .add({...address, lon: long, lat: lati})
      .then(() => {
        console.log('address added!');
        navigation.navigate('Profilescreen');
      });
  };

  const edit = async (doc_id, long, lati) => {
    // console.log('do edit for' + address);
    // console.log(address);
    // console.log(doc_id);
    delete address.doc_id;
    firestore()
      .doc('user/' + uid)
      .collection('address')
      .doc(doc_id)
      .set({...address, lon: long, lat: lati}, {merge: true})
      .then(() => {
        console.log('Address Edited!');
        navigation.navigate('Profilescreen');
      });
  };

  useEffect(() => {
    // console.log(details);
    const user = auth().currentUser;
    setUid(user.uid);
  }, []);

  const onChange = (text, name) => {
    setaddress({...address, [name]: text});
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
            <Text style={[styles.font, styles.headerTitle]}>
              {details.type == 'edit' ? 'EDIT ADDRESS' : 'ADD ADDRESS'}
            </Text>
            <Text></Text>
          </View>
        </View>
        <View style={styles.main}>
          <View style={styles.card}>
            <View>
              <TextInput
                value={address.address_line1}
                placeholder={'Address Line 1'}
                placeholderTextColor={'#979797'}
                onChangeText={text => onChange(text, 'address_line1')}
                style={styles.TextInput}
              />
            </View>
            <View>
              <TextInput
                value={address.address_line2}
                placeholder={'City'}
                placeholderTextColor={'#979797'}
                onChangeText={text => onChange(text, 'address_line2')}
                style={styles.TextInput}
              />
            </View>
            <View>
              <TextInput
                value={address.address_line3}
                placeholder={'State'}
                placeholderTextColor={'#979797'}
                onChangeText={text => onChange(text, 'address_line3')}
                style={styles.TextInput}
              />
            </View>
            <View>
              <TextInput
                value={address.pincode}
                placeholder={'Pincode'}
                placeholderTextColor={'#979797'}
                onChangeText={text => onChange(text, 'pincode')}
                style={styles.TextInput}
              />
            </View>
            {details.type == 'edit' ? (
              <View style={{marginTop: 20}}>
                <TouchableOpacity
                  onPress={() => getCoordinatesFromAddress('edit')}
                  style={[styles.button, {backgroundColor: '#835CB9'}]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.buttonT, {}]}>EDIT ADDRESS</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{marginTop: 20}}>
                <TouchableOpacity
                  onPress={() => getCoordinatesFromAddress('submit')}
                  style={[styles.button, {backgroundColor: '#835CB9'}]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.buttonT, {}]}>ADD ADDRESS</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
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
    color: '#979797',
    fontSize: 16,
    fontWeight: 'bold',
  },
  TextInput: {
    width: '100%',
    alignSelf: 'center',
    height: 40,
    marginTop: 12,
    borderBottomWidth: 1,
    paddingLeft: 10,
    fontSize: 16,
    borderColor: '#979797',
    color: '#000',
  },
});
