import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const InsideChat = ({route}) => {
  return (
    <View>
      <Text>InsideChat</Text>
      <Text>{route.params.user.id}</Text>
    </View>
  )
}

export default InsideChat

const styles = StyleSheet.create({})