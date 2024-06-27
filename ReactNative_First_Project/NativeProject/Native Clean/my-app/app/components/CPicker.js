import { FlatList,View, Text,StyleSheet,TextInput, Touchable,TouchableWithoutFeedback, Modal, Button } from 'react-native'
import React, { useState } from 'react'

import colors from '../config/colors'
import AntDesign from '@expo/vector-icons/AntDesign';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {  } from 'react-native-gesture-handler';
import { func } from 'prop-types';
import CPickerItem from './CPickerItem'

let x = 0;
/**
 * @typedef {Object} Item
 * @property {string} label
 * @property {string | number} value
 */

/**
 * @typedef {Object} CTextInputProps
 * @property {string} [iconname]
 * @property {string} [Iconcolor]
 * @property {number} [IconSize]
 * @property {string} [placeholder]
 * @property {string} [keyboard]
* @property {number} [maxL]
* @property {(text: string) => void} [onChangeTextP]
* @property {string} [content]
* @property {Item[]} [items]
* @property {(item: Item) => void} [OnPressEventSearch]
*/
/**
 * @param {CTextInputProps} props
 */
 function CPicker({iconname  = undefined,Iconcolor='red',IconSize=30,placeholder='',keyboard='',maxL=30,onChangeTextP , content=undefined,items=[],OnPressEventSearch,...otherprops}) {
    const [btnstate , setbtnstate] = useState(false);
    function enableM(){
        setbtnstate(true);
    }
    function disableM(){
        setbtnstate(false);
    }
    return (
        <React.Fragment>
    <TouchableWithoutFeedback onPress={enableM}>
    <View style={styles.container}>
       { iconname && <MaterialCommunityIcons name={iconname} color={Iconcolor} size={IconSize}/>}
        <TextInput  editable={false} style={styles.textin} placeholder={placeholder}  ></TextInput>
       { iconname && <MaterialCommunityIcons name={'chevron-down'} color={Iconcolor} size={IconSize}/>}
    </View>
    </TouchableWithoutFeedback>
    <Modal visible={btnstate} animationType='slide'>
    <View style={styles.container}>
       { iconname && <MaterialCommunityIcons name={iconname} color={Iconcolor} size={IconSize}/>}
       <TextInput editable={true} onChangeText={onChangeTextP} maxLength={maxL} keyboardType={keyboard} style={styles.textin} placeholder={placeholder} {...otherprops}  >{content}</TextInput>
       { iconname && <MaterialCommunityIcons name={'chevron-down'} color={Iconcolor} size={IconSize}/>}
    </View>
    <FlatList
    keyExtractor={(item) => item.value.toString()}
    data={items}
    renderItem={({item}) => 
        <CPickerItem onPressEvent={() => { 
            OnPressEventSearch(item); 
            setbtnstate(false);
        }} label={item.label} />
    }
    ></FlatList>

    <Button title='Close' onPress={disableM}></Button>
    </Modal>
    </React.Fragment>
  );
}

export default CPicker

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
        flex:1,
        height:25
        
    }
})