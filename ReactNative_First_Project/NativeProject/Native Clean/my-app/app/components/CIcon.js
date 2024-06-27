import { View, Text } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'
export default function CIcon({name='none',size=30,color='black'}) {
  return (
    <MaterialCommunityIcons name={name} size={size} color={color}></MaterialCommunityIcons>
  )
}