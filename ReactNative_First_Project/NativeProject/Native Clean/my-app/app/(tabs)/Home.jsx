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
const Home = ({navigation}) => {

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
  const chats = [
    { id: 1, name: "Kouiki Mohamed Aziz" },
    { id: 2, name: "Anas" },
    { id: 3, name: "Amine" },
    { id: 4, name: "Motaz" },
    { id: 5, name: "Tasnim" },
    { id: 6, name: "CR7" },
    { id: 7, name: "Patron" },
    { id: 8, name: "Messi" }

  ]
 useEffect(()=>{
  // schedulePushNotification();
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
   const [List,setSearchInput] = useState(chats);
   
function SearchForTypedText(s){
  console.log(s);
  if(s === ''){
    setSearchInput(chats);
  }else{
  // setinserteditems(list_testing.filter((item)=> item.label = s));
  setSearchInput(chats.filter((item) => item.name.toLowerCase().includes(s.toLowerCase())));
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
        console.log(s);
    }

    
    if(session != null && session.setUser != null){
  return (
    <View style={{flex:1}}>
<Text style={{fontSize: 25, color: 'black', textAlign: 'center'}}>
      Welcome to the chat room!
    </Text>
    <View style={{paddingRight:10,paddingLeft:10}}>
    <CPickerChat items={List} navigateto={ModelClickeOn} placeholder='Seach for a friend'  onChangeTextP={SearchForTypedText} iconname='account-search' Iconcolor='black'></CPickerChat>
    
    </View>
      <View style={{flex:1}}>
      <FlatList
      
      keyExtractor={(chat)=>{ return chat.id.toString();}}
      data={chats}

      renderItem={ ({item})=>{
       return <SettingsCard onP={()=>{navigation.navigate('InsideChat',{user:item})}}  Subtitle={"tasdadet"} Title={item.name}></SettingsCard>
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