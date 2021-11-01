import React, { useState, useCallback, useEffect} from 'react'
import {
    Text,
    StyleSheet,
    Image,
    View,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import backIcon from '../assets/back-black.png';
import sendIcon from '../assets/send.png'
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import colors from '../components/colors';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import links from '../components/links';


// 9801427659

export default function Chat(props) {
    const user = auth().currentUser;
    const [messages, setMessages] = useState([]);


    const supportUser = {
        _id: '+919801427659'
    }


    //  JV0IJA1wB7avNqzNTEGzqv6113E2
    // 04hiurmOVgcS4h1KBDzuuMWrKOu2
    // VVZOVfPWJJfsjqVpKAt0qXatYuY2

    const user_id = '04hiurmOVgcS4h1KBDzuuMWrKOu2'


    useEffect(() => {

        const unsubscribe = firestore().collection('user').doc(user_id).collection('chats')
            .orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
                const allmessages = snapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                })
                )
                if (allmessages.length === 0) {
                    setMessages([
                        {
                            _id: 1,
                            text: 'Welcome user!',
                            createdAt: new Date(),
                            user: {
                                _id: '+919801427659'
                            },
                        },
                    ])
                    console.log(messages)
                } else {
                    setMessages(allmessages)
                }
            });
        return () => unsubscribe()
    }, [])



    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
            _id,
            createdAt,
            text,
            user,
        } = messages[0]
        firestore().collection('user').doc(user_id).collection('chats').add({
            _id,
            createdAt,
            text,
            user
        }).then(() => {
            console.log('message added!');
        })
    }, [])



    function renderBubble(props) {
        // color for chat bubble modified
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: colors.purple
                    },
                }}
            />
        );
    }

    function renderSend(props) {
        // default chat button text replaced with icon
        return (
            <Send
                {...props}
                containerStyle={{
                    height: 60,
                    width: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={{ marginRight: 10, marginBottom: 5 }}>
                    <Image source={sendIcon} style={{
                        width: 20,
                        height: 20,
                    }} resizeMode={'center'} />
                </View>
            </Send>
        );
    }

    return (

        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.goBack();
                    }}>
                    <Image style={{ height: 16, width: 16 }} source={backIcon} />
                </TouchableOpacity>

                <Text style={styles.head}>Chat</Text>
                <Text></Text>
            </View>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user.phoneNumber,
                }}
                renderBubble={renderBubble}
                renderSend={renderSend}
                renderAvatar={() => null}
                showAvatarForEveryMessage={true}
            />
        </SafeAreaView>

    )
}



const styles = StyleSheet.create({
    safeContainer: {
        backgroundColor: colors.bg,
        flex: 1,
    },
    mainView: {
        flex: 1,
        width: SCREEN_WIDTH - 32,
        alignSelf: 'center',
        paddingBottom: 10,
    },
    header: {
        backgroundColor: colors.white,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        flexDirection: 'row',
        elevation: 4,
    },

    head: {
        color: '#373737',
        fontSize: 20,
        fontWeight: 'bold',
    },

});

