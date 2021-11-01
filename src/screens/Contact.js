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
  Linking,
} from 'react-native';

import backIcon from '../assets/back-black.png';
import searchIcon from '../assets/search.png';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import colors from '../components/colors';
import links from '../components/links';

export default function Contact(props) {
  dialCall = () => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${+1234567890}';
    } else {
      phoneNumber = 'telprompt:${+1234567890}';
    }

    Linking.openURL(phoneNumber);
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
          <Text style={styles.head}>Contact Us</Text>
          <Text></Text>
        </View>
        <View style={styles.mainView}>
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.username}>Need Help?</Text>
                <Text style={styles.purpletext}>Try to reach us</Text>
              </View>
              <Image style={styles.img} source={links.dochelp} />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:support@example.com')}
            style={styles.card}>
            <View>
              <Text style={styles.username}>Email us:</Text>
              <Text style={styles.purpletext}>cliniker@gmail.com</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dialCall()} style={styles.card}>
            <View>
              <Text style={styles.username}>Call us:</Text>
              <Text style={styles.purpletext}>1234423425325</Text>
            </View>
          </TouchableOpacity>
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
    backgroundColor: '#FFDE70',
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
    color: '#373737',
    fontWeight: 'bold',
    fontSize: 24,
  },
  purpletext: {
    color: colors.purple,
    fontWeight: 'bold',
    fontSize: 20,
  },
  img: {
    height: 98,
    width: 76,
  },
});
