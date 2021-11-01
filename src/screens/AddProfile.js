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

import {Rating} from '../components/ratings/index.tsx';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import backIcon from '../assets/back-black.png';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DocumentPicker from 'react-native-document-picker';
import RNFS from '@taoqf/react-native-fs';

export default function AddProfile({navigation, route}) {
  const [userdetails, setUserdetails] = useState();
  const [uid, setUid] = useState();
  const [validemail, setValidEmail] = useState(true);
  const {routes} = route.params;
  const [formData, setFormaData] = useState({
    name: '',
    img:{
      type: '',
      code: ''
    },
    age: '',
    email: '',
    gender: '',
    phone_no: '',
    relation: '',
  });
  const [genderm, setgenderm] = useState(null);
  const onChange = (text, name) => {
    if(name == 'email'){
      setValidEmail(emailValidationRegex(text))
    }
    setFormaData({...formData, [name]: text});
  };
  const emailValidationRegex = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  async function uploadprofileimage(){
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      console.log(
        "paths ",
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
      const file = await RNFS.readFile(res.uri, 'base64')
      console.log("file ",file);
      var image = {
        type: res.type,
        code: file
      }
      setFormData({...formData, img: image});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  useState(() => {}, []);

  useEffect(() => {
    const user = auth().currentUser;
    setUid(user.uid);
    const userdetail = firestore()
      .collection('user')
      .doc(user.uid)
      .onSnapshot(documentSnapshot => {
        setUserdetails(documentSnapshot.data());
      });
    // console.log('User data: ', userdetails);
    console.log('User uid: ', uid);
  }, []);

  const submit = () => {
    console.log('form data', formData);
    firestore()
      .collection('user')
      .doc(uid)
      .collection('family')
      .add(formData)
      .then(() => {
        console.log('User added!');
        navigation.navigate(routes);
      });
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
            <Text style={[styles.font, styles.headerTitle]}>ADD PROFILE</Text>
            <Text></Text>
          </View>
        </View>
        <View style={styles.main}>
          <View style={styles.card}>
            <View style={styles.profileBox}>
              <Image style={styles.ava} source={links.doctor} />
              <View style={styles.camc}>
              <TouchableOpacity
                onPress={() => {
                  uploadprofileimage()
                }}
              >
                  <Image style={styles.cam} source={links.cam} />
              </TouchableOpacity>
              </View>
            </View>
            <View style={{marginTop: 20, paddingHorizontal: 5}}>
              <View style={{marginVertical: 10}}>
                <Text style={styles.name}>Name</Text>
                <TextInput
                  placeholder={'Enter Name'}
                  placeholderTextColor={'#979797'}
                  value={formData.name}
                  onChangeText={text => onChange(text, 'name')}
                  style={styles.textinput}
                />
                {formData.name == '' &&  <Text style={{fontSize: 10, color: 'red'}}>Please enter name</Text>}
              </View>
              <View style={{marginVertical: 10}}>
                <Text style={styles.name}>Contact Information</Text>
                <TextInput
                  placeholder={'Enter Contact Information'}
                  placeholderTextColor={'#979797'}
                  value={formData.phone_no}
                  keyboardType={'number-pad'}
                  onChangeText={text => onChange(text, 'phone_no')}
                  style={styles.textinput}
                />
                {formData.phone_no == '' &&  <Text style={{fontSize: 10, color: 'red'}}>Please phone number</Text>}
              </View>
              <View style={{marginVertical: 10}}>
                <Text style={styles.name}>Relation</Text>
                <TextInput
                  placeholder={'Enter Relation'}
                  placeholderTextColor={'#979797'}
                  value={formData.relation}
                  onChangeText={text => onChange(text, 'relation')}
                  style={styles.textinput}
                />
                {formData.relation == '' &&  <Text style={{fontSize: 10, color: 'red'}}>Please enter relation</Text>}
              </View>
              <View style={[{marginVertical: 10}, styles.spacebetween]}>
                <View>
                  <Text style={styles.name}>Age</Text>
                  <TextInput
                    placeholder={'Enter Age'}
                    placeholderTextColor={'#979797'}
                    value={formData.age}
                    onChangeText={text => onChange(text, 'age')}
                    style={[styles.textinput, {width: 110}]}
                  />
                  {formData.age == '' &&  <Text style={{fontSize: 10, color: 'red'}}>Please enter age</Text>}
                </View>
                <View>
                  <Text style={styles.name}>Gender</Text>
                  <TouchableOpacity
                    onPress={() => setgenderm('show')}
                    style={styles.gender}>
                    <Text
                      style={{
                        fontWeight: '200',
                        fontSize: 12,
                        color: '#979797',
                        marginRight: 5,
                      }}>
                      {formData.gender == ''
                        ? 'Select Gender'
                        : formData.gender}
                    </Text>
                    <Image
                      source={links.arrow_down}
                      style={{height: 10, width: 10}}
                    />
                  </TouchableOpacity>
                  <Modal
                    visible={genderm !== null}
                    animated
                    onRequestClose={() => {
                      setgenderm(null);
                    }}
                    transparent={true}
                    animationType="fade">
                    <View style={styles.Modal}>
                      <View style={styles.modalView}>
                        <Text style={styles.headerTitle}>Select Gender</Text>
                        <View style={{marginLeft: 14, marginVertical: 10}}>
                          <TouchableOpacity
                            onPress={() => {
                              setgenderm(null);
                              setFormaData({...formData, gender: 'male'});
                            }}>
                            <Text style={styles.option}>Male</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setgenderm(null);
                              setFormaData({...formData, gender: 'female'});
                            }}>
                            <Text style={styles.option}>Female</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setgenderm(null);
                              setFormaData({...formData, gender: 'other'});
                            }}>
                            <Text style={styles.option}>Other</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
              <View style={{marginVertical: 10}}>
                <Text style={styles.name}>Email</Text>
                <TextInput
                  placeholder={'Enter Email Address'}
                  placeholderTextColor={'#979797'}
                  value={formData.email}
                  onChangeText={text => onChange(text, 'email')}
                  style={styles.textinput}
                  
                />
                {!validemail &&  <Text style={{fontSize: 10, color: 'red'}}>Sorry! Invalid Email</Text>}
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => !validemail ? null : submit()} style={styles.button}>
            <Text style={styles.buttonT}>SAVE PROFILE</Text>
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
  },
  spacebetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  profileBox: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 9,
    width: 150,
  },
  arr: {
    height: 15,
    width: 15,
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
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
    borderRadius: 6,
    height: 32,
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
    marginTop: 10,
  },
  name: {
    color: '#646464',
    fontWeight: 'bold',
    fontSize: 12,
  },
  textinput: {
    width: '100%',
    alignSelf: 'center',
    height: 34,
    marginTop: 12,
    borderWidth: 1,
    paddingLeft: 10,
    fontSize: 12,
    borderColor: '#979797',
    color: '#979797',
  },
  ava: {
    height: 120,
    width: 120,
    borderRadius: 80,
    alignSelf: 'center',
    marginVertical: 10,
  },
  camc: {
    height: 30,
    width: 30,
    position: 'absolute',
    backgroundColor: colors.purple,
    right: 10,
    top: 90,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cam: {
    height: 25,
    width: 25,
  },

  selectBox: {
    color: '#29303a',
    fontSize: 14,
  },
  gender: {
    borderColor: '#979797',
    borderWidth: 1,
    marginTop: 12,
    paddingLeft: 10,
    height: 34,
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  Modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  modalView: {
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
  option: {
    paddingTop: 8,
    borderBottomWidth: 1,
    marginVertical: 10,
    width: '80%',
    fontWeight: 'bold',
  },
});
