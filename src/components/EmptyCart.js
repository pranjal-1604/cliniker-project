import React from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';

import menuIcon from '../assets/menu.png';
import cartIcon from '../assets/cart.png';
import searchIcon from '../assets/search.png';
import bellIcon from '../assets/bell.png';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const EmptyCart = props => {
  return (
    <View style={[styles.customHeader]}>
      <View style={[styles.headerLeft]}>
        <TouchableOpacity onPress={props.onPressMenu}>
          <Image source={menuIcon} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={[styles.font, styles.headerTitle]}>
          Welcome {props.title ? props.title : 'xyz'}
        </Text>
      </View>
      <View style={[styles.headerRight]}>
        <TouchableOpacity
          style={styles.iconPadding}
          onPress={() => {
            props.navigation.navigate('Cart');
          }}>
          <Image source={cartIcon} style={styles.headerIcon} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.iconPadding}>
          <Image source={searchIcon} style={styles.headerIcon} />
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.badgeArea} onPress={() => {}}>
          <Image source={bellIcon} style={styles.headerIcon} />
          <Text style={styles.badge}>0</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  mainView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  customHeader: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: SCREEN_WIDTH - 32,
    height: 50,
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderColor: '#efefef',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconPadding: {
    marginRight: 10,
  },
  headerIcon: {
    width: 22,
    height: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  badge: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#f58634',
    color: '#fff',
    borderRadius: 100,
    right: -8,
    top: -5,
    lineHeight: 18,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 12,
  },
  name: {
    color: '#003974',
    fontSize: 18,
    marginBottom: 10,
  },
});

export default EmptyCart;
