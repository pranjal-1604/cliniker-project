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

export default function Partners(props) {
  partners = [{key: 1}, {key: 2}, {key: 3}, {key: 4}, {key: 5}, {key: 6}];
  const renderItem = ({item}) => (
    <Image style={styles.img} source={links.partner1} />
  );

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
          <Text style={styles.head}>WANT TO BE A PARTNER</Text>
          <Text></Text>
        </View>
        <View style={styles.mainView}>
          <View style={styles.card}>
            <Text style={styles.purpletext}>Our Partners</Text>
            <View
              style={{alignSelf: 'center', marginVertical: 10, height: 200}}>
              <FlatList
                numColumns={3}
                data={partners}
                renderItem={renderItem}
                keyExtractor={item => item.key}
              />
            </View>
          </View>
          <View style={{marginVertical: 20}}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Contact')}
              style={styles.button}>
              <Text style={styles.buttonT}>BECOME A PARTNER TODAY</Text>
            </TouchableOpacity>
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
  },
  head: {
    color: '#373737',
    fontSize: 20,
    fontWeight: 'bold',
  },
  purpletext: {
    color: colors.purple,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    width: '100%',
  },
  spacearound: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  img: {
    height: 72,
    width: 72,
    margin: 10,
  },
  button: {
    backgroundColor: colors.purple,
    height: 32,
    width: 208,
    borderRadius: 6,
    elevation: 4,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonT: {
    fontSize: 12,
    color: colors.white,
    fontWeight: 'bold',
  },
});
