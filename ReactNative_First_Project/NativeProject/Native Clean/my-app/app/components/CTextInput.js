import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types';

import {MaterialCommunityIcons} from '@expo/vector-icons'
import colors from '../config/colors'
import AntDesign from '@expo/vector-icons/AntDesign';


/**
 * @typedef {Object} CTextInputProps
 * @property {string} [iconname]
 * @property {string} [Iconcolor]
 * @property {number} [IconSize]
 * @property {string} [placeholder]
 * @property {string} [keyboard]
* @property {number} [maxL]
* @property {(text: string) => void} [onChangeTextP]
* @property {() => void} [onBlur]
 * @property {any} [otherprops]
*/
/**
 * @param {CTextInputProps} props
 */

export default function CTextInput({iconname  = undefined,Iconcolor='red',IconSize=30,placeholder='',keyboard='',maxL=30,onChangeTextP,onBlur , ...otherprops}) {
  return (
    <View style={styles.container}>
       { iconname && <AntDesign name={iconname} color={Iconcolor} size={IconSize}/>}
        <TextInput onBlur={onBlur} onChangeText={onChangeTextP} maxLength={maxL} keyboardType={keyboard} style={styles.textin} placeholder={placeholder} {...otherprops} ></TextInput>
    </View>
  )
}

// CTextInput.propTypes = { //npm install prop-types
//     iconname: PropTypes.string,
//     Iconcolor: PropTypes.string,
//     IconSize: PropTypes.number,
//     placeholder: PropTypes.string,
//   };

const styles = StyleSheet.create({
    container:{
        backgroundColor : colors.lightGray,
        borderRadius: 25,
        flexDirection : "row",
        width: "100%",
        padding: 10,
        marginVertical : 10
    },
    textin:{
        fontSize: 19,
        fontFamily : "Roboto",
        width : "100%",
        paddingLeft: 10
    }
})