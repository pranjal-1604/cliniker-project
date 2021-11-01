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
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import colors from '../components/colors';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import DropDownPicker from 'react-native-dropdown-picker';
import RNFS from '@taoqf/react-native-fs';
import {Rating} from '../components/ratings/index.tsx';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import backIcon from '../assets/back-black.png';

export default function AddRecords({navigation, route}) {
  const [formData, setFormaData] = useState({
    name: '',
    title: '',
    type: 'prescription',
    date: new Date(),
    filename: '',
    upload: '',
  });
  const [filename, setfilename] = useState('');
  const {id} = route.params;

  const onChange = (text, name) => {
    setFormaData({...formData, [name]: text});
  };
  var downloaduri = '';
  const [response, setresponse] = useState(null);
  const [userdetails, setUserdetails] = useState();
  const reference = storage().ref('ulpload.pdf');

  const uploadrec = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setresponse(res);
      setFormaData({...formData, filename: res.name});
      setfilename(res.name);
      console.log(
        'paths ',
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const submit = async () => {
    console.log(formData);
    console.log(response);
    const path = 'content://';
    const paths = response.uri.substring(path.length);
    console.log('paths ', paths);
    const file = await RNFS.readFile(response.uri, 'base64');
    console.log('file ', file);
    const uploadtask = storage()
      .ref(`allfiles/${response.name}`)
      .putString(file, 'base64', {contentType: response.type});

    uploadtask.on(
      'state_changed',
      snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      error => {
        console.log('error ', error);
      },
      () => {
        uploadtask.snapshot.ref
          .getDownloadURL()
          .then(async downloadURL => {
            console.log('File available at', downloadURL);
            formData.upload = downloadURL;
            setFormaData({...formData, upload: downloadURL});
            downloaduri = downloadURL;
          })
          .then(() => {
            console.log('formdata ', formData);
            if (formData.upload != '') {
              setFormaData({...formData, upload: downloaduri});
              const user = auth().currentUser;
              firestore()
                .collection('user')
                .doc(user.uid)
                .collection('records')
                .add(formData)
                .then(() => {
                  console.log('record added!');
                  navigation.navigate('Managerecords');
                });
            } else {
              setFormaData({...formData, upload: downloaduri});
              const user = auth().currentUser;
              firestore()
                .collection('user')
                .doc(user.uid)
                .collection('records')
                .add(formData)
                .then(() => {
                  console.log('record added!');
                  navigation.navigate('Managerecords');
                });
            }
          });
      },
    );
  };
  useEffect(async () => {
    console.log('id is ', id);
    if (id != null) {
      const user = auth().currentUser;
      const datas = await firestore()
        .collection('user')
        .doc(user.uid)
        .collection('records')
        .doc(id)
        .get();
      setFormaData(datas.data());
    } else {
    }
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
            <Text style={[styles.font, styles.headerTitle]}>ADD RECORDS</Text>
            <Text></Text>
          </View>
        </View>
        <View style={styles.main}>
          <View style={styles.card}>
            <Text
              style={{
                fontSize: 16,
                color: colors.purple,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Add Record
            </Text>
            <View style={{marginTop: 20, paddingHorizontal: 5}}>
              <View style={{marginVertical: 10}}>
                <Text style={styles.name}>Patient Name</Text>
                <TextInput
                  placeholder={'Enter Name'}
                  placeholderTextColor={'#979797'}
                  value={formData.name}
                  onChangeText={text => onChange(text, 'name')}
                  style={styles.textinput}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <Text style={styles.name}>Add Title</Text>
                <TextInput
                  placeholder={'Enter Title'}
                  placeholderTextColor={'#979797'}
                  value={formData.title}
                  onChangeText={text => onChange(text, 'title')}
                  style={styles.textinput}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <Text style={styles.name}>Select Type</Text>
                <DropDownPicker
                  items={[
                    {
                      label: 'Prescription',
                      value: 'prescription',
                      // hidden: true,
                    },
                    {
                      label: 'Lab Report',
                      value: 'lab',
                    },
                  ]}
                  defaultValue={formData.type}
                  containerStyle={{height: 40, width: '100%', marginTop: 12}}
                  style={{backgroundColor: '#ffff', borderColor: '#979797'}}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  dropDownStyle={{backgroundColor: '#fff'}}
                  onChangeItem={item => onChange(item.value, 'type')}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <Text style={styles.name}>Upload</Text>
                <View style={styles.upload}>
                  <TouchableOpacity
                    onPress={() => uploadrec()}
                    style={styles.buttonS}>
                    <Text style={styles.buttonST}>CHOOSE FILE</Text>
                  </TouchableOpacity>
                  {filename == '' ? (
                    <Text
                      style={{
                        fontSize: 12,
                        borderColor: '#979797',
                        color: '#979797',
                      }}>
                      {formData.filename}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 12,
                        borderColor: '#979797',
                        color: '#979797',
                      }}>
                      {filename}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => submit()} style={styles.button}>
            <Text style={styles.buttonT}>UPLOAD DOCUMENT</Text>
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
    fontWeight: '900',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
    borderRadius: 6,
    height: 27,
    width: 128,
    marginTop: 10,
  },
  buttonS: {
    height: 27,
    width: 95,
    backgroundColor: colors.purple,
    borderRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  buttonST: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.white,
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
    color: '#373737',
    borderRadius: 5,
  },
  upload: {
    width: '100%',
    alignSelf: 'center',
    height: 34,
    marginTop: 12,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: '#979797',
    color: '#979797',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
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
