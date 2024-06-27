import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loginscreen from '../Loginscreen';
import Login from '../Login';
import RecoverAccont from '../RecoverAccont';
import ResetPassword from '../ResetPassword';
import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();







const authNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Welcome' >
    <Stack.Screen name="Welcome" component={Loginscreen}/>
    <Stack.Screen name="Login" component={Login}/>
    <Stack.Screen name="Account Recovery" component={RecoverAccont}/>
    <Stack.Screen name="RecoverAccount" component={RecoverAccont}/>
    <Stack.Screen name="ResetPassword" component={ResetPassword}/>
    </Stack.Navigator> 
  )
}

export default authNavigator

const styles = StyleSheet.create({})