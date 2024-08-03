import { AppState, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loginscreen from '../Loginscreen';
import Login from '../Login';
import RecoverAccont from '../RecoverAccont';
import ResetPassword from '../ResetPassword';
import * as Notifications from 'expo-notifications';
import Home from '../Home'
import InsideChat from '../InsideChat'
import ChatContext from '../../Auth/ChatContext'
const Stack = createNativeStackNavigator();







const HomeNavigator = () => {



     





















  const [datachats,setdata]= useState([]);
  return (
    <>
    <ChatContext.Provider value={{datachats,setdata}}> 
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='HomeMain' >
        <Stack.Screen name="HomeMain" component={Home}/>
        <Stack.Screen name="InsideChat" component={InsideChat}/>       
    </Stack.Navigator> 
    </ChatContext.Provider>
    </>
  )
}

export default HomeNavigator

const styles = StyleSheet.create({})