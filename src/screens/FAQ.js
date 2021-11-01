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

export default function FAQ(props) {
  const [questions, setquestions] = useState([{show: false}, {show: true}]);
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
          <Text style={styles.head}>FAQ</Text>
          <Text></Text>
        </View>
        <View style={styles.mainView}>
          {questions.map((source, index) => {
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => {
                    let newArray = [...questions];
                    newArray[index] = {...source, show: !source.show};
                    setquestions(newArray);
                  }}
                  style={styles.cardyellow}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      alignItems: 'center',
                    }}>
                    <View>
                      <Text style={styles.username}>
                        Phasellus vulputate eros sed euismod faucibus. Sed
                        dictum dui eget consequat accumsan?
                      </Text>
                    </View>
                    <Image
                      source={
                        source.show == true ? links.arrow_down : links.arr_right
                      }
                      style={{height: 20, width: 20, marginRight: 5}}
                    />
                  </View>
                </TouchableOpacity>
                {source.show == true ? (
                  <View style={styles.card}>
                    <View>
                      <Text style={styles.username}>
                        Phasellus vulputate eros sed euismod faucibus. Sed
                        dictum dui eget consequat accumsan. Nunc placerat ligula
                        in metus tincidunt, quis mattis Phasellus vulputate eros
                        sed euismod faucibus. Sed dictum dui eget consequat
                        accumsan. Nunc placerat ligula in metus tincidunt, quis
                        mattis Phasellus vulputate eros sed euismod faucibus.
                        Sed dictum dui eget consequat accumsan. Nunc placerat
                        ligula in metus tincidunt, quis mattis Phasellus
                        vulputate eros sed euismod faucibus. Sed dictum dui eget
                        consequat accumsan. Nunc placerat ligula in metus
                        tincidunt, quis mattis Phasellus vulputate eros sed
                        euismod faucibus. Sed dictum dui eget consequat
                        accumsan. Nunc placerat ligula in metus tincidunt, quis
                        mattis Phasellus vulputate eros sed euismod faucibus.
                        Sed dictum dui eget consequat accumsan. Nunc placerat
                        ligula in metus tincidunt, quis mattis
                      </Text>
                    </View>
                  </View>
                ) : null}
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
    padding: 10,
  },
  cardyellow: {
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
    fontSize: 12,
  },
  img: {
    height: 98,
    width: 76,
  },
});
