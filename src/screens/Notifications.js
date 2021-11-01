import React, {useState} from 'react';
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

import backIcon from '../assets/back-black.png';
import searchIcon from '../assets/search.png';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import colors from '../components/colors';
import links from '../components/links';

export default function Notifications(props) {
  const [dialogmember, setdialogmember] = useState(null);
  const [dates, setdates] = useState([{key: 1}, {key: 2}, {key: 3}]);

  const Modalmem = () => {
    return (
      <Modal
        visible={dialogmember !== null}
        animated
        onRequestClose={() => {
          setdialogmember(null);
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
              <TouchableOpacity onPress={() => setdialogmember(null)}>
                <Image style={{height: 17, width: 17}} source={links.wrong} />
              </TouchableOpacity>
            </View>

            <View style={[styles.seperator, {marginVertical: 15}]} />
            <TouchableOpacity
              onPress={() => {
                setdialogmember(null);
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
                setdialogmember(null);
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
          <Text style={styles.head}>NOTIFICATIONS</Text>
          <Text></Text>
        </View>
        <View style={styles.mainView}>
          {/* <TouchableOpacity
            onPress={() => setdialogmember('show')}
            style={styles.username}>
            <Text style={styles.usertext}>User Name</Text>
            <Image style={{height: 16, width: 16}} source={links.arr_right} />
          </TouchableOpacity> */}
          {dates.map((source, index) => {
            return (
              <View key={index} style={styles.module}>
                <View style={styles.date}>
                  <Text style={styles.dateT}>12/02/21</Text>
                </View>
                <View style={styles.card}>
                  <View style={styles.noti}>
                    <Image style={styles.img} source={links.bell} />
                    <Text style={styles.text}>
                      Some notification for the user
                    </Text>
                  </View>
                  <View style={styles.noti}>
                    <Image style={styles.img} source={links.report} />
                    <Text style={styles.text}>
                      User's report has been uploaded
                    </Text>
                  </View>
                  <View style={styles.noti}>
                    <Image style={styles.img} source={links.bell} />
                    <Text style={styles.text}>
                      Some notification for the user
                    </Text>
                  </View>
                  <View style={styles.noti}>
                    <Image style={styles.img} source={links.report} />
                    <Text style={styles.text}>
                      User's report has been uploaded
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <Modalmem />
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
    marginTop: 15,
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
    fontSize: 12,
    color: '#373737',
    fontWeight: '900',
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
    width: 167,
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
  noti: {
    padding: 10,
    flexDirection: 'row',
    borderBottomColor: '#707070',
    borderBottomWidth: 1,
    marginVertical: 0.5,
    width: '100%',
    alignItems: 'center',
  },
  img: {
    height: 10,
    width: 10,
    marginRight: 10,
  },
});
