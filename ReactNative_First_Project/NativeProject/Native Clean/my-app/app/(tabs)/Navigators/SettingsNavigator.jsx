import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loginscreen from '../Loginscreen';
import Login from '../Login';
import RecoverAccont from '../RecoverAccont';
import ResetPassword from '../ResetPassword';
import Home from '../Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from '../Settings'
import ModifyProfile from '../ModifyProfile'
import Logs from '../Logs'
const Stack = createNativeStackNavigator();
const SettingsStacks = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}  initialRouteName='SettingsMain'>
       <Stack.Screen name="ModifyProfile" component={ModifyProfile}/>   
       <Stack.Screen name="SettingsMain" component={Settings}/>   
        <Stack.Screen  name="Logs" component={Logs}/>    
    </Stack.Navigator> 
  )
}

export default SettingsStacks

const styles = StyleSheet.create({})