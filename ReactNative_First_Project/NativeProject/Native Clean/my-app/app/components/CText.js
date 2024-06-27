import { Platform, StyleSheet, Text } from 'react-native'
import React from 'react'

export default function CText({children,customStyle=''}) {
  return (
      <Text style={[styles.MyText,customStyle]}>{children}</Text>
  )
}

const styles = StyleSheet.create({
    MyText:{
        fontSize : 18,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir'
    }
})