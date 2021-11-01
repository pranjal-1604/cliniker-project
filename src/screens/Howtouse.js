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

export default function Howtouse(props) {
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
          <Text style={styles.head}>HOW TO USE</Text>
          <Text></Text>
        </View>
        <View style={styles.mainView}>
          <View style={styles.card}>
            <Image style={styles.blogimg} source={links.blog}></Image>

            <View
              style={{
                width: '100%',
                marginTop: 8,
                padding: 5,
              }}>
              <Text style={styles.blogtext}>
                Phasellus vulputate eros sed euismod faucibus. Sed dictum dui
                eget consequat accumsan. Nunc placerat ligula in metus
                tincidunt, quis mattis Phasellus vulputate eros sed euismod
                faucibus. Sed dictum dui eget consequat accumsan. Nunc placerat
                ligula in metus tincidunt, quis mattis Phasellus vulputate eros
                sed euismod faucibus. Sed dictum dui eget consequat accumsan.
                Nunc placerat ligula in metus tincidunt, quis mattis Phasellus
                vulputate eros sed euismod faucibus. Sed dictum dui eget
                consequat accumsan. Nunc placerat ligula in metus tincidunt,
                quis mattis Phasellus vulputate eros sed euismod faucibus. Sed
                dictum dui eget consequat accumsan. Nunc placerat ligula in
                metus tincidunt, quis mattis Phasellus vulputate eros sed
                euismod faucibus. Sed dictum dui eget consequat accumsan. Nunc
                placerat ligula in metus tincidunt, quis mattis
              </Text>
            </View>
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
    paddingTop: 0,
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
    height: 246,
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
  blogtext: {
    fontSize: 12,
    color: '#373737',
    fontWeight: 'bold',
  },
});
