import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import colors from '../components/colors';
import links from '../components/links';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const slots = [
  {
    time: '7:00am-9:00am',
    taken: false,
  },
  {
    time: '7:00am-9:00am',
    taken: false,
  },
  {
    time: '7:00am-9:00am',
    taken: false,
  },
  {
    time: '7:00am-9:00am',
    taken: false,
  },
  {
    time: '7:00am-9:00am',
    taken: false,
  },
  {
    time: '7:00am-9:00am',
    taken: false,
  },
];
var slot = [];
export default function BookCalender({navigation, route}) {
  const [selected, setSelected] = useState('');
  const [selectedslot, setSelectedslot] = useState();
  const [bookedslot, setBookedslot] = useState();
  const [selectedslotdetails, setSelectedslotdetails] = useState();
  const [userdetails, setUserdetails] = useState();
  const [selectedday, setSelectedday] = useState();
  const [date, setdate] = useState('');
  const [uid, setuid] = useState('');
  const [dialog, setDialog] = useState(null);
  const {clinic_details, doctor_details} = route.params;
  const [beyonddate, setbeyonddate] = useState(false);

  var d = new Date();
  useEffect(async () => {
    console.log('********* BookCalendar **********');
    console.log('clinic details', clinic_details);
    console.log('doctor details', doctor_details);
    console.log('slot lenggth', slot.length);
    const user = auth().currentUser;
    const userdetail = firestore()
      .collection('user')
      .doc(user.uid)
      .onSnapshot(documentSnapshot => {
        // console.log('User data: ', documentSnapshot.data());
        setUserdetails(documentSnapshot.data());
      });
    console.log('doc id ', doctor_details.doc_id);
    const booking = await firestore()
      .collection('appointment')
      .doc(doctor_details.doc_id)
      .onSnapshot(documentSnapshot => {
        console.log('booked slots: ', documentSnapshot.data()?.bookedslots);
        setBookedslot(documentSnapshot.data()?.bookedslots);
      });
    // console.log("user detail", userdetail);
    // setuid(" jRzPsJlUYRQ9jut2Ls31qrddMNJ2");
    setuid(user.uid);
  }, []);
  function addtocart() {
    console.log('selected slot', selectedslotdetails);
    console.log('user id', uid);
    if (!beyonddate) {
      firestore()
        .doc('doctor_cart/' + uid)
        .update({
          appointments: firestore.FieldValue.arrayUnion(selectedslotdetails),
        })
        .then(() => {
          navigation.navigate('Cart');
        });

      slot = [];
    } else {
      setDialog('show');
    }
  }
  function setSlots(timing, date, id) {
    var check = new Date();
    var temp = timing.intime;
    if (check.getDate() == date.day) {
      timing.intime = check.getHours() + 1;
    }
    var span = timing.outime - timing.intime;
    for (var x = 0; x < span; x++) {
      slot.push(
        {
          time:
            (timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x) +
            ':00' +
            (timing.intime >= 12 ? 'pm' : 'am') +
            '-' +
            (timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x) +
            ':10' +
            (timing.intime >= 12 ? 'pm' : 'am'),
          type: 'checkup',
          date: date,
          timestamp: new Date(
            date.year,
            date.month,
            date.day,
            timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x,
            0,
            0,
          ).toString(),
          slot: timing.intime,
          subslot: 1,
          patient_name: userdetails?.activefamily?.name,
          clinic_id: id,
          doctor: doctor_details,
          reschedule_times: 0,
          status: {
            booked: false,
            consultation: false,
            prescription: false,
          },
        },
        {
          time:
            (timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x) +
            ':10' +
            (timing.intime >= 12 ? 'pm' : 'am') +
            '-' +
            (timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x) +
            ':20' +
            (timing.intime >= 12 ? 'pm' : 'am'),
          type: 'checkup',
          date: date,
          timestamp: new Date(
            date.year,
            date.month,
            date.day,
            timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x,
            10,
            0,
          ).toString(),
          slot: timing.intime,
          subslot: 2,
          patient_name: userdetails.activefamily?.name,
          clinic_id: id,
          doctor: doctor_details,
          reschedule_times: 0,
          status: {
            booked: false,
            consultation: false,
            prescription: false,
          },
        },
        {
          time:
            (timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x) +
            ':20' +
            (timing.intime >= 12 ? 'pm' : 'am') +
            '-' +
            (timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x) +
            ':30' +
            (timing.intime >= 12 ? 'pm' : 'am'),
          type: 'checkup',
          date: date,
          timestamp: new Date(
            date.year,
            date.month,
            date.day,
            timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x,
            20,
            0,
          ).toString(),
          slot: timing.intime,
          subslot: 3,
          patient_name: userdetails.activefamily?.name,
          clinic_id: id,
          doctor: doctor_details,
          reschedule_times: 0,
          status: {
            booked: false,
            consultation: false,
            prescription: false,
          },
        },
        {
          time:
            (timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x) +
            ':30' +
            (timing.intime >= 12 ? 'pm' : 'am') +
            '-' +
            (timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x) +
            ':40' +
            (timing.intime >= 12 ? 'pm' : 'am'),
          type: 'checkup',
          date: date,
          timestamp: new Date(
            date.year,
            date.month,
            date.day,
            timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x,
            30,
            0,
          ).toString(),
          slot: timing.intime,
          subslot: 4,
          patient_name: userdetails.activefamily?.name,
          clinic_id: id,
          doctor: doctor_details,
          reschedule_times: 0,
          status: {
            booked: false,
            consultation: false,
            prescription: false,
          },
        },
        {
          time:
            (timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x) +
            ':40' +
            (timing.intime >= 12 ? 'pm' : 'am') +
            '-' +
            (timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x) +
            ':50' +
            (timing.intime >= 12 ? 'pm' : 'am'),
          type: 'checkup',
          date: date,
          timestamp: new Date(
            date.year,
            date.month,
            date.day,
            timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x,
            40,
            0,
          ).toString(),
          slot: timing.intime,
          subslot: 5,
          patient_name: userdetails.activefamily?.name,
          clinic_id: id,
          doctor: doctor_details,
          reschedule_times: 0,
          status: {
            booked: false,
            consultation: false,
            prescription: false,
          },
        },
        {
          time:
            (timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x) +
            ':50' +
            (timing.intime >= 12 ? 'pm' : 'am') +
            '-' +
            (timing.intime > 12
              ? timing.intime + x - 12 + 1
              : timing.intime + x + 1) +
            ':00' +
            (timing.intime >= 12 ? 'pm' : 'am'),
          type: 'checkup',
          date: date,
          timestamp: new Date(
            date.year,
            date.month,
            date.day,
            timing.intime > 12 ? timing.intime + x - 12 : timing.intime + x,
            50,
            0,
          ).toString(),
          slot: timing.intime,
          subslot: 6,
          patient_name: userdetails.activefamily?.name,
          clinic_id: id,
          doctor: doctor_details,
          reschedule_times: 0,
          status: {
            booked: false,
            consultation: false,
            prescription: false,
          },
        },
      );
    }
    console.log('timing found', span);
    console.log('date found', typeof selecteddate);
    // slot.push(timing);
    timing.intime = temp;
  }
  function createSlots(day, date) {
    slot = [];
    console.log('day : ', day);
    console.log('date : ', date);
    console.log('clinicss', doctor_details.clinics.length);
    for (var x = 0; x < doctor_details.clinics.length; x++) {
      if (doctor_details.clinics[x].days.includes(day)) {
        setSlots(
          doctor_details.clinics[x].timing,
          date,
          doctor_details.clinics[x].id,
        );
      }
    }
  }
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backcontainer}>
            <Image style={{height: 20, width: 20}} source={links.back_black} />
          </TouchableOpacity>
        </View>
        <View style={styles.mainView}>
          <Calendar
            // Initially visible month. Default = Date()
            // current={date}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={Date()}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={'2050-05-30'}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={day => {
              console.log('selected day', day, day.dateString);
              const dayy = moment(day.dateString).format('dddd');
              // console.log(dayy.substring(0,3).toLowerCase());
              var dayyy = dayy.substring(0, 3).toLowerCase();
              setSelectedday(dayyy);
              d1 = new Date(day.dateString);
              var difference = Math.abs(d1 - d);
              days = difference / (1000 * 3600 * 24);
              console.log(days);
              if (days > 3) {
                setDialog('show');
                setbeyonddate(true);
              } else {
                setdate(d1);
                setbeyonddate(false);
              }
              setSelected(day.dateString);
              createSlots(dayyy, day);
            }}
            // Handler which gets executed on day long press. Default = undefined
            onDayLongPress={day => {
              console.log('selected day', day);
            }}
            theme={{
              selectedDayBackgroundColor: 'pink',
              selectedDayTextColor: 'blue',
            }}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={'yyyy MM'}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={month => {
              console.log('month changed', month);
            }}
            // Hide month navigation arrows. Default = false
            // Replace default arrows with custom ones (direction can be 'left' or 'right')
            //   renderArrow={direction => <Arrow />}
            // Do not show days of other months in month page. Default = false
            hideExtraDays={true}
            // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
            // day from another month that is visible in calendar page. Default = false
            disableMonthChange={true}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
            firstDay={1}
            // Hide day names. Default = false
            //   hideDayNames={true}
            // Show week numbers to the left. Default = false
            showWeekNumbers={true}
            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            onPressArrowLeft={subtractMonth => subtractMonth()}
            // Handler which gets executed when press arrow icon right. It receive a callback can go next month
            onPressArrowRight={addMonth => addMonth()}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: colors.purple,
                selectedTextColor: colors.white,
              },
            }}
            // Disable left arrow. Default = false
            //   disableArrowLeft={true}
            // Disable right arrow. Default = false
            //   disableArrowRight={true}
            // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
            //   disableAllTouchEventsForDisabledDays={true}
            // Replace default month and year title with custom one. the function receive a date as parameter.
            //   renderHeader={date => {
            //     /*Return JSX*/
            //   }}
            // Enable the option to swipe between months. Default = false
            enableSwipeMonths={true}
          />
          {slot.length != 0 ? (
            <View
              style={{
                marginTop: 10,
                backgroundColor: colors.white,
                borderRadius: 10,
                paddingBottom: 10,
              }}>
              <Text style={styles.slots}>Slots</Text>
              <View style={{}}>
                <FlatList
                  data={slot}
                  scrollEnabled={false}
                  renderItem={({item, index}) => (
                    <>
                      {console.log(item.timestamp)}
                      {console.log(bookedslot?.includes(item.timestamp))}
                      {bookedslot?.includes(item.timestamp) ? null : (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            // console.log("index ",index);
                            // console.log("item ",item);
                            setSelectedslot(index);
                            setSelectedslotdetails(item);
                            // console.log("selected slot cart", item);
                          }}
                          style={{
                            flex: 1,
                            flexDirection: 'column',
                            margin: 4,
                            borderRadius: 12,
                            borderWidth: 1,
                            height: 25,
                            justifyContent: 'center',
                            backgroundColor:
                              index == selectedslot ? '#835CB94D' : '#fff',
                          }}>
                          <Text
                            style={{
                              fontSize: 11,
                              textAlign: 'center',
                              fontWeight: 'bold',
                            }}>
                            {item.time}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                  //Setting the number of column
                  numColumns={3}
                  keyExtractor={(item, index) => index}
                />
              </View>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              addtocart();
            }}
            // onPress={() => {addtocart(), navigation.navigate('Cart')}}
            style={styles.button}>
            <Text style={styles.buttext}>ADD TO CART</Text>
          </TouchableOpacity>
        </View>
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
              <TouchableOpacity
                style={{
                  height: 27,
                  width: 27,
                  position: 'absolute',
                  right: 10,
                  top: 10,
                }}
                onPress={() => setDialog(null)}>
                <Image
                  source={links.wrong}
                  style={{
                    height: 27,
                    width: 27,
                    position: 'absolute',
                    right: 10,
                    top: 10,
                  }}
                />
              </TouchableOpacity>

              <Text style={styles.modalT}>
                Want to book for a later date? Add a reminder and we'll let you
                know when slot booking for that day starts.
              </Text>
              <TouchableOpacity
                onPress={() => setDialog(null)}
                style={[styles.button, {width: 150, height: 40}]}>
                <Text style={styles.buttext}>ADD REMINDER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 15 : 0,
  },
  backcontainer: {
    height: 40,
    width: 40,
    borderRadius: 30,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.bg,
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
    marginTop: 5,
  },
  slots: {
    fontWeight: 'bold',
    color: colors.black,
    fontSize: 15,
    textAlign: 'left',
    marginVertical: 10,
    marginLeft: 10,
  },
  button: {
    marginVertical: 15,
    width: '100%',
    borderRadius: 12,
    backgroundColor: colors.purple,
    justifyContent: 'center',
    height: 45,
  },
  buttext: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '900',
  },
  Modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFDE70',
    borderRadius: 20,
    height: 250,
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
  },
  modalT: {
    fontWeight: '900',
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
  },
});
