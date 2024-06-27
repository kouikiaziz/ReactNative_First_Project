import { View, Text } from 'react-native'
import React from 'react'

export default function Error({errormsg}) {
    if(!errormsg){
        return null;
    }
  return (
    <Text style={{color:"red" , fontSize:15 , fontWeight: 500}}>{errormsg}</Text>
  )
}