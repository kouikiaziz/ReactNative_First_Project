import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import colors from '../config/colors'

const SettingsCard = ({ Title,  Subtitle,uri_u=null ,onP,...otherprops}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable} onPress={onP} {...otherprops} >
      <Image style={styles.image} source={{ uri: uri_u != null ? uri_u : 'https://via.placeholder.com/100' }} />       
       <View style={styles.textContainer}>
          <Text style={styles.text1}>{Title}</Text>
          {Subtitle && <Text style={styles.text2}>{Subtitle}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default SettingsCard

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#E1E1E1',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 50, // Optional: make the image circular
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  text1: {
    color: '#00796b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text2: {
    color: '#007bb5',
  },
})
