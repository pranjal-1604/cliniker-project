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

import backIcon from '../assets/back-black.png';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import colors from '../components/colors';
import firestore from '@react-native-firebase/firestore';
import links from '../components/links';
import LinearGradient from 'react-native-linear-gradient';

export default function AllPackages({navigation, route}) {
  const {packages} = route.params;

  async function addtocart(source) {
    console.log('source ', source);
    console.log('source', source.fees);
    // console.log(JSON.stringify(source, null, 2))
    navigation.navigate('BooklabCalender', {source});
  }

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
          <Text style={styles.head}>PACKAGES</Text>
          <Text></Text>
        </View>
        <View style={styles.mainView}>
          {packages.map((source, i) => {
            return (
              <LinearGradient
                colors={['#FFDE70', '#FFECAB', '#FFECAB']}
                style={styles.card}
                key={i}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    position: 'absolute',
                    right: 10,
                    top: 10,
                  }}
                  source={links.cliniker_purple}
                />
                <View style={{width: '90%', marginVertical: 10}}>
                  <Text style={styles.mainte}>MAXCare Health Checkup</Text>
                  <Text style={styles.text}>
                    Full body health checkup @ {source.fees}
                  </Text>
                </View>
                <Image
                  style={{alignSelf: 'center'}}
                  source={links.packillu}></Image>
                <View style={{width: '90%', marginVertical: 10}}>
                  <Text style={styles.text}>Includes Tests for</Text>
                  <Text style={styles.mainte}>
                    Diabetes | Heart | Kidney | Liver
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      //   props.navigation.navigate('PackageDetail', {source})
                      addtocart(source);
                    }}
                    style={styles.appointmentB}>
                    <Text style={{color: colors.white, fontSize: 14}}>
                      BOOK NOW
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('PackageDetail', {source});
                    }}
                    style={[
                      styles.appointmentB,
                      {backgroundColor: 'transparent', borderWidth: 1},
                    ]}>
                    <Text style={{color: colors.purple, fontSize: 14}}>
                      KNOW MORE
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            );
          })}
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
  card: {
    width: '100%',
    // backgroundColor: '#fff',
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
    paddingTop: 0,
    borderRadius: 6,
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
  purpletext: {
    color: colors.purple,
    fontWeight: 'bold',
    fontSize: 20,
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
  blogimg: {
    width: SCREEN_WIDTH - 32,
    height: 150,
    alignSelf: 'center',
    borderRadius: 6,
  },
  spacebetween: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    flexDirection: 'row',
  },
  smalltext: {
    fontSize: 12,
    color: '#646464',
    fontWeight: 'bold',
  },
  seperator: {
    height: 1,
    backgroundColor: '#646464',
    width: '100%',
    marginVertical: 2,
  },
  mainte: {
    fontSize: 15,
    color: '#373737',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    color: '#373737',
    fontWeight: 'bold',
  },
  appointmentB: {
    height: 33,
    width: 100,
    backgroundColor: colors.purple,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
