import { View, Text,StyleSheet,Image ,TouchableHighlight} from 'react-native'
import React from 'react'
import CText from './CText'
import colors from '../config/colors'
import { Swipeable } from 'react-native-gesture-handler'
export default function CCard({title,subtite,ShortDescription,img=undefined,onPress}) {
  return (
    
<TouchableHighlight onPress={onPress} style={styles.TO}  underlayColor={colors.lightGray}>
    <View style={styles.card}>
      {img && <Image source={img} style={styles.img}></Image>}
      <View style={styles.paddings}>
      <CText customStyle={styles.titlestyle}>{title}</CText>
      <CText customStyle={styles.subtite}>{subtite}</CText>
      {ShortDescription && <CText customStyle={styles.description}>{ShortDescription}</CText>}
      </View>
      </View>
      </TouchableHighlight>

  )
}

const styles = StyleSheet.create({
    card:{
        width:"100%",
        borderRadius:15,
        backgroundColor: '#fff',
        overflow : 'hidden',
        marginBottom: 15
        // alignItems : 'center',
        // justifyContent : 'center'
    },
    TO:{
        width:"100%",
        borderRadius:15,
        // backgroundColor: '#fff',
        overflow : 'hidden',
        marginBottom: 15
        // alignItems : 'center',
        // justifyContent : 'center'
    },

   img:{
    width:"100%",
    height: 200,
    
   },
   subtite:{
    color:"green",
    fontSize:20,
    paddingBottom:15,
    fontWeight : 'bold'
   },
   description:{
        color:"#A9A9A9",
        fontSize:15
   },
   paddings:{
    padding: 20
   },
   titlestyle:{
    paddingBottom:5
   }
   

})