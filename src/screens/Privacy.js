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

export default function Privacy(props) {
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
          <Text style={styles.head}>Privacy Policy</Text>
          <Text></Text>
        </View>
        <View style={styles.mainView}>
          <View style={styles.card}>
            <View>
              <Text style={styles.username}>
                Phasellus vulputate eros sed euismod faucibus. Sed dictum dui
                eget consequat accumsan. Nunc placerat ligula in metus
                tincidunt, quis mattis Phasellus vulputate eros sed euismod
                faucibus. Sed dictum dui eget consequat accumsan. Nunc placerat
                ligula in metus tincidunt, quis mattis Phasellus vulputate eros
                sed euismod faucibus. Sed dictum dui eget consequat accumsan.
                Nunc placerat ligula in metus tincidunt, quis mattis
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
    backgroundColor: '#FFF',
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
    padding: 20,
  },
  head: {
    color: '#373737',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    color: '#373737',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
