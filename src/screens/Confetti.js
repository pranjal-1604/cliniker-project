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

export default function Confetti({navigation}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.mainView}>
        <Image
          style={{height: SCREEN_WIDTH - 100, width: SCREEN_WIDTH - 100}}
          source={links.confetti}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Homescreen')}
          style={{
            height: 27,
            width: 108,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.purple,
            alignSelf: 'center',
            borderRadius: 6,
          }}>
          <Text style={{color: colors.white}}>Back To Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  mainView: {
    flex: 1,
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
