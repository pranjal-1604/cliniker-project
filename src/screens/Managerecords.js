/* eslint-disable react-hooks/exhaustive-deps */
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
  Modal,
  Linking,
} from 'react-native';

import links from '../components/links';
import colors from '../components/colors';
import backIcon from '../assets/back-black.png';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {useFocusEffect} from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const Managerecords = ({navigation}) => {
  const [records, setrecords] = useState([]);
  const [recordsid, setrecordsid] = useState([]);
  const [empty, setempty] = useState(false);
  const [removed, setremoved] = useState(null);
  const [dialogdoc, setDialogdoc] = useState(null);
  var record = [];

  const [deleted, setDeleted] = useState(false);

  async function Delete(id) {
    const user = auth().currentUser;
    await firestore()
      .collection('user')
      .doc(user.uid)
      .collection('records')
      .doc(id)
      .delete()
      .then(() => {
        console.log('record deleted!');
        // useEffect();
        setDeleted(true);
      });
  }

  useFocusEffect(
    React.useCallback(async () => {
      setrecords([]);
      setrecordsid([]);
      const user = auth().currentUser;
      const datas = await firestore()
        .collection('user')
        .doc(user.uid)
        .collection('records')
        .get();
      datas.forEach(doc => {
        record.push(doc.data());
        setrecords(prev => [...prev, doc.data()]);
        setrecordsid(prev => [...prev, doc.id]);
      });
    }, [deleted]),
  );

  // useEffect(async () => {
  //   setrecords([]);
  //   setrecordsid([]);
  //   const user = auth().currentUser;
  //   const datas = await firestore()
  //     .collection('user')
  //     .doc(user.uid)
  //     .collection('records')
  //     .get();
  //   datas.forEach(doc => {
  //     record.push(doc.data());
  //     setrecords(prev => [...prev, doc.data()]);
  //     setrecordsid(prev => [...prev, doc.id]);
  //   });
  // }, []);

  function Records() {
    return (
      <View style={{flex: 1, backgroundColor: colors.bg}}>
        <View style={styles.mainView}>
          <TouchableOpacity
            onPress={() => setDialogdoc('show')}
            style={styles.username}>
            <Text style={styles.usertext}>User Name</Text>
            <Image style={{height: 16, width: 16}} source={links.arr_right} />
          </TouchableOpacity>
          <View style={styles.date}>
            <Text style={styles.dateT}>12/02/21</Text>
          </View>
          {records.map((source, index) => {
            console.log(source);
            return (
              <View style={styles.card} key={index}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image style={styles.img} source={links.folder} />
                  <Text style={styles.usertext}>{source.name}</Text>
                </View>
                <View style={styles.seperator} />
                <View>
                  <Text style={styles.usertext}>{source.title}</Text>
                  <Text style={styles.subText}>
                    Record Type -{' '}
                    {source.type == 'lab' ? 'Lab Report' : 'Prescription'}
                  </Text>
                  <Text style={styles.subText}>Upload Date - 12/05/2021</Text>
                </View>
                <View style={styles.spacebetween}>
                  <TouchableOpacity
                    style={styles.buttonS}
                    onPress={() => {
                      Linking.openURL(source.upload);
                    }}>
                    <Text style={styles.buttonST}>OPEN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.buttonS, {backgroundColor: '#FFDE70'}]}
                    onPress={() => {
                      // console.log(recordsid[index]);
                      navigation.navigate('EditRecords',{id: recordsid[index]})
                    }}>
                    <Text style={[styles.buttonST, {color: '#373737'}]}>
                      EDIT
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Delete(recordsid[index]);
                    }}
                    style={[styles.buttonS, {backgroundColor: '#DB5461'}]}>
                    <Text style={styles.buttonST}>DELETE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          <TouchableOpacity
            onPress={() => navigation.navigate('AddRecords', {id: null})}
            style={styles.buttonRound}>
            <Image
              style={{height: 10, width: 10, marginRight: 5}}
              source={links.plus_yellow}
            />
            <Text style={styles.buttonT}>UPLOAD</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const ModalDoctor = () => {
    return (
      <Modal
        visible={dialogdoc !== null}
        animated
        onRequestClose={() => {
          setDialogdoc(null);
        }}
        transparent={true}
        animationType="fade">
        <View style={styles.Modalmem}>
          <View style={styles.modalViewMem}>
            <View style={styles.spacebetween}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#373737',
                }}>
                Select Profile -
              </Text>
              <TouchableOpacity onPress={() => setDialogdoc(null)}>
                <Image style={{height: 17, width: 17}} source={links.wrong} />
              </TouchableOpacity>
            </View>

            <View style={[styles.seperator, {marginVertical: 15}]} />
            <TouchableOpacity
              onPress={() => {
                setDialogdoc(null);
              }}
              style={[
                styles.spacebetween,
                {
                  borderBottomWidth: 1,
                  // backgroundColor: selectedoption == true ? '#835CB980' : null,
                  paddingVertical: 8,
                },
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{height: 11, width: 11, marginRight: 10}}
                  source={links.user}
                />
                <Text style={[styles.time, {color: '#373737'}]}>
                  Family member 1
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDialogdoc(null);
              }}
              style={[
                styles.spacebetween,
                {
                  borderBottomWidth: 1,
                  // backgroundColor: selectedoption == true ? '#835CB980' : null,
                  paddingVertical: 8,
                },
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{height: 11, width: 11, marginRight: 10}}
                  source={links.user}
                />
                <Text style={[styles.time, {color: '#373737'}]}>
                  Family member 2
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const ModalRemove = () => {
    return (
      <Modal
        visible={removed !== null}
        animated
        onRequestClose={() => {
          setremoved(null);
        }}
        transparent={true}
        animationType="fade">
        <View style={styles.Modalmem}>
          <View
            style={[
              styles.modalViewMem,
              {backgroundColor: '#FFDE70', width: '95%', alignSelf: 'center'},
            ]}>
            <View style={styles.spacebetween}>
              <Text style={{}}></Text>
              <TouchableOpacity onPress={() => setremoved(null)}>
                <Image style={{height: 17, width: 17}} source={links.wrong} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#373737',
                textAlign: 'center',
                marginVertical: 10,
              }}>
              Are you sure you want to delete
            </Text>

            <TouchableOpacity
              style={[
                styles.buttonS,
                {alignSelf: 'center', backgroundColor: '#DB5461'},
              ]}>
              <Text style={[styles.buttonST, {color: colors.white}]}>
                DELETE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image style={{height: 16, width: 16}} source={backIcon} />
          </TouchableOpacity>
          <Text style={styles.head}>MANAGE RECORDS</Text>
          <Text></Text>
        </View>
        {empty == true ? (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <View style={{}}></View>
            <Image
              style={{
                height: SCREEN_WIDTH / 2,
                width: SCREEN_WIDTH / 2,
                // alignSelf: 'center',
                marginTop: SCREEN_WIDTH / 2.5,
              }}
              source={links.island}
            />
            <Text
              style={{
                color: '#979797',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 12,
                width: SCREEN_WIDTH / 1.7,
              }}>
              Records page seems to be empty you can upload records such as
              prescriptions to keep track
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonT}>UPLOAD RECORDS</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <Records />
          </View>
        )}
        <ModalDoctor />
        <ModalRemove />
      </ScrollView>
    </SafeAreaView>
  );
};

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
  card: {
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 16,
    shadowColor: '#000',
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
  username: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#FFDE70',
    borderRadius: 6,
    height: 52,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  usertext: {
    color: '#373737',
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    height: 52,
    width: 160,
    borderRadius: 30,
    backgroundColor: '#FFDE70',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },
  dateT: {
    color: '#373737',
    fontWeight: 'bold',
    fontSize: 16,
  },
  seperator: {
    height: 1,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 5,
    backgroundColor: '#373737',
  },
  img: {
    height: 40,
    width: 40,
    marginRight: 10,
  },
  spacebetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  left: {
    width: '50%',
  },
  right: {
    width: '50%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#373737',
  },
  subText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#646464',
  },
  radioBorder: {
    height: 18,
    width: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  Modalmem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  modalViewMem: {
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
  button: {
    height: 32,
    width: 147,
    backgroundColor: colors.purple,
    borderRadius: 6,
    elevation: 4,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonS: {
    height: 27,
    width: 58,
    backgroundColor: colors.purple,
    borderRadius: 6,
    elevation: 4,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonST: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.white,
  },
  buttonT: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  buttonRound: {
    borderRadius: 25,
    flexDirection: 'row',
    height: 48,
    width: 127,
    backgroundColor: colors.purple,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default Managerecords;
