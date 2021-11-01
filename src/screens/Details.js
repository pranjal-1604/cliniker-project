import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {CommonActions} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
// import Geocoder from 'react-native-geocoding';
// Geocoder.init('AIzaSyA0Vhnt-rCr4cuZdefq0x08SaKtiZQ75T4');

import colors from '../components/colors';
import links from '../components/links';

const Details = props => {
  const phonenoFormat = /^\d{10,10}$/;
  const [type, settype] = useState('male');

  const [loading1, setloading1] = useState(false);
  const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const [user, setuser] = useState();
  const [validemail, setValidEmail] = useState(true);
  const [genderselection, setgenderselection] = useState();
  const genderlist = ['male', 'female', 'other'];
  const [dialog, setDialog] = useState(null);

  const resetAction = CommonActions.reset({
    index: 0,
    routes: [{name: 'DrawerStack'}],
  });
  const [formData, setFormaData] = useState({
    name: '',
    age: '',
    email: '',
    gender: '',
    phone_no: '',
    loyalty_points: 0,
    loc: {},
    addresses: [],
    img: '',
  });
  const {name, age, phone_no, email, gender} = formData;

  const initiallFormDataError = {
    name_err: '',
    age_err: '',
    email_err: '',
    gender_err: '',
  };

  const [formDataError, setFormDataError] = useState({
    ...initiallFormDataError,
  });
  const {name_err, age_err, email_err, gender_err} = formDataError;

  /********************useState for sending otp for*****************/

  const onChange = (text, name) => {
    if (name == 'email') {
      setValidEmail(emailValidationRegex(text));
    }
    setFormaData({...formData, [name]: text});
    setFormDataError({...initiallFormDataError});
  };

  const emailValidationRegex = email => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  async function getLoc() {
    setloading1(true);
    await Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        // setFormaData({
        //   ...formData,
        //   loc: {lat: position.coords.latitude, lon: position.coords.longitude},
        // });
        onSubmit(position.coords.latitude, position.coords.longitude);
        Geolocation.stopObserving();
        // Geocoder.from(position.coords.latitude, position.coords.longitude)
        // .then(json => {
        //   var addressComponent = json.results[0].address_components[0];
        //   console.log(addressComponent);
        // })
        // .catch(error => console.warn(error));
      },

      error => {
        // See error code charts below.
        Alert.alert('Please chech location permission in settings');
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }

  useEffect(() => {
    const user = auth().currentUser;
    setuser(user);
    // getLoc();
    setFormaData({...formData, phone_no: user.phoneNumber});
  }, [phone_no]);

  const onValidation = () => {
    let newFormDataErro = {...formDataError};
    let hasError = false;

    if (!name) {
      newFormDataErro.name_err = 'Please enter First Name';
      hasError = true;
    } else {
      newFormDataErro.name_err = '';
    }

    if (!age) {
      newFormDataErro.age_err = 'Please enter Last Name';
      hasError = true;
    } else {
      newFormDataErro.age_err = '';
    }
    if (!email) {
      newFormDataErro.email_err = 'Please enter email';
      hasError = true;
    } else {
      newFormDataErro.email_err = '';
    }
    if (!gender) {
      newFormDataErro.gender_err = 'Please enter Gender';
      hasError = true;
    } else {
      newFormDataErro.gender_err = '';
    }

    setFormDataError(newFormDataErro);
    if (hasError) {
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async (latitude, longitude) => {
    let isValid = onValidation();
    // await getLoc();
    let detail = {
      ...formData,
      loc: {lat: latitude, lon: longitude},
    };
    // console.log({
    //   ...formData,
    //   loc: {lat: latitude, lon: longitude},
    //   address: 'as',
    // });
    if (isValid) {
      console.log(formData);
      firestore()
        .collection('user')
        .doc(user.uid)
        .set({
          Info: {
            ...formData,
            loc: {lat: latitude, lon: longitude},
          },
          activefamily: {
            doc_id: '',
            age: '',
            email: '',
            gender: '',
            name: '',
            phone_no: '',
            relation: '',
          },
          activeaddress: {
            address_line1: '',
            address_line2: '',
            address_line3: '',
            pincode: '',
            address_id: '',
          },
        })
        .then(() => {
          console.log('User added!');
          firestore().collection('doctor_cart').doc(user.uid).set({
            appointments: [],
          });

          firestore().collection('appointment_doctor').doc(user.uid).set({
            schedule: [],
          });

          firestore().collection('appointment_lab').doc(user.uid).set({
            schedule: [],
          });

          props.navigation.dispatch(resetAction);
        });
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {loading1 == false ? (
        <View style={styles.background}>
          <Modal
            visible={dialog !== null}
            animated
            onRequestClose={() => {
              setDialog(null);
            }}
            transparent={true}
            animationType="fade">
            <View style={styles.Modal}>
              <View style={styles.modalView}>
                {genderlist.map((source, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setgenderselection(index);
                        setFormaData({...formData, ['gender']: source});
                        setDialog(null);
                      }}
                      style={[
                        styles.gendermap,
                        {
                          backgroundColor:
                            index == genderselection ? '#835CB94D' : '#fff',
                        },
                      ]}>
                      <Text>{source}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Modal>
          <Image
            style={styles.absimage}
            source={require('../assets/cliniker_purple.png')}></Image>
          {/* {props.isLoading && <Loader />} */}
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollViewContainer}
            enableOnAndroid={true}
            resetScrollToCoords={{x: 0, y: 0}}
            scrollEnabled>
            <View style={styles.main}>
              <Image
                source={require('../assets/cliniker_white.png')}
                style={styles.clinikerlogo}
              />
              <View style={styles.textHeading}>
                <Text style={styles.textB}>Enter Your Details</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  {/* <Text style={styles.textS}>Enter First Name</Text> */}
                  {name_err != '' && (
                    <Text style={[styles.error]}>{name_err}</Text>
                  )}
                  <TextInput
                    style={styles.numberInput}
                    placeholder={'Enter Your Name'}
                    placeholderTextColor={'#676767'}
                    onChangeText={text => onChange(text, 'name')}
                    value={name}
                  />
                </View>
                <View style={styles.formGroup}>
                  {/* {phone_no_err != '' && (
                      <Text style={[styles.error]}>{phone_no_err}</Text>
                    )} */}
                  {/* <Text style={styles.textS}>Enter Last Name</Text> */}
                  {age_err != '' && (
                    <Text style={[styles.error]}>{age_err}</Text>
                  )}
                  <TextInput
                    style={styles.numberInput}
                    placeholder={'Enter Your Age'}
                    placeholderTextColor={'#676767'}
                    onChangeText={text => onChange(text, 'age')}
                    value={age}
                    keyboardType={'number-pad'}
                  />
                </View>
                <View style={styles.formGroup}>
                  {/* {phone_no_err != '' && (
                      <Text style={[styles.error]}>{phone_no_err}</Text>
                    )} */}
                  {/* <Text style={styles.textS}>Enter email</Text> */}

                  {gender_err != '' && (
                    <Text style={[styles.error]}>{gender_err}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      setDialog('show');
                    }}
                    style={[styles.numberInput, {justifyContent: 'center'}]}
                    // placeholder={'Enter Your Gender'}
                    // placeholderTextColor={'#676767'}
                    // onChangeText={text => onChange(text, 'gender')}
                    // value={gender}
                  >
                    <Text
                      style={{
                        color: formData.gender == '' ? '#676767' : colors.black,
                        fontSize: 16,
                      }}>
                      {formData.gender == ''
                        ? 'Select Your Gender'
                        : formData.gender}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setDialog('show');
                    }}
                    style={styles.absarrow}>
                    <Image
                      style={{height: 18, width: 18}}
                      source={links.arrow_down}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.formGroup}>
                  {/* {phone_no_err != '' && (
                      <Text style={[styles.error]}>{phone_no_err}</Text>
                    )} */}
                  {/* <Text style={styles.textS}>Enter email</Text> */}
                  {email_err != '' && (
                    <Text style={[styles.error]}>{email_err}</Text>
                  )}
                  <TextInput
                    style={styles.numberInput}
                    placeholder={'Enter Your Email'}
                    placeholderTextColor={'#676767'}
                    onChangeText={text => onChange(text, 'email')}
                    value={email}
                  />
                  {!validemail && (
                    <Text style={{fontSize: 10, color: 'red'}}>
                      Sorry! Invalid Email
                    </Text>
                  )}
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => (!validemail ? null : getLoc())}
                  style={styles.butt}>
                  <Text style={styles.buttonT}>PROCEED</Text>
                  <View style={styles.arrow}>
                    <Image
                      style={styles.next}
                      source={links.next_white}></Image>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      ) : (
        <View
          style={[
            styles.background,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          <Image
            style={styles.absimage}
            source={require('../assets/cliniker_purple.png')}></Image>
          <View
            style={{
              height: 100,
              width: 200,
              backgroundColor: 'rgba(25, 20, 20, 0.44)',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <ActivityIndicator
              animating={loading1}
              size="large"
              color={'#FFFFFF'}
            />
          </View>
        </View>
      )}
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  formContainer: {
    width: '100%',
    marginVertical: 16,
  },
  formGroup: {
    padding: 10,
  },
  helperText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  /////new styles
  background: {
    backgroundColor: colors.purple,
    flex: 1,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  absimage: {
    position: 'absolute',
    height: SCREEN_HEIGHT / 2,
    width: SCREEN_HEIGHT / 2,
    // right: 50,
    top: 10,
    alignSelf: 'center',
  },
  clinikerlogo: {
    height: 80,
    width: 80,
  },
  textB: {
    color: colors.white,
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textS: {
    color: colors.text,
    marginBottom: 5,
    marginLeft: 3,
    fontSize: 15,
  },
  textHeading: {
    marginTop: 39,
  },
  numberInput: {
    backgroundColor: colors.text,
    borderRadius: 20,
    color: colors.black,
    marginLeft: 10,
    fontSize: 16,
    height: 55,
    paddingLeft: 20,
  },
  butt: {
    height: 50,
    width: 200,
    backgroundColor: colors.dark,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonT: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  arrow: {
    position: 'absolute',
    height: 45,
    width: 45,
    borderRadius: 25,
    backgroundColor: colors.purple,
    right: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  next: {
    height: 40,
    width: 40,
  },
  otpInput: {
    backgroundColor: colors.white,
    borderRadius: 15,
    height: 60,
    borderBottomWidth: 0,
  },
  error: {
    color: 'red',
    fontSize: 12,
    paddingLeft: 12,
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderWidth: 1,
    alignSelf: 'center',
    position: 'absolute',
    top: SCREEN_WIDTH / 1.5,
    justifyContent: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 70,
    paddingVertical: 20,
  },
  modalT: {
    fontWeight: '900',
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
  },
  gendermap: {
    height: 30,
    marginVertical: 10,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  absarrow: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
});

export default Details;
