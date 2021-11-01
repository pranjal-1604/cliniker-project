import firestore from '@react-native-firebase/firestore';

// export const getDoctorList =await firestore().collection('doctor').get();
// export const getClinicList =await firestore().collection('clinic').get();
// export const getDoctorById = (props =await firestore()
//   .collection('doctor')
//   .where('doc_id', '==', props.id)
//   .then(querySnapshot => {
//     return querySnapshot;
//   }));
// export const getClinicById = (props =await firestore()
//   .collection('clinic')
//   .where('id', '==', props.id)
//   .then(querySnapshot => {
//     return querySnapshot;
//   }));

export async function getDoctorList() {
  try {
    var DoctorList = [];
    await firestore()
      .collection('doctor')
      .get()
      .then(querySnapshot => {
        // console.log('Total users: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          // console.log(
          //   'User ID: ',
          //   documentSnapshot.id,
          //   documentSnapshot.data(),
          // );
          documentSnapshot.data().clinics.map((source, index) => {
            // console.log(source.id);
            DoctorList.push({...documentSnapshot.data(), clinic_index: index});
          });
          // DoctorList.push(documentSnapshot.data());
        });
      });
    return DoctorList;
  } catch (err) {
    // console.log(err);

    if (err.message === 'Network Error') {
      ErrorMessage('Please check your internet connection and try again!');
    } else {
      ErrorMessage(err.message);
    }
    return {status: false};
  }
}

export async function getClinicList() {
  try {
    var DoctorList = [];
    await firestore()
      .collection('clinic')
      .get()
      .then(querySnapshot => {
        // console.log('Total users: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          // console.log(
          //   'User ID: ',
          //   documentSnapshot.id,
          //   documentSnapshot.data(),
          // );
          DoctorList.push(documentSnapshot.data());
        });
      });
    return DoctorList;
  } catch (err) {
    // console.log(err);

    if (err.message === 'Network Error') {
      ErrorMessage('Please check your internet connection and try again!');
    } else {
      ErrorMessage(err.message);
    }
    return {status: false};
  }
}
