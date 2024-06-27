import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

import colors from '../config/colors'


export default function CButton({Content,onPress,TextStyle='',TextColor='secondary',TouchableOpacityStyle='',ContainerColor='primary'}) {
  return (
    <TouchableOpacity style={[styles.CButton,TouchableOpacityStyle, {backgroundColor : colors[ContainerColor]}]} onPress={onPress}>
      <Text style={[styles.TextS,TextStyle,{backgroundColor: colors[TextColor]}]}>{Content}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    CButton:{
        backgroundColor: 'tomato',
        borderRadius : 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding : 15,
        width :"100%",
        marginVertical : 10
    },
    TextS:{
        justifyContent:'center',
        alignItems:'center',
        fontSize:18,
        textTransform: 'uppercase',
        fontWeight : 'bold',
        color: 'white',
        
    }
})