import {Toast} from 'native-base';

export const ErrorMessage = (errMsg) => {
  return Toast.show({
    text: errMsg,
  });
};
