import React, {useState, useRef} from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Button,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import colors from '../components/colors';
import links from '../components/links';
import auth from '@react-native-firebase/auth';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import OTPTextView from 'react-native-otp-textinput';

export default function Loginscreen({navigation}) {
  const [phone, setPhone] = useState('');
  const otpInput = useRef();

  const [loading1, setloading1] = useState(false);
  const [loading2, setloading2] = useState(false);

  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    console.log(phone);
    if (phoneNumber.length == 13) {
      setloading1(true);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      showToastWithGravityAndOffset();
      setConfirm(confirmation);
    } else {
      alert('Form filled incorrectly');
    }
  }

  async function confirmCode() {
    console.log(code);
    setloading2(true);
    try {
      await confirm.confirm(code).then(() => {
        console.log('login succesfull');
      });
    } catch (error) {
      alert('invalid code');
      navigation.navigate('Loginscreen');
    }
    //signiIn(confirm,code).
  }

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Otp sent !',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  if (!confirm) {
    return (
      <SafeAreaProvider style={styles.container}>
        {loading1 == false ? (
          <View style={styles.background}>
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
                  <Text style={styles.textB}>Enter Your</Text>
                  <Text style={styles.textB}>Mobile Number</Text>
                  <Text style={styles.textS}>
                    You will recieve a six digit code to verify next
                  </Text>
                </View>

                <View style={styles.formContainer}>
                  <View style={styles.formGroup}>
                    {/* {phone_no_err != '' && (
                      <Text style={[styles.error]}>{phone_no_err}</Text>
                    )} */}

                    <TextInput
                      style={styles.numberInput}
                      value={phone}
                      keyboardType="numeric"
                      maxLength={10}
                      onChangeText={text => setPhone(text)}
                    />
                    <Text
                      style={{
                        position: 'absolute',
                        fontWeight: 'bold',
                        fontSize: 20,
                        top: 23,
                        left: 23,
                      }}>
                      91
                    </Text>
                    <View
                      style={{
                        height: 40,
                        width: 2,
                        position: 'absolute',
                        top: 19,
                        left: 60,
                        backgroundColor: 'grey',
                      }}></View>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      if (phone.startsWith('+91')) {
                        signInWithPhoneNumber(phone);
                      } else if (phone.startsWith('91') && phone.length == 12) {
                        signInWithPhoneNumber('+' + phone);
                      } else {
                        signInWithPhoneNumber('+91' + phone);
                      }
                    }}
                    style={styles.butt}>
                    <Text style={styles.buttonT}>SEND OTP</Text>
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
  }

  return (
    <>
      <SafeAreaProvider style={styles.container}>
        {loading2 == false ? (
          <View style={styles.background}>
            <Image
              style={styles.absimage}
              source={require('../assets/cliniker_purple.png')}></Image>
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
                  <Text style={styles.textB}>Enter The</Text>
                  <Text style={styles.textB}>Otp Recieved</Text>
                  {/* <Text style={styles.textS}>
                  </Text> */}
                </View>
                <View style={[styles.formContainer, {alignItems: 'center'}]}>
                  <View style={styles.formGroup}>
                    <OTPTextView
                      ref={otpInput}
                      containerStyle={styles.textInputContainer}
                      textInputStyle={styles.otpInput}
                      handleTextChange={text => setCode(text)}
                      inputCount={6}
                      keyboardType="numeric"
                      tintColor="#000"
                    />
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => confirmCode()}
                    style={styles.butt}>
                    <Text style={styles.buttonT}>Next</Text>
                    <View style={styles.arrow}>
                      <Image
                        style={styles.next}
                        source={require('../assets/next-white.png')}></Image>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* {shoHideResendButton && (
              <View style={styles.footerAction}>
                {initial === false ? (
                  <TouchableOpacity
                    style={styles.lblButton}
                    onPress={() => onClickResendOtp()}>
                    <Text style={[styles.helperText, styles.textOrange]}>
                      Resend
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.lblButton}>
                    <Timer
                      size={13}
                      until={30}
                      onFinish={onFinish}
                      digitStyle={{backgroundColor: 'white'}}
                      digitTxtStyle={{
                        color: 'blue',
                        // fontSize: sizes.h5,
                      }}
                      separatorStyle={{color: 'green'}}
                      timeToShow={['M', 'S']}
                      timeLabels={{m: null, s: null}}
                      showSeparator
                    />
                  </View>
                )}
              </View>
            )} */}
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
                animating={loading2}
                size="large"
                color={'#FFFFFF'}
              />
            </View>
          </View>
        )}
      </SafeAreaProvider>
    </>
  );
}

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
    alignSelf: 'center',
    opacity: 0.7,
    marginTop: 25,
  },
  textHeading: {
    marginTop: 39,
  },
  numberInput: {
    backgroundColor: colors.text,
    borderRadius: 20,
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    height: 55,
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
});
