import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import {  } from 'react-native-gesture-handler'


import CText from '../components/CText'

export default function CPickerItem({label,onPressEvent}) {
  return (
   <TouchableOpacity onPress={onPressEvent}>
      <CText customStyle={styles.texts}>{label}</CText>
   </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    texts:{
        padding:20
    }
})