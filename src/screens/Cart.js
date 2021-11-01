import {TestScheduler} from '@jest/core';
import * as React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  BackHandler,
  Alert,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import backIcon from '../assets/back-black.png';
import colors from '../components/colors';
import links from '../components/links';
import moment from 'moment';
import RazorpayCheckout from 'react-native-razorpay';
import CheckBox from '@react-native-community/checkbox';
import Bookupdate from './Bookcheckupupdate';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export default function Cart(props) {
  const [currentPage, setCurrentPage] = React.useState(0);
  // const [CartItems, setCartItems] = React.useState([{type: null}]);
  const [CartItems, setCartItems] = React.useState([]);
  const [PreviousCartItems, setPreviousCartItems] = React.useState([
    {type: null},
  ]);
  const [coll, setcoll] = React.useState(0);
  const [code, setcode] = React.useState('');
  const [user, setuser] = React.useState();
  const [coupon, setcoupon] = React.useState('');
  const [totalpay, settotalpay] = React.useState(0);
  const [totaldocpay, settotaldocpay] = React.useState(0);
  const [totallabpay, settotallabpay] = React.useState(0);
  const [totalstaffrefdic, settotalstaffrefdic] = React.useState(0);
  const [totalcoupendic, settotalcoupendic] = React.useState(0);
  const [totalclinicoinsdic, settotalclinicoinsdic] = React.useState(0);
  const [empty, setempty] = React.useState(false);
  const [selectedoption, setselectedoption] = React.useState(false);
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  const [successful, setsuccessful] = React.useState(false);
  const [dialog, setDialog] = React.useState(null);
  const [dialogwarn, setDialogwarn] = React.useState(null);
  const [dialogmem, setDialogmem] = React.useState(null);
  const [familymem, setFamilymem] = React.useState([]);
  const [addresses, setAddresses] = React.useState([]);
  const [dialogaddr, setDialogaddr] = React.useState(null);
  const [userDoc_id, setuserDoc_id] = React.useState();
  const [userdetail, setuserdetail] = React.useState({
    first_name: '',
    last_name: '',
    loyalty_points: 0,
    addresses: [null],
  });
  const [refstaffdocperc, setrefstaffdocperc] = React.useState(0);
  const [refstafflabperc, setrefstafflabperc] = React.useState(0);
  const [couponcodeperc, setcouponcodeperc] = React.useState(0);
  const [couponcodeuserused, setcouponcodeuserused] = React.useState(0);
  const [refstaffinc, setrefstaffinc] = React.useState(0);
  const [refstaffid, setrefstaffid] = React.useState(0);
  const [couponcodeid, setcouponcodeid] = React.useState(0);
  const [loyaltyTerms, setloyaltyTerms] = React.useState({
    back: 0,
    multiple: 9,
  });
  const [loyaltyredeemed, setloyaltyredeemed] = React.useState(false);

  const [selectedName, setSelectedName] = React.useState('');
  const [showrefinput, setshowrefinput] = React.useState(false);
  const [showcoupeninput, setshowcoupeninput] = React.useState(false);

  // React.useEffect(() => {
  //   const backAction = () => {
  //     setCurrentPage(0);

  //     return true;
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );
  //   test();
  //   CartItems.length == 0 ? setempty(true) : setempty(false);

  //   return () => backHandler.remove();
  // }, []);

  React.useEffect(() => {
    const user = auth().currentUser;
    setuser(user);
    getuserdetail(user.uid);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (currentPage == 1 ? setCurrentPage(0) : props.navigation.goBack());

        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      test();
      // CartItems.length == 0 ? setempty(true) : setempty(false);

      return () => backHandler.remove();
    }, [currentPage]),
  );

  const getuserdetail = uid => {
    const subscriber = firestore()
      .collection('user')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        setuserdetail(documentSnapshot.data().Info);
        setuserDoc_id(documentSnapshot.id);
      });
    // console.log("user address",userdetail);
    // Stop listening for updates when no longer required
    return () => subscriber();
  };

  const secondIndicatorStyles = {
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
  };

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

  const onStepPress = position => {
    // setCurrentPage(position);
  };

  async function activefamily(selectedfamily, selectedordersindex) {
    console.log('selected family ', selectedfamily, selectedordersindex);
    console.log('Items in Cart: ', CartItems);

    if (toggleCheckBox) {
      CartItems.map(item => {
        item.patient_name = selectedfamily;
      });
    } else {
      CartItems[selectedordersindex].patient_name = selectedfamily;
    }

    console.log('Modified Cart', CartItems);

    const user = auth().currentUser;

    await firestore()
      .collection('doctor_cart')
      .doc(user.uid)
      .set({
        appointments: CartItems,
      })
      .then(() => {
        console.log('Cart Changed');
      });
    // await firestore()
    //   .collection('user')
    //   .doc(user.uid)
    //   .update({
    //     activefamily: selectedfamily.source,
    //   })
    //   .then(() => {
    //     console.log('family added!');
    //     console.log('order index ', selectedordersindex);
    //     console.log('cart order ', CartItems);
    //     CartItems[selectedordersindex].patient_name =
    //       selectedfamily.source.name;
    //     console.log('cart order ', CartItems);
    //     firestore().collection('doctor_cart').doc(user.uid).update({
    //       appointments: CartItems,
    //     });
    //     setselectedoption(-1);
    //     setToggleCheckBox(false);
    //     setDialogmem(null);
    //   });
  }
  async function activeaddress(selectedaddress, selectedordersindex) {
    console.log('selected address ', selectedaddress);
    const user = auth().currentUser;
    await firestore()
      .collection('user')
      .doc(user.uid)
      .update({
        activeaddress: selectedaddress.source,
      })
      .then(() => {
        console.log('family added!');
        console.log('order index ', selectedordersindex);
        console.log('cart order ', CartItems);
        CartItems[selectedordersindex].patient_address =
          selectedaddress.source.address_line1;
        CartItems[selectedordersindex].patient_addresstwo =
          selectedaddress.source.address_line2;
        CartItems[selectedordersindex].patient_addressthree =
          selectedaddress.source.address_line3;
        CartItems[selectedordersindex].patient_addresspincode =
          selectedaddress.source.pincode;
        console.log('cart order ', CartItems);
        firestore().collection('doctor_cart').doc(user.uid).update({
          appointments: CartItems,
        });
        setselectedoption(-1);
        setToggleCheckBox(false);
        setDialogaddr(null);
      });
  }

  function bookupdate(cart, index) {
    if (CartItems[index].type == 'checkup') {
      props.navigation.navigate('Bookcheckupupdate', {cart, index});
    } else {
      props.navigation.navigate('Booklabupdate', {cart, index});
    }
  }

  async function removeorder(removeindex) {
    const user = auth().currentUser;
    CartItems.splice(removeindex, 1);
    firestore().collection('doctor_cart').doc(user.uid).update({
      appointments: CartItems,
    });
    setCartItems(CartItems);
    setDialog(null);
  }

  async function test() {
    let famArray = [];
    const user = auth().currentUser;
    const data = await firestore()
      .collection('doctor_cart')
      .doc(user.uid)
      .get();
    setCartItems(data.data().appointments);
    const dataa = await firestore()
      .collection('appointment_doctor')
      .doc(user.uid)
      .get();
    setPreviousCartItems(dataa.data().schedule);
    console.log('cartitems ', data.data().appointments);
    console.log('cartitems sss ', dataa.data().schedule);
    const datas = await firestore()
      .collection('user')
      .doc(user.uid)
      .collection('family')
      .get();
    datas.forEach(doc => {
      // if (familymem.some(mem => mem.email === doc.data().email)) {
      //   console.log('already exists');
      // } else {
      // familymem.push(doc.data());
      // }
      famArray.push(doc.data());
      // console.log('FAM_ARRAY', famArray);
      setFamilymem(famArray);
    });
    const datass = await firestore()
      .collection('user')
      .doc(user.uid)
      .collection('address')
      .get();
    datass.forEach(doc => {
      if (
        addresses.some(mem => mem.address_line1 === doc.data().address_line1)
      ) {
        console.log('already exists', doc.data()?.name);
      } else {
        addresses.push(doc.data());
      }
    });
    console.log('datas ', addresses);
    // console.log("user collection update",data.data().appointments);
  }

  function onSuccessfullPay(amount) {
    CartItems.map((source, index) => {
      source?.type == 'checkup'
        ? firestore()
            .doc('appointment/' + source.doctor.doc_id)
            .update({
              bookedslots: firestore.FieldValue.arrayUnion(source.timestamp),
            })
        : firestore()
            .doc('appointment/' + source.lab_id)
            .update({
              bookedslots: firestore.FieldValue.arrayUnion(source.timestamp),
            });
    });
    var reff = [...PreviousCartItems, CartItems];

    const user = auth().currentUser;

    CartItems.map((s, i) => {
      firestore()
        .collection('appointment_doctor')
        .doc(user.uid)
        .update({
          schedule: firestore.FieldValue.arrayUnion(s),
        });
    });

    firestore().collection('doctor_cart').doc(user.uid).set({
      appointments: [],
    });
    firestore()
      .collection('user')
      .doc(user.uid)
      .collection('History')
      .add({
        Info: {
          amount: totalpay,
          time: new Date(),
        },
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });

    addStaffIncentive();
    addCoupondiscountdata();
    addClinicoindiscountdata();

    setCartItems([]);

    console.log('pay done');
    setsuccessful(true);
    settotalstaffrefdic(0);
    settotalcoupendic(0);
    settotalclinicoinsdic(0);
    setcode('');
    setcoupon('');
    setCurrentPage(2);
  }

  const getStaffRefferelPerc = async k => {
    firestore()
      .collection('staff')
      .where('referral.code', '==', k)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          // setrefstaff(doc.data());
          let OPD = doc.data().referral.OPD_incentive;
          let test = doc.data().referral.test_incentive;
          setrefstaffid(doc.id);
          setrefstaffinc(doc.data().referral.new_customer_incentive);
          setrefstaffdocperc(OPD / 100);
          setrefstafflabperc(test / 100);
          settotalstaffrefdic(
            totaldocpay * (OPD / 100) + totallabpay * (test / 100),
          );
          getTotal(
            totaldocpay * (OPD / 100) + totallabpay * (test / 100),
            totalcoupendic,
            totalclinicoinsdic,
          );
          setshowrefinput(false);
        });
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  };

  const addStaffIncentive = () => {
    let fie =
      moment().format('MMM').toString() + moment().format('YYYY').toString();
    // console.log(fie);
    if (totalstaffrefdic > 0) {
      firestore()
        .collection('staff')
        .doc(refstaffid)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            let k = doc.data().incentive[fie];
            if (k != null) {
              firestore()
                .collection('staff')
                .doc(refstaffid)
                .set({incentive: {[fie]: k + refstaffinc}}, {merge: true})
                .catch(function (error) {
                  console.log('Error getting document:', error);
                });
            } else {
              firestore()
                .collection('staff')
                .doc(refstaffid)
                .set({incentive: {[fie]: refstaffinc}}, {merge: true})
                .catch(function (error) {
                  console.log('Error getting document:', error);
                });
            }
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch(function (error) {
          console.log('Error getting document:', error);
        });
    }
  };

  const getcoupondiscount = async k => {
    firestore()
      .collection('coupon')
      .where('info', '==', k)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.data().active == true) {
            if (doc.data().condition != 'newuser') {
              let discount = doc.data().discount;
              console.log(doc.data().user[userDoc_id]);
              if (doc.data().user[userDoc_id] != undefined) {
                if (doc.data().user[userDoc_id] < doc.data().limit) {
                  setcouponcodeuserused(doc.data().user[userDoc_id]);
                  setcouponcodeperc(discount / 100);
                  setcouponcodeid(doc.id);
                  settotalcoupendic(
                    totaldocpay * (discount / 100) +
                      totallabpay * (discount / 100),
                  );
                  getTotal(
                    totalstaffrefdic,
                    totaldocpay * (discount / 100) +
                      totallabpay * (discount / 100),
                    totalclinicoinsdic,
                  );
                  setshowcoupeninput(false);
                } else {
                  // Alert.alert('You have exhausted coupon limit');
                  setDialogwarn('You have exhausted coupon limit');
                }
              } else {
                setcouponcodeuserused(0);
                setcouponcodeperc(discount / 100);
                setcouponcodeid(doc.id);
                settotalcoupendic(
                  totaldocpay * (discount / 100) +
                    totallabpay * (discount / 100),
                );
                getTotal(
                  totalstaffrefdic,
                  totaldocpay * (discount / 100) +
                    totallabpay * (discount / 100),
                  totalclinicoinsdic,
                );
                setshowcoupeninput(false);
              }
            } else if (doc.data().condition == 'newuser') {
              firestore()
                .collection('user')
                .doc(user.uid)
                .collection('History')
                .limit(1)
                .get()
                .then(query => {
                  if (query.empty) {
                    let discount = doc.data().discount;
                    console.log(doc.data().user[userDoc_id]);
                    if (doc.data().user[userDoc_id] != undefined) {
                      if (doc.data().user[userDoc_id] < doc.data().limit) {
                        setcouponcodeuserused(doc.data().user[userDoc_id]);
                        setcouponcodeperc(discount / 100);
                        setcouponcodeid(doc.id);
                        settotalcoupendic(
                          totaldocpay * (discount / 100) +
                            totallabpay * (discount / 100),
                        );
                        getTotal(
                          totalstaffrefdic,
                          totaldocpay * (discount / 100) +
                            totallabpay * (discount / 100),
                          totalclinicoinsdic,
                        );
                        setshowcoupeninput(false);
                      } else {
                        // Alert.alert('You have exhausted coupon limit');
                        setDialogwarn('You have exhausted coupon limit');
                      }
                    } else {
                      setcouponcodeuserused(0);
                      setcouponcodeperc(discount / 100);
                      setcouponcodeid(doc.id);
                      settotalcoupendic(
                        totaldocpay * (discount / 100) +
                          totallabpay * (discount / 100),
                      );
                      getTotal(
                        totalstaffrefdic,
                        totaldocpay * (discount / 100) +
                          totallabpay * (discount / 100),
                        totalclinicoinsdic,
                      );
                      setshowcoupeninput(false);
                    }
                  } else {
                    // Alert.alert('Coupon applicable for new users only');
                    setDialogwarn('Coupon applicable for new users only');
                  }
                });
            }
          } else {
            console.log('Coupon Expired');
            Alert.alert('Coupon Expired');
          }
        });
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  };

  const addCoupondiscountdata = () => {
    if (totalcoupendic > 0) {
      firestore()
        .collection('coupon')
        .doc(couponcodeid)
        .set({user: {[userDoc_id]: couponcodeuserused + 1}}, {merge: true})
        .catch(function (error) {
          console.log('Error getting document:', error);
        });
    }
  };

  const addClinicoinsdiscount = () => {
    firestore()
      .collection('cashbacks')
      .doc('clinicoins')
      .onSnapshot(documentSnapshot => {
        setloyaltyTerms(documentSnapshot.data());
        settotalclinicoinsdic(
          userdetail.loyalty_points * documentSnapshot.data().multiple,
        );
        getTotal(
          totalstaffrefdic,
          totalcoupendic,
          userdetail.loyalty_points * documentSnapshot.data().multiple,
        );
        setloyaltyredeemed(true);
      });
  };
  const addClinicoindiscountdata = () => {
    firestore()
      .collection('user')
      .doc(user.uid)
      .set(
        {
          Info: {
            loyalty_points:
              totalclinicoinsdic > 0
                ? Math.trunc(totalpay / 100)
                : userdetail.loyalty_points + Math.trunc(totalpay / 100),
          },
        },
        {merge: true},
      )
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  };

  const allPays = async () => {
    const get = async () => {
      let docpay = 0,
        labpay = 0;
      CartItems.map((source, index) => {
        if (source.type == 'checkup') {
          docpay = docpay + source.doctor.fees;
        } else {
          labpay = labpay + source.fees;
        }
      });
      settotaldocpay(docpay);
      settotallabpay(labpay);
      settotalpay(
        docpay +
          labpay -
          (totalclinicoinsdic + totalcoupendic + totalstaffrefdic),
      );
    };
    await get();
  };

  const getTotal = (staffrefferal, coupen, clinicoins) => {
    // console.log(totalstaffrefdic + 'dskjn');
    console.log(
      totaldocpay + totallabpay - (clinicoins + staffrefferal + coupen),
    );
    settotalpay(
      totaldocpay + totallabpay - (clinicoins + staffrefferal + coupen),
    );
  };

  function checkOut(amount) {
    console.log(amount);
    var options = {
      description: 'Cliniker app',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_2xSktBMdFPohGO',
      amount: amount,
      name: 'btc',
      //order_id: "lnoIgkIDL8Zt", //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
      prefill: {
        email: 'itsyashakaalone@example.com',
        contact: '9191919191',
        name: 'yash khurana',
      },
      theme: {color: colors.purple},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        //alert(`Success: ${data.razorpay_payment_id}`);
        onSuccessfullPay(amount);
      })
      .catch(error => {
        // handle failure
        // alert(`Error: ${error.code} | ${error.description}`);
        setsuccessful(false);
        setCurrentPage(2);
      });
  }

  const renderViewPagerPage = data => {
    switch (currentPage) {
      case 0: {
        return (
          <View key={data} style={[styles.page, styles.padding, {}]}>
            <View>
              {CartItems.map((source, index) => {
                console.log('sourceee  ', source.collection_option);
                return (
                  <View key={index} style={styles.card}>
                    {source?.type == 'checkup' ? (
                      <View>
                        <Text style={styles.name}>
                          Dr. {source?.type != null ? source?.doctor.name : ''}{' '}
                        </Text>
                        <Text style={styles.profession}>
                          {source?.type != null
                            ? source?.doctor.specialist[0]
                            : ''}
                        </Text>
                        <Text style={[styles.slot, {marginTop: 12}]}>
                          Opted Slot -
                        </Text>
                        <View
                          style={[
                            {
                              marginTop: 9,
                            },
                            styles.spacebetween,
                          ]}>
                          <View
                            style={{
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}>
                            <Image
                              source={links.clock}
                              style={{height: 15, width: 15, marginRight: 10}}
                            />
                            <Text style={styles.time}>{source?.time}</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => bookupdate(CartItems, index)}>
                            <Image
                              source={links.edit}
                              style={{height: 15, width: 15, marginRight: 10}}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={[
                            {
                              marginTop: 9,
                            },
                            styles.spacebetween,
                          ]}>
                          <View
                            style={{
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}>
                            <Image
                              source={links.calendar}
                              style={{height: 15, width: 15, marginRight: 10}}
                            />
                            <Text style={styles.time}></Text>
                            <Text style={styles.time}>
                              {source?.type != null
                                ? moment(source?.date.dateString).format('dddd')
                                : ''}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            marginTop: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text style={[styles.slot, {}]}>
                            Consultation Fee -
                          </Text>
                          <Text style={[styles.time, {marginHorizontal: 10}]}>
                            ₹
                          </Text>
                          <Text style={[styles.time, {color: colors.dark}]}>
                            {source?.type != null ? source?.doctor.fees : ''}
                          </Text>
                        </View>
                        <Text style={[styles.slot, {marginTop: 14}]}>
                          Patient Name
                        </Text>
                        <View style={styles.spacebetween}>
                          <Text style={styles.time}>
                            {source?.patient_name}
                          </Text>
                          <TouchableOpacity onPress={() => setDialogmem(index)}>
                            <Image
                              source={links.edit}
                              style={{height: 15, width: 15, marginRight: 10}}
                            />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          style={styles.remove}
                          onPress={() => {
                            setDialog(index);
                            // removeorder(index);
                          }}>
                          <Text style={styles.removeT}>REMOVE</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={styles.name}>{source?.lab_name}</Text>
                          <Text style={[styles.time, {color: '#373737'}]}>
                            Report In -<Text style={styles.time}>2 Days</Text>
                          </Text>
                        </View>
                        <Text style={styles.profession}>
                          {source?.labtest_name}
                        </Text>
                        <Text style={[styles.slot, {marginTop: 12}]}>
                          Opted Slot -
                        </Text>
                        <View
                          style={[
                            {
                              marginTop: 9,
                            },
                            styles.spacebetween,
                          ]}>
                          <View
                            style={{
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}>
                            <Image
                              source={links.clock}
                              style={{height: 15, width: 15, marginRight: 10}}
                            />
                            <Text style={styles.time}>{source?.time}</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() =>
                              // console.log("bookupdate")
                              bookupdate(CartItems, index)
                            }>
                            <Image
                              source={links.edit}
                              style={{height: 15, width: 15, marginRight: 10}}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={[
                            {
                              marginTop: 9,
                            },
                            styles.spacebetween,
                          ]}>
                          <View
                            style={{
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}>
                            <Image
                              source={links.calendar}
                              style={{height: 15, width: 15, marginRight: 10}}
                            />
                            <Text style={styles.time}>
                              {source?.type != null
                                ? moment(source?.date.dateString).format('dddd')
                                : ''}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            marginTop: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text style={[styles.slot, {}]}>
                            Consultation Fee -
                          </Text>
                          <Text style={[styles.time, {marginHorizontal: 10}]}>
                            ₹
                          </Text>
                          <Text style={[styles.time, {color: colors.dark}]}>
                            {source?.fees}
                          </Text>
                        </View>
                        <View style={styles.seperator} />
                        <Text style={[styles.slot, {marginTop: 14}]}>
                          Patient Name
                        </Text>
                        <View style={styles.spacebetween}>
                          <Text style={styles.time}>
                            {source?.patient_name == ''
                              ? 'patient not updated'
                              : source?.patient_name}
                          </Text>

                          <TouchableOpacity onPress={() => setDialogmem(index)}>
                            <Image
                              source={links.edit}
                              style={{height: 15, width: 15, marginRight: 10}}
                            />
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={[
                            styles.slot,
                            {marginTop: 14, marginBottom: 8},
                          ]}>
                          Select collection option
                        </Text>
                        <View
                          style={[
                            styles.spacebetween,
                            {justifyContent: 'space-around'},
                          ]}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                setcoll(0);
                                CartItems[index].collection_option = {
                                  clinic: true,
                                  home: false,
                                };
                                var cartitemsss = CartItems;
                                setCartItems(cartitemsss);
                              }}
                              style={[styles.radioBorder, {}]}>
                              {coll == 0 ? (
                                <View
                                  style={{
                                    height: 10,
                                    width: 10,
                                    borderRadius: 6,
                                    backgroundColor: colors.purple,
                                  }}
                                />
                              ) : null}
                            </TouchableOpacity>
                            <Text style={styles.time}>Clinic</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                setcoll(1);
                                CartItems[index].collection_option = {
                                  clinic: false,
                                  home: true,
                                };
                                var cartitemss = CartItems;
                                setCartItems(cartitemss);
                              }}
                              style={[styles.radioBorder, {}]}>
                              {coll == 1 ? (
                                <View
                                  style={{
                                    height: 12,
                                    width: 12,
                                    borderRadius: 6,
                                    backgroundColor: colors.purple,
                                  }}
                                />
                              ) : null}
                            </TouchableOpacity>
                            <Text style={styles.time}>Home</Text>
                          </View>
                        </View>
                        {coll == 1 ? (
                          <View style={[styles.spacebetween, {marginTop: 14}]}>
                            <View>
                              <Text style={[styles.slot, {}]}>
                                {source?.patient_name == ''
                                  ? 'patient not updated'
                                  : source?.patient_name}
                              </Text>
                              <Text style={styles.time}>
                                {source?.patient_address == ''
                                  ? 'adress not updated'
                                  : source?.patient_address}
                              </Text>
                              <Text style={styles.time}>
                                {source?.patient_address == ''
                                  ? 'adress not updated'
                                  : source?.patient_addresstwo}
                              </Text>
                              <Text style={styles.time}>
                                {source?.patient_address == ''
                                  ? 'adress not updated'
                                  : source?.patient_addressthree}
                              </Text>
                            </View>

                            <TouchableOpacity
                              onPress={() => setDialogaddr(index)}>
                              <Image
                                source={links.edit}
                                style={{height: 15, width: 15, marginRight: 10}}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : null}
                        <TouchableOpacity
                          style={styles.remove}
                          onPress={() => {
                            setDialog(index);
                          }}>
                          <Text style={styles.removeT}>REMOVE</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.remove,
                {marginBottom: 14, backgroundColor: colors.purple},
              ]}
              onPress={() => {
                setCurrentPage(1);
                allPays();
              }}>
              <Text style={[styles.removeT, {color: colors.white}]}>
                PROCEED
              </Text>
            </TouchableOpacity>
            <Modal
              visible={dialog !== null}
              animated
              onRequestClose={() => {
                setDialog(null);
              }}
              transparent={true}
              animationType="fade">
              <View style={styles.Modal}>
                <View style={styles.modalView}>
                  <Text style={styles.modalT}>
                    Are you sure you want to remove
                  </Text>
                  {/* <Text style={[styles.buttext, {width: '70%'}]}>
                    *Cancellation can only be done one hour before the selected
                    time
                  </Text> */}
                  <TouchableOpacity
                    style={[
                      styles.remove,
                      {marginBottom: 14, backgroundColor: '#DB5461'},
                    ]}
                    onPress={() => removeorder(dialog)}>
                    <Text style={[styles.removeT, {color: colors.white}]}>
                      REMOVE
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      height: 27,
                      width: 27,
                      position: 'absolute',
                      right: 10,
                      top: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => setDialog(null)}>
                    <Image
                      source={links.wrong}
                      style={{
                        height: 20,
                        width: 20,
                        position: 'absolute',
                        right: 10,
                        top: 10,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        );
        break;
      }
      case 1: {
        return (
          <View key={data} style={[styles.page, styles.padding, {}]}>
            <View style={styles.card}>
              <Text style={[styles.time, {color: '#373737'}]}>
                Have a code?
              </Text>
              <View style={styles.coupcont}>
                {showcoupeninput == true ? (
                  <View>
                    <TextInput
                      placeholder={'Enter Coupon Code'}
                      value={coupon}
                      onChangeText={val => setcoupon(val)}
                      style={{
                        width: '100%',
                        height: '100%',
                        color: '#000',
                      }}></TextInput>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setshowcoupeninput(true);
                    }}
                    style={styles.spacebetween}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={links.discount}
                        style={{height: 24, width: 24, marginRight: 5}}
                      />
                      <Text style={[styles.slot, {color: '#646464'}]}>
                        {totalcoupendic == 0
                          ? 'Apply Coupon Code'
                          : 'Coupon Redeemed'}
                      </Text>
                    </View>
                    <Image
                      source={links.arr_right}
                      style={{height: 20, width: 20, marginRight: 5}}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {showcoupeninput == true ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <TouchableOpacity
                    onPress={async () => {
                      // await getStaffRefferelPerc(code);
                      getcoupondiscount(coupon.toUpperCase());
                    }}
                    style={styles.redeemButton}>
                    <Text
                      style={{
                        color: colors.white,
                        fontWeight: 'bold',
                        fontSize: 11,
                      }}>
                      Redeem
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setshowcoupeninput(false);
                    }}
                    style={[styles.cancelButton, {marginLeft: 5}]}>
                    <Text
                      style={{
                        color: colors.black,
                        fontWeight: 'bold',
                        fontSize: 11,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <Text
                style={[
                  styles.time,
                  {color: colors.dark, fontWeight: '800', marginTop: 13},
                ]}>
                Referral by Staff Redeem here
              </Text>
              <View>
                <View style={styles.coupcont}>
                  {showrefinput == true ? (
                    <View>
                      <TextInput
                        placeholder={'Enter Code'}
                        value={code}
                        onChangeText={val => setcode(val)}
                        style={{
                          width: '100%',
                          color: '#000',
                          height: '100%',
                        }}></TextInput>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setshowrefinput(true);
                      }}
                      style={styles.spacebetween}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={links.discount}
                          style={{height: 24, width: 24, marginRight: 5}}
                        />
                        <Text style={[styles.slot, {color: '#646464'}]}>
                          {totalstaffrefdic == 0
                            ? 'Enter Staff Code'
                            : 'Discount Redeemed'}
                        </Text>
                      </View>
                      <Image
                        source={links.arr_right}
                        style={{height: 20, width: 20, marginRight: 5}}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {showrefinput == true ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <TouchableOpacity
                      onPress={async () => {
                        await getStaffRefferelPerc(code.toUpperCase());
                      }}
                      style={styles.redeemButton}>
                      <Text
                        style={{
                          color: colors.white,
                          fontWeight: 'bold',
                          fontSize: 11,
                        }}>
                        Redeem
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setshowrefinput(false);
                      }}
                      style={[styles.cancelButton, {marginLeft: 5}]}>
                      <Text
                        style={{
                          color: colors.black,
                          fontWeight: 'bold',
                          fontSize: 11,
                        }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>
            <View style={styles.card}>
              <View style={[styles.coupcont, {marginTop: 0}]}>
                <TouchableOpacity
                  onPress={() => {
                    addClinicoinsdiscount();
                  }}
                  style={styles.spacebetween}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={links.discount}
                      style={{height: 24, width: 24, marginRight: 5}}
                    />
                    <View>
                      <Text style={[{color: '#373737', fontWeight: 'bold'}]}>
                        Redeem loyalty points
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={[styles.time, {fontSize: 12}]}>
                          Balance{' '}
                        </Text>
                        <Text
                          style={[
                            styles.time,
                            {color: colors.dark, fontSize: 12},
                          ]}>
                          {loyaltyredeemed == true
                            ? 0
                            : userdetail.loyalty_points}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Image
                    source={links.arr_right}
                    style={{height: 20, width: 20, marginRight: 5}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                },
                styles.padding,
              ]}>
              <Image
                source={links.star}
                style={{height: 16, width: 16, marginRight: 5}}
              />
              <Text style={[styles.time, {fontSize: 12}]}>Get </Text>
              <Text style={[styles.time, {color: colors.dark, fontSize: 12}]}>
                10{' '}
              </Text>
              <Text style={[styles.time, {fontSize: 12}]}>
                Loyalty points for every{' '}
              </Text>
              <Text style={[styles.time, {color: colors.dark, fontSize: 12}]}>
                Rs 100{' '}
              </Text>
              <Text style={[styles.time, {fontSize: 12}]}>order</Text>
            </View>
            <View style={styles.card}>
              <Text style={[styles.name, {color: '#373737'}]}>
                Bill Details
              </Text>
              <View style={styles.spacebetween}>
                <Text style={styles.profession}>Doctor consultation</Text>
                <Text style={styles.profession}>₹{totaldocpay}</Text>
              </View>
              <View style={styles.spacebetween}>
                <Text style={styles.profession}>Lab Test</Text>
                <Text style={styles.profession}>₹{totallabpay}</Text>
              </View>
              <View style={styles.spacebetween}>
                <Text style={[styles.profession, {color: colors.purple}]}>
                  Coupon Code Discount
                </Text>
                <Text style={[styles.profession, {color: colors.purple}]}>
                  {totalcoupendic}
                </Text>
              </View>
              <View style={styles.spacebetween}>
                <Text style={[styles.profession, {color: colors.purple}]}>
                  Staff Referral Discount
                </Text>
                <Text style={[styles.profession, {color: colors.purple}]}>
                  {totalstaffrefdic}
                </Text>
              </View>
              <View style={styles.spacebetween}>
                <Text style={[styles.profession, {color: colors.purple}]}>
                  Loyalty Points
                </Text>
                <Text style={[styles.profession, {color: colors.purple}]}>
                  {totalclinicoinsdic}
                </Text>
              </View>
              <View style={[styles.seperator, {marginVertical: 11}]} />
              <View style={styles.spacebetween}>
                <Text style={styles.slot}>TOTAL</Text>
                <Text style={styles.slot}>{totalpay}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.remove,
                {backgroundColor: colors.purple, marginBottom: 10, width: 200},
              ]}
              onPress={() => {
                checkOut(totalpay * 100);
                // setCurrentPage(2);
              }}>
              <Text style={[styles.removeT, {color: colors.white}]}>
                PROCEED TO PAYMENT
              </Text>
            </TouchableOpacity>
          </View>
        );
        break;
      }
      // case 2: {
      //   return (
      //     <View
      //       key={data}
      //       style={[
      //         styles.page,
      //         {alignItems: 'center', justifyContent: 'center'},
      //       ]}>
      //       <TouchableOpacity
      //         style={[
      //           styles.remove,
      //           {backgroundColor: colors.purple, width: 200},
      //         ]}
      //         onPress={() => {
      //           // setCurrentPage(2);
      //           checkOut(1000 * 100);
      //         }}>
      //         <Text style={[styles.removeT, {color: colors.white}]}>
      //           PROCEED RAZORPAY
      //         </Text>
      //       </TouchableOpacity>
      //     </View>
      //   );
      //   break;
      // }
      case 2: {
        return (
          <View
            key={data}
            style={[
              styles.page,
              {alignItems: 'center', justifyContent: 'center'},
            ]}>
            {successful == false ? (
              <View>
                <View style={{marginTop: 14}}>
                  <View style={{elevation: 5}}>
                    <Image
                      source={links.fail}
                      style={{
                        height: 100,
                        width: 100,
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                  <Text
                    style={[
                      styles.profession,
                      {fontSize: 16, marginTop: 14, alignSelf: 'center'},
                    ]}>
                    Payment Unsuccessful
                  </Text>
                  <View
                    style={[
                      styles.card,
                      {
                        width: '98%',
                        alignSelf: 'center',
                        elevation: 4,
                        borderRadius: 0,
                      },
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={{
                          height: 16,
                          marginRight: 5,
                          width: 16,
                          alignSelf: 'center',
                        }}
                        source={links.exclamation}
                      />
                      <Text style={styles.profession}>
                        The system is currently experiencing some technical
                        difficulties. Error code: xyzsdfsf
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.remove,
                      {backgroundColor: colors.purple, width: 200},
                    ]}
                    onPress={() => {
                      setCurrentPage(1);
                    }}>
                    <Text style={[styles.removeT, {color: colors.white}]}>
                      TRY AGAIN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.remove, {width: 150}]}
                    onPress={() => {
                      setCurrentPage(0);
                      props.navigation.navigate('Homescreen');
                    }}>
                    <Text style={[styles.removeT, {}]}>RETURN TO HOME</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                {/* <View style={styles.comfirmcon}>
                  <View style={styles.rightcheck}>
                    <Image
                      source={links.confirm}
                      style={{height: 30, width: 30}}
                    />
                  </View>
                </View> */}
                <Image
                  source={links.confirm_symbol}
                  style={{
                    height: 150,
                    width: 150,
                    alignSelf: 'center',
                  }}
                />

                <Text
                  style={[
                    styles.profession,
                    {fontSize: 16, alignSelf: 'center'},
                  ]}>
                  Payment Confirmed
                </Text>
                <View
                  style={[
                    styles.card,
                    {
                      width: '98%',
                      alignSelf: 'center',
                      elevation: 4,
                      borderRadius: 0,
                    },
                  ]}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={{
                        height: 30,
                        marginRight: 10,
                        width: 30,
                        alignSelf: 'center',
                      }}
                      source={links.confetti}
                    />
                    <View>
                      <Text style={styles.name}>
                        {Math.trunc(totalpay / 100)} Clinicoins has been added
                        to your account
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 12,
                        }}>
                        <Text style={[styles.time, {fontSize: 12}]}>
                          Balance{' '}
                        </Text>
                        <Text
                          style={[
                            styles.time,
                            {color: colors.dark, fontSize: 12},
                          ]}>
                          {userdetail.loyalty_points}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.remove,
                    {backgroundColor: colors.purple, width: 200},
                  ]}
                  onPress={() => {
                    setCurrentPage(0);
                    props.navigation.navigate('Homescreen');
                  }}>
                  <Text style={[styles.removeT, {color: colors.white}]}>
                    RETURN TO HOME
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
        break;
      }
      default: {
        break;
      }
    }
  };

  const renderStepIndicator = params => (
    <Image {...getStepIndicatorImageConfig(params)} />
  );

  const ModalMember = () => {
    // console.log('familymem ', familymem);
    return (
      <Modal
        visible={dialogmem !== null}
        animated
        onRequestClose={() => {
          setDialogmem(null);
        }}
        transparent={true}
        animationType="fade">
        <View style={styles.Modalmem}>
          <View style={styles.modalViewMem}>
            <View style={styles.spacebetween}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#373737',
                }}>
                Select Profile -
              </Text>
              <TouchableOpacity onPress={() => setDialogmem(null)}>
                <Image style={{height: 17, width: 17}} source={links.wrong} />
              </TouchableOpacity>
            </View>

            <View style={[styles.seperator, {marginVertical: 15}]} />
            {familymem.map((source, id) => {
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => {
                    console.log('Selected Option is:', source.name, id);
                    setSelectedName(source.name);
                  }}
                  style={[
                    styles.spacebetween,
                    {
                      borderBottomWidth: 1,
                      backgroundColor:
                        selectedoption.id == id ? '#835CB980' : null,
                      paddingVertical: 5,
                    },
                  ]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{height: 11, width: 11, marginRight: 10}}
                      source={links.user}
                    />
                    <Text style={[styles.time, {color: '#373737'}]}>
                      {source?.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <View style={[styles.spacebetween, {paddingVertical: 5}]}>
              <TouchableOpacity
                onPress={() => {
                  setDialogmem(null);
                  props.navigation.navigate('AddProfile', {routes: 'Cart'});
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.newP}>
                  <Image source={links.add} style={{height: 10, width: 10}} />
                </View>
                <Text style={[styles.time, {color: '#373737'}]}>
                  Add New Profile
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.seperator, {marginVertical: 6}]} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CheckBox
                disabled={false}
                tintColors={{true: colors.dark}}
                value={toggleCheckBox}
                onValueChange={newValue => {
                  console.log('checkBox value', newValue);
                  setToggleCheckBox(newValue);
                }}
              />

              <Text style={[styles.time, {color: colors.purple}]}>
                Apply To All Tests
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.remove, {backgroundColor: colors.purple}]}
              onPress={() => {
                console.log('Name selected is: ', selectedName);
                activefamily(selectedName, dialogmem);
                // setselectedoption(-1);
                // setToggleCheckBox(false);
                // setDialogmem(null);
              }}>
              <Text style={[styles.removeT, {color: colors.white}]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const ModalAddress = () => {
    return (
      <Modal
        visible={dialogaddr !== null}
        animated
        onRequestClose={() => {
          setDialogaddr(null);
        }}
        transparent={true}
        animationType="fade">
        <View style={styles.Modalmem}>
          <View style={styles.modalViewMem}>
            <View style={styles.spacebetween}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#373737',
                }}>
                Select Address -
              </Text>
              <TouchableOpacity onPress={() => setDialogaddr(null)}>
                <Image style={{height: 17, width: 17}} source={links.wrong} />
              </TouchableOpacity>
            </View>

            <View style={[styles.seperator, {marginVertical: 15}]} />
            {addresses.map((source, id) => {
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => {
                    setselectedoption({source, id});
                  }}
                  style={[
                    styles.spacebetween,
                    {
                      borderBottomWidth: 1,
                      backgroundColor:
                        selectedoption.id == id ? '#835CB980' : null,
                      paddingVertical: 5,
                    },
                  ]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{height: 11, width: 11, marginRight: 10}}
                      source={links.user}
                    />
                    <Text style={[styles.time, {color: '#373737'}]}>
                      {source?.address_line1}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => {
                setDialogaddr(null);
                props.navigation.navigate('AddAddress', {
                  details: {
                    type: 'add',
                  },
                });
              }}
              style={[styles.spacebetween, {paddingVertical: 5}]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.newP}>
                  <Image source={links.add} style={{height: 10, width: 10}} />
                </View>
                <Text style={[styles.time, {color: '#373737'}]}>
                  Add New Address
                </Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.seperator, {marginVertical: 6}]} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CheckBox
                disabled={false}
                tintColors={{true: colors.dark}}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
              />

              <Text style={[styles.time, {color: colors.purple}]}>
                Apply To All Tests
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.remove, {backgroundColor: colors.purple}]}
              onPress={() => {
                activeaddress(selectedoption, dialogaddr);
                // setselectedoption(false);
                // setToggleCheckBox(false);
                // setDialogaddr(null);
              }}>
              <Text style={[styles.removeT, {color: colors.white}]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const ModalWarn = () => {
    return (
      <Modal
        visible={dialogwarn !== null}
        animated
        onRequestClose={() => {
          setDialogwarn(null);
        }}
        transparent={true}
        animationType="fade">
        <View style={styles.Modal}>
          <View style={[styles.modalView, {height: 200}]}>
            <Text style={styles.modalT}>{dialogwarn}</Text>
            {/* <Text style={[styles.buttext, {width: '70%'}]}>
                    *Cancellation can only be done one hour before the selected
                    time
                  </Text> */}
            {/* <TouchableOpacity
                    style={[
                      styles.remove,
                      {marginBottom: 14, backgroundColor: '#DB5461'},
                    ]}
                    onPress={() => removeorder(dialog)}>
                    <Text style={[styles.removeT, {color: colors.white}]}>
                      REMOVE
                    </Text>
                  </TouchableOpacity> */}
            <TouchableOpacity
              style={{
                height: 27,
                width: 27,
                position: 'absolute',
                right: 10,
                top: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => setDialogwarn(null)}>
              <Image
                source={links.wrong}
                style={{
                  height: 20,
                  width: 20,
                  position: 'absolute',
                  right: 10,
                  top: 10,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.customHeader]}>
          <View style={[styles.headerLeft]}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.goBack();
              }}>
              <Image source={backIcon} style={styles.headerIcon} />
            </TouchableOpacity>
            <Text style={[styles.font, styles.headerTitle]}>CART</Text>
            <Text></Text>
          </View>
        </View>
        {empty == true ? (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <View style={{}}></View>
            <Image
              style={{
                height: SCREEN_WIDTH / 2,
                width: SCREEN_WIDTH / 2,
                // alignSelf: 'center',
                marginTop: SCREEN_WIDTH / 2.5,
              }}
              source={links.cart}
            />
            <Text
              style={{
                color: '#979797',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 16,
                width: SCREEN_WIDTH / 1.7,
              }}>
              Your cart seems to be empty add products to your cart
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.stepIndicator}>
              <StepIndicator
                customStyles={secondIndicatorStyles}
                currentPosition={currentPage}
                onPress={onStepPress}
                stepCount={3}
                renderStepIndicator={renderStepIndicator}
                labels={['Details', 'Place Order', 'Payment Confirmation']}
              />
            </View>

            {renderViewPagerPage('')}
          </View>
        )}
        <View>
          <ModalMember />
          <ModalAddress />
          <ModalWarn />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  stepIndicator: {
    marginTop: 20,
  },
  page: {
    flex: 1,
  },
  headerTitle: {
    color: '#373737',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#999999',
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#4aae4f',
  },
  customHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    height: 56,
    paddingHorizontal: 16,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcon: {
    width: 22,
    height: 22,
  },
  input: {
    width: '80%',
    height: 60,
    borderWidth: 1,
    borderColor: '#9B9C98',
    position: 'relative',
    fontSize: 15,
    letterSpacing: 0.6,
  },

  padding: {
    padding: 16,
    paddingBottom: 0,
  },
  card: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 13,
    padding: 16,
    elevation: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  profession: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#646464',
    marginTop: 8,
  },
  slot: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#373737',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#646464',
  },
  removeT: {
    color: '#DB5461',
    fontWeight: 'bold',
    fontSize: 14,
  },
  remove: {
    borderColor: '#0000001F',
    borderWidth: 1,
    borderRadius: 5,
    height: 35,
    width: 94,
    alignSelf: 'center',
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacebetween: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  seperator: {
    marginVertical: 2,
    height: 1,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'grey',
  },
  radioBorder: {
    height: 18,
    width: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  modalView: {
    marginTop: 120,
    backgroundColor: '#FFDE70',
    borderRadius: 20,
    paddingTop: 40,
    paddingBottom: 20,
    width: SCREEN_WIDTH - 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    justifyContent: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  modalT: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
  },
  coupcont: {
    width: '95%',
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    borderColor: '#707070',
    paddingHorizontal: 8,
    marginTop: 13,
  },
  comfirmcon: {
    backgroundColor: '#27C33E',
    height: 100,
    width: 100,
    borderRadius: 70,
    elevation: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Modalmem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  modalViewMem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 10,
    width: SCREEN_WIDTH,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  newP: {
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    height: 14,
    width: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  rightcheck: {
    position: 'absolute',
    height: 35,
    width: 35,
    borderRadius: 25,
    right: -10,
    bottom: 10,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redeemButton: {
    height: 30,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
    borderRadius: 12,
  },
  cancelButton: {
    height: 30,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yell,
    borderRadius: 12,
  },
});
