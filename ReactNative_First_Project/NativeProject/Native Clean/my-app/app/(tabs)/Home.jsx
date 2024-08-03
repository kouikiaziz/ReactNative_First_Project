import { StyleSheet, Text, View,TouchableOpacity, BackHandler, Alert,FlatList } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {  } from 'react-native-gesture-handler'
import storage from '../Auth/storage'
import AuthContext from '../Auth/Context'
import Auth from '../api/Auth'
import { useFocusEffect } from 'expo-router'
import * as Notifications from 'expo-notifications';
import CPickerChat from '../components/CPickerChat'
import SettingsCard from '../components/SettingsCard'
import HomeApi from '../api/HomeApi'
import ChatContext from '../Auth/ChatContext'
const Home = ({navigation}) => {
  let chats = useContext(ChatContext);
  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here', test: { test1: 'more data' } },
      },
      trigger: { seconds: 5 },
    });
  }

  // const chats = [
  //   { id: 1, name: "Kouiki Mohamed Aziz" },
  //   { id: 2, name: "Anas" },
  //   { id: 3, name: "Amine" },
  //   { id: 4, name: "Motaz" },
  //   { id: 5, name: "Tasnim" },
  //   { id: 6, name: "CR7" },
  //   { id: 7, name: "Patron" },
  //   { id: 8, name: "Messi" }
  // ]
  
useEffect(()=>{
  const sortedConversations = chats.datachats.sort((a, b) => {
    // Get the time of the latest message for each conversation
    const timeA = a.chat.length > 0 ? new Date(a.chat[a.chat.length - 1].time) : new Date(0);
    const timeB = b.chat.length > 0 ? new Date(b.chat[b.chat.length - 1].time) : new Date(0);
    
    // Sort by descending order (latest time first)
    return timeB - timeA;
  });
   chats.setdata(sortedConversations);
},[chats.datachats]);
  

  async function getData(){
    data = {Token : session.user.Token};
    let res = await HomeApi.GetData(data);
    if(res.ok){
        console.log(res.data.Success);
        const sortedConversations = res.data.Success.sort((a, b) => {
          // Get the time of the latest message for each conversation
          const timeA = a.chat.length > 0 ? new Date(a.chat[a.chat.length - 1].time) : new Date(0);
          const timeB = b.chat.length > 0 ? new Date(b.chat[b.chat.length - 1].time) : new Date(0);
          
          // Sort by descending order (latest time first)
          return timeB - timeA;
        });
         chats.setdata(res.data.Success);
        setSearchInput(res.data.Success);
    }else{
      console.log('not ok');
    }
  }

 useEffect(()=>{
  // schedulePushNotification();
  getData();
 },[])

 const responseListener = useRef(null);
  const notificationListener = useRef(null);

  useEffect(() => {
    console.log("Home Mounted");

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      console.log("Home :");
      // console.log(notification.request.content.data);
      console.log(notification);

      if(notification.request.content.data.APPEND_NEW_MESSAGE){
        let Msg =notification.request.content.data.APPEND_NEW_MESSAGE.New_msg;
        let conversation_id = notification.request.content.data.APPEND_NEW_MESSAGE.conversation_id;
        

      //   chats.setdata((previousData) => {
      //     return previousData.map(conversation => {
      //         if (conversation.conversation_id === conversation_id) {
      //             // Append the new message to the chat array
      //             return {
      //                 ...conversation,
      //                 chat: [...conversation.chat, Msg]
      //             };
      //         }
      //         // Return the conversation as is if it doesn't match the conversation_id
      //         return conversation;
      //     });
      // });


      chats.setdata((previousData) => {
        // Find the conversation to update
        let updatedConversation;
        const updatedData = previousData.map(conversation => {
          if (conversation.conversation_id === conversation_id) {
            updatedConversation = {
              ...conversation,
              chat: [...conversation.chat, Msg]
            };
            return updatedConversation;
          }
          return conversation;
        });
    
        // Remove the updated conversation from its original position
        const filteredData = updatedData.filter(conversation => conversation.conversation_id !== conversation_id);
    
        // Add the updated conversation to the beginning of the array
        return [updatedConversation, ...filteredData];
      });


      }
      if(notification.request.content.data.user_came_online){
        const { conversation_id, online_status } = notification.request.content.data.user_came_online;

        chats.setdata((previousData) => {
          return previousData.map(conversation => {
            if (conversation.conversation_id === conversation_id) {
              return {
                ...conversation,
                online_status: online_status
              };
            }
            return conversation;
          });
        });






      }
    
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Action Home :");
      console.log(response);
     
    });
    

    return () => {
      console.log("Home Unmounted");
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

 
 
  
    let session = useContext(AuthContext);
   const [List,setSearchInput] = useState(chats.datachats);
   
function SearchForTypedText(s){
  console.log(s);
  if(s === ''){
    setSearchInput(chats.datachats);
  }else{
  // setinserteditems(list_testing.filter((item)=> item.label = s));
  setSearchInput(chats.datachats.filter((item) => item.user_name.toLowerCase().includes(s.toLowerCase())));
  }
}

    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          // Custom behavior on back press
          Alert.alert(
            'Exit App',
            'Do you want to exit the app?',
            [
              { text: 'No', onPress: () => null, style: 'cancel' },
              { text: 'Yes', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false }
          );
          return true;
        };
  
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        };
      }, [])
    );

    function ModelClickeOn(s){
      navigation.navigate('InsideChat',{user:s})
    }
    
    if(session != null && session.setUser != null){
  return (
    <View style={{flex:1}}>
<Text style={{fontSize: 25, color: 'black', textAlign: 'center'}}>
      Welcome to the chat room!
    </Text>
    <View style={{paddingRight:10,paddingLeft:10}}>
    <CPickerChat items={chats.datachats} navigateto={(s)=>{ModelClickeOn(s);}} placeholder='Seach for a friend'  onChangeTextP={SearchForTypedText} iconname='account-search' Iconcolor='black'></CPickerChat>
    
    </View>
      <View style={{flex:1}}>
      <FlatList
      
      keyExtractor={(chat)=>{ return chat.conversation_id.toString();}}
      data={chats.datachats}

      renderItem={ ({item})=>{
       //return <SettingsCard onP={()=>{navigation.navigate('InsideChat',{user:item})}}  Subtitle={item.chat.length > 0 ? item.chat[item.chat.length - 1].content : "Start Conversation Now !"} Title={item.user_name} uri_u={item.user_image}></SettingsCard>
      //   return <SettingsCard
      //   onP={() => {
      //     navigation.navigate('InsideChat', { user: item });
      //     console.log("JISDJJD ",item);
      //   }}
      //   Subtitle={item.chat.length > 0 
      //     ? `${item.chat[item.chat.length - 1].am_i_sender ? "YOU" : item.user_name}: ${item.chat[item.chat.length - 1].content}` 
      //     : "No messages yet"}
      //   Title={item.user_name}
      //   uri_u={item.user_image}
      //   Online={item.online_status}
      // />



      const lastChat = item.chat.length > 0 ? item.chat[item.chat.length - 1] : null;
      let subtitle = "No messages yet";
  
      if (lastChat) {
        if (lastChat.image) {
          subtitle = `${lastChat.am_i_sender ? "YOU" : item.user_name}: SENT IMAGE`;
        } else if (lastChat.voiceRecord) {
          subtitle = `${lastChat.am_i_sender ? "YOU" : item.user_name}: SENT A VOICE MESSAGE`;
        } else {
          subtitle = `${lastChat.am_i_sender ? "YOU" : item.user_name}: ${lastChat.content}`;
        }
      }
  
      return (
        <SettingsCard
          onP={() => {
            navigation.navigate('InsideChat', { user: item });
            console.log("JISDJJD ", item);
          }}
          Subtitle={subtitle}
          Title={item.user_name}
          uri_u={item.user_image}
          Online={item.online_status}
        />
      );















      }
      }
      ></FlatList>
      </View>
    </View>
  )
}else{
  console.log("whats going on ?" );
  console.log(session);
  return(  <View></View>)
}
}

export default Home

const styles = StyleSheet.create({})