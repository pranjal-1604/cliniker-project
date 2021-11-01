import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import colors from './colors';
import links from './links';

export default class MenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userdetail: {
        first_name: '',
        last_name: '',
        phone_no: '',
      },
    };
  }

  componentDidMount() {
    const user = auth().currentUser;
    (async () => {
      const subscriber = firestore()
        .collection('user')
        .doc(user.uid)
        .onSnapshot(documentSnapshot => {
          // console.log('User data: ', documentSnapshot.data());
          this.setState({userdetail: documentSnapshot.data().Info});
        });
      // Stop listening for updates when no longer required
      return () => subscriber();
    })();
  }
  logOutButton = async () => {};
  render() {
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <View style={styles.profileBox}>
              <TouchableOpacity
                onPress={() => {
                  // this.props.navigation.navigate('Profilescreen');
                  // console.log(this.state.userdetail);
                }}>
                <Image
                  // source={links.doctor}
                  source={
                    this.state.userdetail.img == ''
                      ? links.doctor
                      : {
                          uri: `data:${this.state.userdetail.img?.type};base64,${this.state.userdetail.img?.code}`,
                        }
                  }
                  style={styles.thumb}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.uploadBtn}>
                <Image source={camIcon} style={styles.IconXl} />
              </TouchableOpacity> */}
            </View>
            <View style={styles.profileName}>
              <Text style={[styles.head, {textAlign: 'left'}]}>
                {this.state.userdetail.name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Profilescreen');
                }}>
                <Text style={styles.subHead}>View And Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#707070',
              marginTop: 10,
            }}></View>
          <View style={styles.menuList}>
            <View>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('UpcomingOrders');
                }}>
                <Text style={styles.menuText}>Upcoming Orders</Text>
                <Image style={styles.arrow} source={links.arrow_grey}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('MyOrders');
                }}>
                <Text style={styles.menuText}>My Orders</Text>
                <Image style={styles.arrow} source={links.arrow_grey}></Image>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('Managerecords');
                }}>
                <Text style={styles.menuText}>Manage Records</Text>
                <Image style={styles.arrow} source={links.arrow_grey}></Image>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('Allclinics');
                }}>
                <Text style={styles.menuText}>All Clinics</Text>
                <Image style={styles.arrow} source={links.arrow_grey}></Image>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('AllPharmacies');
                }}>
                <Text style={styles.menuText}>Pharmacies</Text>
                <Image style={styles.arrow} source={links.arrow_grey}></Image>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('Blogscreen');
                }}>
                <Text style={styles.menuText}>Blogs</Text>
                <Image style={styles.arrow} source={links.arrow_grey}></Image>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('Contact');
                }}>
                <Text style={styles.menuText}>Contact Us</Text>
                <Image style={styles.arrow} source={links.arrow_grey}></Image>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: '#707070',
                marginTop: 10,
              }}></View>
            <View style={styles.menuList}>
              <View>
                <TouchableOpacity
                  style={styles.menuItem}
                  activeOpacity={0.5}
                  onPress={() => {
                    this.props.navigation.navigate('Settings');
                  }}>
                  <Text style={styles.menuText}>Settings</Text>
                  <Image style={styles.arrow} source={links.arrow_grey}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  activeOpacity={0.5}
                  onPress={() => {
                    this.props.navigation.navigate('Privacy');
                  }}>
                  <Text style={styles.menuText}>Privacy Policy</Text>
                  <Image style={styles.arrow} source={links.arrow_grey}></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  // Pradeep Style
  container: {
    flex: 1,
  },
  profileContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileBox: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 9,
    marginTop: 32,
  },
  thumb: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 70,
    width: 100,
    height: 100,
  },
  uploadBtn: {
    position: 'absolute',
    bottom: 0,
    right: 8,
  },
  IconXl: {
    width: 36,
    height: 36,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuList: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  menuText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.dark,
  },
  buttonArea: {
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#f58634',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonSm: {
    height: 32,
    width: 100,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  profileBg: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#003974',
    width: '100%',
    height: 120,
  },
  /*  profileBox: {
    marginTop: 32,
  },*/
  profileName: {
    // alignItems: 'center',
  },
  head: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subHead: {
    fontSize: 14,
    color: colors.dark,
    marginTop: 4,
    fontWeight: 'bold',
  },
  arrow: {
    height: 17,
    width: 17,
  },
});
