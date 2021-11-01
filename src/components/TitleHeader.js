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
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const TitleHeader = ({title,navigation}) => {
    
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
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: SCREEN_WIDTH,
        height: 50,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#efefef'
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
        fontWeight: '700',
        marginLeft: 12
    },

});


export default TitleHeader;