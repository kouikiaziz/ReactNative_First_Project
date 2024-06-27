import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loginscreen from '../Loginscreen';
import Login from '../Login';
import RecoverAccont from '../RecoverAccont';
import ResetPassword from '../ResetPassword';
import * as Notifications from 'expo-notifications';
import Home from '../Home'
import InsideChat from '../InsideChat'
const Stack = createNativeStackNavigator();







const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='HomeMain' >
        <Stack.Screen name="HomeMain" component={Home}/>
        <Stack.Screen name="InsideChat" component={InsideChat}/>

    </Stack.Navigator> 
  )
}

export default HomeNavigator

const styles = StyleSheet.create({})