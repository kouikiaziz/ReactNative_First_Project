import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'

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
const InAppNavigator = () => {

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