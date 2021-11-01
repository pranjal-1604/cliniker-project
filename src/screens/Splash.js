/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import {CommonActions} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import colors from '../components/colors';
import links from '../components/links';
import {SafeAreaProvider} from 'react-native-safe-area-context';
async function GetAllPermissions() {
  try {
    if (Platform.OS === 'android') {
      const userResponse = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      console.log(userResponse);
      return userResponse;
    }
  } catch (err) {
    Warning(err);
  }
  return null;
}

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const Splash = props => {
  const resetAction = CommonActions.reset({
    index: 0,
    routes: [{name: 'DrawerStack'}],
  });

  useEffect(() => {
    nextPage();
  }, []);

  const nextPage = async () => {
    let f;

    await GetAllPermissions();
    f = async () => {
      const user = auth().currentUser;
      storeData(user.uid);
      var docRef = firestore().collection('user').doc(user.uid);

      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            props.navigation.dispatch(resetAction);
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
            props.navigation.navigate('Details');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    };
    window.setTimeout(function () {
      f();
    }, 2000);
  };

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('uid', value);
    } catch (e) {
      // saving error
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.background}>
        {/* <Image
          style={styles.absimage}
          source={require('../assets/cliniker_purple.png')}></Image> */}

        <View style={styles.main}>
          <Image
            source={require('../assets/cliniker_white.png')}
            style={styles.clinikerlogo}
          />
          <Text style={styles.subHead}>Services Offered</Text>
          <Text style={styles.description}>
            Doctor Consultation | Physiotherapy Services | Blood Pressure Check
            | Nebulization | Dressing | Injection | Cannula | Drip Services at
            clinic and home
          </Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    // borderColor: 'red',
    // borderWidth: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  background: {
    backgroundColor: colors.purple,
    flex: 1,
  },
  absimage: {
    position: 'absolute',
    height: SCREEN_HEIGHT / 2,
    width: SCREEN_HEIGHT / 2,
    // right: 50,
    alignSelf: 'center',
  },
  clinikerlogo: {
    height: 80,
    width: 80,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    resizeMode: 'cover',
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageView: {
    flex: 1,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    top: 0,
    left: 0,
    width: '100%',
  },
  logo: {
    resizeMode: 'contain',
    width: SCREEN_WIDTH / 1.2,
    opacity: 1,
  },
  tagLine: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH - 32,
  },
  subHead: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '800',
    fontSize: 16,
  },
  description: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default Splash;
