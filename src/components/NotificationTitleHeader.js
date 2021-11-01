import React from 'react';
import {
    Text,
    StyleSheet,
    Image,
    View,
    Dimensions,
    TouchableOpacity,

  } from 'react-native';

import backIcon from '../assets/back-black.png';
import filterIcon from '../assets/filter.png';
import bellIcon from '../assets/bell.png';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');


const NotificationTitleHeader = ({title,navigation}) => {
    function  filter(){
        navigation.navigate('FilterScreen')
    }

    return(
        <View style={[styles.customHeader]}>
            <View style={[styles.headerLeft]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={backIcon} style={styles.headerIcon} />
                </TouchableOpacity>
                <Text style={[styles.font, styles.headerTitle]}>{title}</Text>
            </View>
            <View style={[styles.headerRight]}>
                <TouchableOpacity style={styles.iconPadding} onPress={filter}>
                    <Image source={filterIcon} style={styles.headerIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.badgeArea}>
                    <Image source={bellIcon} style={styles.headerIcon} />
                    <Text style={styles.badge}>0</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({

    customHeader:{
        backgroundColor:'#fff',
        flex:1,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        width:SCREEN_WIDTH,
        height:50,
        paddingHorizontal:16,
        borderBottomWidth:1,
        borderColor:'#efefef',
        position:"absolute",
        top:0,
        zIndex:9999
    },
    headerLeft:{
        flex:1,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
    },
    headerRight:{
        flex:1,
        flexDirection:"row",
        justifyContent:"flex-end",
        alignItems:"center",
    },
    headerIcon:{
        width:22,
        height:22,
    },
    headerTitle:{
        fontSize:18,
        color:'#29303a',
        fontWeight:"bold",
        marginLeft:8
    },
    badge:{
        position:"absolute",
        width:20,
        height:20,
        backgroundColor:'#f58634',
        color:'#fff',
        borderRadius:100,
        right:-8,
        top:-5,
        lineHeight:18,
        justifyContent:"center",
        alignItems:"center",
        textAlign:"center",
        fontSize:12
    },
});
export default NotificationTitleHeader
