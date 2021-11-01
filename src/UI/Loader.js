import React from 'react';
import {Text, View, ActivityIndicator, Platform, Modal} from 'react-native';

const Loader = (props) => {
  return (
    <Modal transparent={true} animationType={'none'}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color="rgba(64,20,133,1)" />
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    height: 90,
    width: 90,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  activityIndicatorWrapperIos: {
    height: 60,
    width: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    //shadowOffset: { width: 10, height: 10 },
    //shadowColor: 'black',
    //shadowOpacity: 1,
    // elevation: 3,
  },
};

export default Loader;
