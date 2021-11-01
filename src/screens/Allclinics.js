import React, {useState, useEffect, useRef} from 'react';
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
  TextInput,
} from 'react-native';

import backIcon from '../assets/back-black.png';
import DropDownPicker from 'react-native-dropdown-picker';
import searchIcon from '../assets/search.png';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import {getDoctorList, getClinicList} from '../services/firebase';
import CheckBox from '@react-native-community/checkbox';
import {Rating} from '../components/ratings/index.tsx';
import colors from '../components/colors';
import links from '../components/links';
import RBSheet from 'react-native-raw-bottom-sheet';

export default function Allclinics(props) {
  const [clinics, setclinics] = useState([]);
  const [sort, setsort] = useState('none');
  const [sorttemp, setsorttemp] = useState('none');
  const [search, setsearch] = useState();
  const refRBSheet = useRef();

  const getClinics = async () => {
    const k = await getClinicList();
    console.log(k);
    // k[0].pastaff.map((source, i) => {
    //   console.log(source);
    // });
    setclinics(k);
  };

  const BottomSheet = () => {
    return (
      <View style={styles.BottomSheet}>
        <Text style={[styles.headerTitle, {marginLeft: 0}]}>SORT BY</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setsorttemp('rating')}
            style={[styles.radioBorder, {}]}>
            {sorttemp == 'rating' ? (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: colors.purple,
                }}
              />
            ) : null}
          </TouchableOpacity>
          <Text style={styles.time}>Rating</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setsorttemp('distance')}
            style={[styles.radioBorder, {}]}>
            {sorttemp == 'distance' ? (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: colors.purple,
                }}
              />
            ) : null}
          </TouchableOpacity>
          <Text style={styles.time}>Distance</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setsorttemp('none')}
            style={[styles.radioBorder, {}]}>
            {sorttemp == 'none' ? (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: colors.purple,
                }}
              />
            ) : null}
          </TouchableOpacity>
          <Text style={styles.time}>None</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setsort(sorttemp);
            refRBSheet.current.close();
          }}
          style={styles.button}>
          <Text style={styles.buttonT}>Apply</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    getClinics();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.customHeader]}>
          <View style={[styles.headerLeft]}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.goBack();
              }}>
              <Image source={backIcon} style={styles.headerIcon} />
            </TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={links.loc} style={styles.locimg} />
              <Text style={styles.name}>Address</Text>
            </View>
          </View>

          <View>
            <Text style={[styles.headerTitle]}>CLINICS</Text>
          </View>
        </View>
        <View style={styles.main}>
          <View>
            <TextInput
              placeholder="Search"
              placeholderTextColor={colors.purple}
              onChangeText={text => setsearch(text)}
              value={search}
              style={styles.textinput}
            />
            <View
              style={{elevation: 4, position: 'absolute', left: 20, top: 20}}>
              <Image source={links.search} style={styles.search} />
            </View>
          </View>
          <RBSheet
            ref={refRBSheet}
            height={230}
            openDuration={250}
            customStyles={{
              container: {
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                paddingHorizontal: 20,
                justifyContent: 'center',
              },
            }}>
            <BottomSheet />
          </RBSheet>
          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => refRBSheet.current.open()}
              style={[
                styles.filter,
                {
                  borderColor: sort == 'sort' ? colors.purple : '#CACACA',
                  backgroundColor: sort == 'sort' ? '#835CB91A' : null,
                },
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image style={{height: 10, width: 10}} source={links.sort} />
                <Text style={styles.speciality}>Sort</Text>
              </View>
            </TouchableOpacity>
            <View
              style={[
                styles.filter,
                {
                  borderColor: sort == 'rating' ? colors.purple : '#CACACA',
                  backgroundColor: sort == 'rating' ? '#835CB91A' : null,
                },
              ]}>
              <Text style={styles.speciality}>Rating</Text>
            </View>
            <View
              style={[
                styles.filter,
                {
                  borderColor: sort == 'distance' ? colors.purple : '#CACACA',
                  backgroundColor: sort == 'distance' ? '#835CB91A' : null,
                },
              ]}>
              <Text style={styles.speciality}>Distance</Text>
            </View>
          </View>
          {clinics.map((source, index) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('Clinicdetails', {
                      details: source,
                    });
                  }}
                  style={styles.card}>
                  <Image style={styles.clinicimg} source={links.clinic}></Image>
                  <View style={{paddingHorizontal: 6}}>
                    <View style={styles.spacebetween}>
                      <View>
                        <Text style={[styles.headerTitle, {marginLeft: 0}]}>
                          {source.name}
                        </Text>
                      </View>
                      <View style={{}}>
                        <Rating
                          showRating={false}
                          startingValue={4}
                          ratingCount={5}
                          readonly
                          imageSize={12}
                          style={{backgroundColor: colors.bg}}
                        />
                      </View>
                    </View>
                    <View style={{width: '100%'}}>
                      <Text style={styles.speciality}>
                        {source.facility.map((item, index) => {
                          return item + ' ';
                        })}
                      </Text>
                      <Text style={styles.speciality}>
                        {source.location.place}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
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
    width: SCREEN_WIDTH,
    paddingHorizontal: 16,
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  headerIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  headerTitle: {
    color: '#373737',
    fontSize: 16,
    fontWeight: 'bold',
    // textAlign: 'center',
    marginLeft: 12,
    marginVertical: 12,
  },
  main: {
    width: SCREEN_WIDTH - 32,
    paddingVertical: 12,
    alignSelf: 'center',
  },
  clinicimg: {
    width: SCREEN_WIDTH - 32,
    height: 150,
    alignSelf: 'center',
    borderRadius: 6,
  },
  name: {
    color: '#373737',
    fontSize: 12,
    fontWeight: 'bold',
  },
  speciality: {
    color: '#6D6D6D',
    fontSize: 12,
    fontWeight: 'bold',
  },
  time: {
    color: '#373737',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subT: {
    color: '#646464',
    fontSize: 11,
    fontWeight: 'bold',
  },
  locimg: {
    width: 7,
    height: 10,
    marginRight: 8,
  },
  spacebetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  arr: {
    height: 15,
    width: 15,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 6,
    elevation: 5,
    paddingHorizontal: 8,
    marginVertical: 10,
    paddingBottom: 10,
    elevation: 4,
  },
  buttonT: {
    fontSize: 10,
    color: colors.white,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
    borderRadius: 6,
    height: 30,
    width: 77,
    alignSelf: 'center',
  },
  textinput: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 6,
    alignSelf: 'center',
    height: 50,
    marginTop: 12,
    paddingLeft: 70,
    color: colors.purple,
    elevation: 4,
  },
  search: {
    height: 30,
    width: 30,
  },
  filter: {
    height: 24,
    width: 70,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    marginVertical: 5,
  },
});
