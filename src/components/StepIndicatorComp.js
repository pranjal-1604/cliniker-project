import React, {useState, useEffect} from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';

import links from './links';
import colors from './colors';
import StepIndicator from 'react-native-step-indicator';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const StepIndicatorComp = props => {
  const [currentPage, setCurrentPage] = useState(props.obj.step);
  const [successful, setsuccessful] = useState(props.obj.success);

  const getStepIndicatorImageConfig = ({position, stepStatus}) => {
    const iconConfig = {
      source: links.confirm,
      style: {height: 20, width: 20},
    };
    switch (position) {
      case 0: {
        iconConfig.source = stepStatus === 'finished' ? links.confirm : null;
        break;
      }
      case 1: {
        iconConfig.source = stepStatus === 'finished' ? links.confirm : null;
        break;
      }
      case 2: {
        iconConfig.source = successful == true ? links.confirm : null;
        break;
      }
      default: {
        break;
      }
    }
    return iconConfig;
  };

  const getStepIndicatorImageConfigForLab = ({position, stepStatus}) => {
    const iconConfig = {
      source: links.confirm,
      style: {height: 20, width: 20},
    };
    switch (position) {
      case 0: {
        iconConfig.source = stepStatus === 'finished' ? links.confirm : null;
        break;
      }
      case 1: {
        iconConfig.source = stepStatus === 'finished' ? links.confirm : null;
        break;
      }
      case 2: {
        iconConfig.source = stepStatus === 'finished' ? links.confirm : null;
        break;
      }
      case 3: {
        iconConfig.source = successful == true ? links.confirm : null;
        break;
      }
      default: {
        break;
      }
    }
    return iconConfig;
  };

  const renderStepIndicator = params => (
    <Image {...getStepIndicatorImageConfig(params)} />
  );
  const renderStepIndicatorForLab = params => (
    <Image {...getStepIndicatorImageConfigForLab(params)} />
  );

  const onStepPress = position => {
    setCurrentPage(position);
  };

  const indicatorDoctor = {
    stepIndicatorSize: 20,
    currentStepIndicatorSize: 20,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: successful == true ? '#1CCE22' : '#835CB9',
    stepStrokeWidth: 3,
    separatorStrokeFinishedWidth: 3,
    stepStrokeFinishedColor: '#1CCE22',
    stepStrokeUnFinishedColor: '#835CB980',
    separatorFinishedColor: '#1CCE2280',
    separatorUnFinishedColor: '#835CB980',
    stepIndicatorFinishedColor: '#1CCE2280',
    stepIndicatorUnFinishedColor: '#fff',
    stepIndicatorCurrentColor: successful == true ? '#1CCE2280' : '#835CB980',
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 14,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#7F8386',
    stepIndicatorLabelUnFinishedColor: '#7F8386',
    labelColor: '#7F8386',
    labelSize: 14,
    currentStepLabelColor: '#7F8386',
    labelAlign: 'flex-start',
  };

  return (
    <View style={{}}>
      <StepIndicator
        stepCount={props.obj.stepcount}
        direction="vertical"
        customStyles={indicatorDoctor}
        currentPosition={currentPage}
        onPress={onStepPress}
        renderStepIndicator={
          props.obj.stepcount == 4
            ? renderStepIndicatorForLab
            : renderStepIndicator
        }
        labels={props.obj.label}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default StepIndicatorComp;
