import { View, Text,TouchableOpacity,Image,FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {  } from 'react-native-gesture-handler'
import CIcon from '../components/CIcon'
import colors from '../config/colors'
import * as ImagePicker  from 'expo-image-picker'
import ImagesSelector from '../components/ImagesSelector'


export default function exercice() {
    
  return (
    <SafeAreaView style={{flex:1,alignContent:'center',justifyContent:'center'}}>
        <ImagesSelector></ImagesSelector>
    </SafeAreaView>
  )
}