import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient' //npm install expo-linear-gradient
import colors
 from '../config/colors'

export default  function CGradiantButton({colorStart,colorEnd,content,onPressB,isDisabled=false}) {
  return (
    <LinearGradient 
        colors={[colorStart,colorEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }} style={styles.lineargradiant}
      >
        <TouchableOpacity disabled={isDisabled} style={styles.getstartedbutton} onPress={onPressB} >
          <View >
        <Text   style={styles.getstartedtext}>{content}</Text>
          </View>
         
        </TouchableOpacity>
        </LinearGradient>
  )
}


const styles = StyleSheet.create({
    getstartedbutton:{
      borderRadius : 25,
      width : '100%',
      height : 50,
      alignItems: 'center',
      justifyContent: 'center',
    }
    ,
    lineargradiant:{
        width:'60%',
        borderRadius:25,
    },
    getstartedtext:{
      color : colors.white,
      fontSize : 18
    },
  })