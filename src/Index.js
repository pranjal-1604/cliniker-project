import React, {useState, useEffect} from 'react';
import {Dimensions, View, Text, Image} from 'react-native';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

//screens
import Loginscreen from './screens/Loginscreen';
import Homescreen from './screens/Homescreen';
import MenuScreen from './components/MenuScreen';
import Managerecords from './screens/Managerecords';
import UpcomingOrders from './screens/UpcomingOrders';
import MyOrders from './screens/MyOrders';
import Allclinics from './screens/Allclinics';
import AllProfiles from './screens/AllProfiles';
import Addresses from './screens/Addresses';
import AddAddress from './screens/AddAddress';
import Splash from './screens/Splash';
import Clinicdetails from './screens/Clinicdetails';
import Details from './screens/Details';
import Profilescreen from './screens/Profilescreen';
import Doctordetails from './screens/Doctordetails';
import AllPharmacies from './screens/AllPharmacies';
import DoctorSearch from './screens/DoctorSearch';
import SearchScreen from './screens/SearchScreen';
import Blogscreen from './screens/Blogscreen';
import BlogDetails from './screens/BlogDetails';
import LabSearch from './screens/LabSearch';
import BookCalender from './screens/BookCalender';
import Bookcliniccalender from './screens/Bookcliniccalender';
import BooklabCalender from './screens/BooklabCalendar';
import Bookcheckupupdate from './screens/Bookcheckupupdate';
import Booklabupdate from './screens/Booklabupdate';
import Cart from './screens/Cart';
import AddProfile from './screens/AddProfile';
import EditProfile from './screens/EditProfile';
import Contact from './screens/Contact';
import Privacy from './screens/Privacy';
import About from './screens/About';
import Healthvault from './screens/Healthvault';
import Clinicoins from './screens/Clinicoins';
import Partners from './screens/Partners';
import FAQ from './screens/FAQ';
import Howtouse from './screens/Howtouse';
import Settings from './screens/Settings';
import Notifications from './screens/Notifications';
import AddRecords from './screens/AddRecords';
import EditRecords from './screens/EditRecords';
import Confetti from './screens/Confetti';
import AllPackages from './screens/AllPackages';
import PackageDetail from './screens/PackageDetail';
import Chat from './screens/Chat';

//components
import colors from './components/colors';
import links from './components/links';

//dependencies
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Stack = createStackNavigator();
const HomeStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Homescreen" component={Homescreen} />
    <Stack.Screen name="Managerecords" component={Managerecords} />
    <Stack.Screen name="UpcomingOrders" component={UpcomingOrders} />
    <Stack.Screen name="MyOrders" component={MyOrders} />
    <Stack.Screen name="BookCalender" component={BookCalender} />
    <Stack.Screen name="Bookcliniccalender" component={Bookcliniccalender} />
    <Stack.Screen name="BooklabCalender" component={BooklabCalender} />
    <Stack.Screen name="Bookcheckupupdate" component={Bookcheckupupdate} />
    <Stack.Screen name="Booklabupdate" component={Booklabupdate} />
    <Stack.Screen name="Allclinics" component={Allclinics} />
    <Stack.Screen name="Clinicdetails" component={Clinicdetails} />
    <Stack.Screen name="Profilescreen" component={Profilescreen} />
    <Stack.Screen name="AllPharmacies" component={AllPharmacies} />
    <Stack.Screen name="Doctordetails" component={Doctordetails} />
    <Stack.Screen name="Blogscreen" component={Blogscreen} />
    <Stack.Screen name="BlogDetails" component={BlogDetails} />
    <Stack.Screen name="DoctorSearch" component={DoctorSearch} />
    <Stack.Screen name="LabSearch" component={LabSearch} />
    <Stack.Screen name="AllProfiles" component={AllProfiles} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
    <Stack.Screen name="AddProfile" component={AddProfile} />
    <Stack.Screen name="Addresses" component={Addresses} />
    <Stack.Screen name="AddAddress" component={AddAddress} />
    <Stack.Screen name="Cart" component={Cart} />
    <Stack.Screen name="Contact" component={Contact} />
    <Stack.Screen name="Clinicoins" component={Clinicoins} />
    <Stack.Screen name="About" component={About} />
    <Stack.Screen name="Partners" component={Partners} />
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="Privacy" component={Privacy} />
    <Stack.Screen name="Howtouse" component={Howtouse} />
    <Stack.Screen name="FAQ" component={FAQ} />
    <Stack.Screen name="Notifications" component={Notifications} />
    <Stack.Screen name="Healthvault" component={Healthvault} />
    <Stack.Screen name="Confetti" component={Confetti} />
    <Stack.Screen name="AddRecords" component={AddRecords} />
    <Stack.Screen name="EditRecords" component={EditRecords} />
    <Stack.Screen name="AllPackages" component={AllPackages} />
    <Stack.Screen name="PackageDetail" component={PackageDetail} />
    <Stack.Screen name="ChatScreen" component={Chat} />
  </Stack.Navigator>
);
const SearchStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
  </Stack.Navigator>
);
const CartStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Cart" component={Cart} />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      tabBarOptions={{
        activeTintColor: colors.yell,
        activeBackgroundColor: colors.white,
        inactiveTintColor: colors.white,
        inactiveBackgroundColor: colors.white,
        showLabel: false,
        style: {
          // Remove border top on both android & ios
          borderTopWidth: 0,
          borderTopColor: 'transparent',

          elevation: 0,
          shadowOpacity: 0,
          shadowOffset: {
            height: 0,
          },
          shadowRadius: 0,
        },
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <View
                style={{
                  height: 22,
                  width: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: color,
                  borderRadius: 15,
                }}>
                <Image style={{height: 17, width: 17}} source={links.home} />
              </View>
              <Text
                style={{color: colors.black, fontWeight: 'bold', opacity: 0.7}}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <View
                style={{
                  height: 22,
                  width: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: color,
                  borderRadius: 15,
                }}>
                <Image style={{height: 17, width: 17}} source={links.search} />
              </View>
              <Text
                style={{color: colors.black, fontWeight: 'bold', opacity: 0.7}}>
                Search
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CartStack"
        component={CartStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  height: 22,
                  width: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: color,
                  borderRadius: 15,
                }}>
                <Image style={{height: 17, width: 17}} source={links.cart} />
              </View>

              <Text
                style={{color: colors.black, fontWeight: 'bold', opacity: 0.7}}>
                Cart
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Drawer = createDrawerNavigator();

// const DrawerStack = () => (
//   <Drawer.Navigator
//     drawerStyle={{
//       height: SCREEN_HEIGHT / 1.1,
//       borderBottomRightRadius: 14,
//       borderTopRightRadius: 14,
//     }}
//     drawerContent={props => <MenuScreen {...props} />}>
//     <Drawer.Screen name="Homescreen" component={Homescreen} />
//     <Drawer.Screen name="Managerecords" component={Managerecords} />
//     <Drawer.Screen name="UpcomingOrders" component={UpcomingOrders} />
//     <Drawer.Screen name="MyOrders" component={MyOrders} />
//     <Drawer.Screen name="Allclinics" component={Allclinics} />
//     <Drawer.Screen name="Clinic" component={Clinic} />
//     <Drawer.Screen name="Profilescreen" component={Profilescreen} />
//     <Drawer.Screen name="AllPharmacies" component={AllPharmacies} />
//     <Drawer.Screen name="Doctordetails" component={Doctordetails} />
//     <Drawer.Screen name="Cart" component={Cart} />
//     <Drawer.Screen name="Blogscreen" component={Blogscreen} />
//     <Drawer.Screen name="DoctorSearch" component={DoctorSearch} />
//     <Drawer.Screen
//       name="Cart"
//       component={Cart}
//     />
//   </Drawer.Navigator>
// );
const DrawerStack = () => (
  <Drawer.Navigator
    drawerStyle={{
      height: SCREEN_HEIGHT / 1.1,
      borderBottomRightRadius: 14,
      borderTopRightRadius: 14,
    }}
    drawerContent={props => <MenuScreen {...props} />}>
    <Drawer.Screen name="MyTabs" component={MyTabs} />
  </Drawer.Navigator>
);

const AuthDone = createStackNavigator();
const AuthDoneScreen = () => (
  <AuthDone.Navigator headerMode="none">
    <AuthDone.Screen name="Splash" component={Splash} />
    <AuthDone.Screen name="DrawerStack" component={DrawerStack} />
    <AuthDone.Screen name="Details" component={Details} />
  </AuthDone.Navigator>
);
const AuthNotDone = createStackNavigator();
const AuthNotDoneScreen = () => (
  <AuthNotDone.Navigator headerMode="none">
    <AuthNotDone.Screen name="Loginscreen" component={Loginscreen} />
  </AuthNotDone.Navigator>
);

const Index = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <>
      {!user ? (
        <NavigationContainer>
          <AuthNotDoneScreen />
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          {/* <MyTabs /> */}
          <AuthDoneScreen />
        </NavigationContainer>
      )}
    </>
  );
};

export default Index;
