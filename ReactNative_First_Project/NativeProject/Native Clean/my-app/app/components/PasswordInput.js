import { StyleSheet, Text, TextInput, View,TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import PropTypes, { bool } from 'prop-types';

import {MaterialCommunityIcons} from '@expo/vector-icons'
import colors from '../config/colors'
import AntDesign from '@expo/vector-icons/AntDesign';
import {  } from 'react-native-gesture-handler';
import { Entypo } from '@expo/vector-icons';

/**
 * @typedef {Object} CTextInputProps
 * @property {string} [iconnameysar]
 * @property {string} [Iconcolor]
 * @property {number} [IconSize]
 * @property {string} [placeholder]
 * @property {string} [keyboard]
 *  @property {string} [IconNameEyeColor]
 *  @property {string} [iconNameEyeHidden]
 *  @property {string} [iconNameEyeShown]
* @property {number} [maxL]
* @property {(text: string) => void} [onChangeTextP]
* @property {() => void} [onBlur]
 * @property {any} [otherprops]

*/
/**
 * @param {CTextInputProps} props
 */

export default function PasswordInput({ iconnameysar  = 'key',iconNameEyeShown = 'eye',iconNameEyeHidden = 'eye-with-line',IconNameEyeColor='red',Iconcolor='red',IconSize=30,placeholder='',keyboard='',onChangeTextP,onBlur , ...otherprops}) {
 const [Hidepassword , setHidepassword] = useState(true);
 const togglePasswordVisibility = () => {
    setHidepassword(!Hidepassword);
};
    return (
    <View style={styles.container}>
       { iconnameysar && <Entypo name={iconnameysar} color={Iconcolor} size={IconSize}/>}
        <TextInput onBlur={onBlur} secureTextEntry={Hidepassword}  onChangeText={onChangeTextP}  keyboardType={keyboard} style={styles.textin} placeholder={placeholder} {...otherprops} ></TextInput>
     
     
       <TouchableOpacity onPress={togglePasswordVisibility}>
       {  <Entypo name={Hidepassword ? iconNameEyeHidden : iconNameEyeShown} color={IconNameEyeColor} size={IconSize}/>}
       </TouchableOpacity>

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
        paddingLeft: 10,
        flex:1
    }
})