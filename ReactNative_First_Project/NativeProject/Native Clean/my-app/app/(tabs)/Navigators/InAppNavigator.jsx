import { AppState, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loginscreen from '../Loginscreen';
import Login from '../Login';
import RecoverAccont from '../RecoverAccont';
import ResetPassword from '../ResetPassword';
import Home from '../Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from '../Settings'
import SettingsStacks from '../Navigators/SettingsNavigator'
import { useFocusEffect } from 'expo-router';
import TestCamera from '../TestCamera';
const Tabs = createBottomTabNavigator();
import * as Notifications from 'expo-notifications';
import  Posts from '../Posts'
import HomeNavigator from './HomeNavigator'
import AuthContext from '@/app/Auth/Context';
import HomeApi from '@/app/api/HomeApi';
const InAppNavigator = () => {

  let session = useContext(AuthContext);






async function updateStatus(data,bool){
  if(bool == true){
    data.setStatus=1;
  }else{
    data.setStatus=2;
  }
  let res = await HomeApi.UpdateStatus(data);
  if(res.ok){
    console.log(res.data);
  }else{
    console.log('not ok');
  }
}



   //detect if app is closed or opened
   const appState = useRef(AppState.currentState);
   const [appStateVisible, setAppStateVisible] = useState(appState.current);
   let data = {Token : session.user.Token};
   useEffect(() => {
     const subscription = AppState.addEventListener("change", nextAppState => {
       if (appState.current.match(/inactive|background/) && nextAppState === "active") {
         console.log("App has come to the foreground!");
         // update user status to online
         updateStatus(data,true)

       } else if (nextAppState.match(/inactive|background/)) {
         console.log("App has gone to the background or closed!");
         // update user status to offline
         updateStatus(data,false)

       }
 
       appState.current = nextAppState;
       setAppStateVisible(appState.current);
       console.log("OYOYOYO : AppState", appState.current);
     });
 
     return () => {
       subscription.remove();
     };
   }, []);

  // const responseListener = useRef();
  // const notificationListener = useRef();

  // React.useEffect(() => {
  //   console.log("InAppNavigator Mounted");
  //   const subscription = Notifications.addNotificationReceivedListener(notification => {
      
  //     Notifications.setNotificationHandler({
       
  //       handleNotification: async () => ({
  //         shouldShowAlert: false,
  //         shouldPlaySound: false,
  //         shouldSetBadge: false,
  //       }),
  //     });
      
  //     console.log("Home :");
  //     console.log(notification);


  //   });
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log("Action Home :");
  //     console.log(response);
  //   });

  //   return () => {
  //     console.log("InAppNavigator Unmounted");
  //     if (notificationListener.current) {
  //       Notifications.removeNotificationSubscription(notificationListener.current);
  //     }
  //     if (responseListener.current) {
  //       Notifications.removeNotificationSubscription(responseListener.current);
  //     }
  //   };
  // }, []);

  return (
    <Tabs.Navigator screenOptions={{headerShown:false}} initialRouteName='Home' >
       <Tabs.Screen name="posts" options={{
          unmountOnBlur: true, 
        }} 
        component={Posts}/>   
    <Tabs.Screen options={{ unmountOnBlur:true }} name="Home" component={HomeNavigator} 
    
    />    
    <Tabs.Screen name="Settings" 
        options={{
          unmountOnBlur: true,
                                 // This will unmount the tab screen when you navigate away from it
        }}                     //mele5er this will unmount the settingsstacks from the stack tkoul alih memchitelhech which will create the desired effect
       component={SettingsStacks}/>
    </Tabs.Navigator> 
  )
}

export default InAppNavigator

const styles = StyleSheet.create({})