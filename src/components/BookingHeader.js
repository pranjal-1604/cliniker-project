import React from 'react';
import {
    Text,
    StyleSheet,
    Image,
    View,
    Dimensions,
    TouchableOpacity,

} from 'react-native';

import backIcon from '../assets/back-white.png';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const BookingHeader = ({title,navigation}) => {
    
    // console.log("hello");
    return(
        <View style={[styles.customHeader]}>
            <View style={[styles.headerLeft]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={backIcon} style={styles.headerIcon} />
                </TouchableOpacity>
                <Text style={[styles.font, styles.headerTitle]}>{title}</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    customHeader: {
        width: SCREEN_WIDTH,
        borderColor: '#efefef',
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'flex-start',
    },
    headerLeft: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    headerIcon: {
        width: 22,
        height: 22,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
        color:'#fff'
    },
    
});


export default BookingHeader;