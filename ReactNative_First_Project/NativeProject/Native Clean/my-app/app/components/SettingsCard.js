import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import colors from '../config/colors'
import { FontAwesome } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons


const SettingsCard = ({ Title,  Subtitle,uri_u=null,Online ,onP,...otherprops}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable} onPress={onP} {...otherprops} >
      
      <View style={styles.imageContainer}>

      <Image style={styles.image} source={{ uri: uri_u != null ? uri_u : 'https://via.placeholder.com/100' }} />       
      {Online==true && (
            <View style={styles.onlineIndicator}>
              <FontAwesome name="circle" size={14} color="green" />
            </View>
          )}
        </View>
       
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
  imageContainer: {
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 18,
    width: 18,
    borderRadius: 9,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
