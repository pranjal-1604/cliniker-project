import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import BackgroundImage from '../assets/HeaderBackground.png';
import PageHeaderImage from '../assets/PageHeaderImage.png';
import PageBackButtonImage from '../assets/PageBackButtonImage.png';

const Header = props => {
  return (
    <View style={styles.headerView}>
      <ImageBackground source={BackgroundImage} style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={props.onPress}>
          <Image source={PageBackButtonImage} style={styles.backButton} />
        </TouchableOpacity>
        <View style={styles.subHeader}>
          <View style={styles.screenNameView}>
            <Text style={styles.screenName}>{props.headerText}</Text>
          </View>
          <Image source={PageHeaderImage} style={styles.logoImage} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {flex: 2, flexDirection: 'row'},
  imageContainer: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    opacity: 0.7,
    paddingTop: 20,
    paddingLeft: 30,
    height: '115%',
  },
  backButtonContainer: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  backButton: {
    flex: 1,
    resizeMode: 'contain',
    width: 15,
  },
  subHeader: {
    flex: 6,
    flexDirection: 'row',
  },
  screenNameView: {
    flex: 4,
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  screenName: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    justifyContent: 'center',
    width: 90,
    paddingTop: 20,
    fontSize: 15,
    letterSpacing: 0.7,
  },
  logoImage: {
    flex: 3,
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
    opacity: 1,
  },
});

export default Header;
