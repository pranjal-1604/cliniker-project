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
  TextInput,
  Modal,
  Switch,
} from 'react-native';

import backIcon from '../assets/back-black.png';
import searchIcon from '../assets/search.png';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import colors from '../components/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import links from '../components/links';

export default function Settings(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [user, setUser] = useState('');
  const [userdetail, setuserdetail] = useState({});
  const [activeaddress, setactiveaddress] = useState({});
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    const user = auth().currentUser;
    setUser(user);
    getuserdetail(user.uid);
  }, []);

  const getuserdetail = uid => {
    const subscriber = firestore()
      .collection('user')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        setuserdetail(documentSnapshot.data().Info);
        setactiveaddress(documentSnapshot.data().activeaddress);
      });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}>
            <Image style={{height: 16, width: 16}} source={backIcon} />
          </TouchableOpacity>
          <Text style={styles.head}>SETTINGS</Text>
          <Text></Text>
        </View>
        <View style={styles.mainView}>
          <View style={styles.module}>
            <Text style={styles.smalltext}>Basic Settings</Text>
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => {
                  // props.navigation.navigate('Notifications');
                }}
                style={styles.spacebetween}>
                <Text style={styles.text}>Notifications Settings</Text>
                <Image
                  source={links.arr_right}
                  style={{height: 20, width: 20, marginRight: 5}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.module}>
            <Text style={styles.smalltext}>Reminder Settings</Text>
            <View style={styles.card}>
              <View style={styles.spacebetween}>
                <Text style={styles.text}>Alerts</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#835CB966'}}
                  thumbColor={isEnabled ? colors.purple : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
            </View>
          </View>
          <View style={styles.module}>
            <Text style={styles.smalltext}>General Settings</Text>
            <View style={styles.card}>
              <Text
                onPress={() => {
                  props.navigation.navigate('AllProfiles', {
                    profile: userdetail,
                    // activefamily: activefamily,
                  });
                }}
                style={[styles.text, {paddingVertical: 4}]}>
                Profiles Added
              </Text>
              <Text
                onPress={() => {
                  props.navigation.navigate('Addresses');
                }}
                style={[styles.text, {paddingVertical: 4}]}>
                Addresses Added
              </Text>
              <Text
                onPress={() => {
                  props.navigation.navigate('Contact');
                }}
                style={[styles.text, {paddingVertical: 4}]}>
                Contact Us
              </Text>
              <Text
                onPress={() => {
                  props.navigation.navigate('Privacy');
                }}
                style={[styles.text, {paddingVertical: 4}]}>
                Privacy Policy
              </Text>
            </View>
          </View>
          <View style={styles.module}>
            <Text style={styles.smalltext}>Information</Text>
            <View style={styles.card}>
              <Text
                onPress={() => {
                  props.navigation.navigate('About');
                }}
                style={[styles.text, {paddingVertical: 4}]}>
                About Cliniker
              </Text>
              <Text
                onPress={() => {
                  props.navigation.navigate('Clinicoins');
                }}
                style={[styles.text, {paddingVertical: 4}]}>
                What are clinicoins?
              </Text>
              <Text
                onPress={() => {
                  props.navigation.navigate('Healthvault');
                }}
                style={[styles.text, {paddingVertical: 4}]}>
                Health vault
              </Text>
              <Text
                onPress={() => {
                  props.navigation.navigate('Blogscreen');
                }}
                style={[styles.text, {paddingVertical: 4}]}>
                Blogs
              </Text>
              <Text
                onPress={() => {
                  props.navigation.navigate('Partners');
                }}
                style={[styles.text, {paddingVertical: 4}]}>
                Want to be a partner?
              </Text>
              <Text
                onPress={() => {
                  props.navigation.navigate('FAQ');
                }}
                style={[styles.text, {paddingVertical: 4}]}>
                FAQ's
              </Text>
              <Text
                onPress={() => {
                  props.navigation.navigate('Howtouse');
                }}
                style={[styles.text, {paddingVertical: 4}]}>
                How to use?
              </Text>
            </View>
          </View>
          <View style={{width: '100%'}}>
            <Image style={styles.img} source={links.like} />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonT}>Like us? Leave a rating</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    elevation: 4,
  },
  module: {
    marginTop: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    marginTop: 7,
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
  spacebetween: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  smalltext: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
    opacity: 0.71,
  },
  text: {
    fontSize: 16,
    color: '#373737',
    fontWeight: 'bold',
    width: '85%',
  },
  button: {
    backgroundColor: '#FFDE70',
    height: 32,
    width: '100%',
    borderRadius: 6,
    elevation: 4,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonT: {
    fontSize: 12,
    color: '#07070A',
    fontWeight: 'bold',
  },
  img: {
    height: 27,
    width: 27,
    alignSelf: 'center',
    marginTop: 20,
  },
});
