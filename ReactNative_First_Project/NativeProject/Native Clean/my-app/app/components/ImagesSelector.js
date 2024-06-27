import { View, Text,TouchableOpacity,Image,FlatList,Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {  } from 'react-native-gesture-handler'
import CIcon from './CIcon'
import colors from '../config/colors'
import * as ImagePicker  from 'expo-image-picker'

// const [readimages,AppendReadimages] = useState(['']);

export default function ImagesSelector({readimages,AppendReadimages,imgchanged}) {

  async function RPermission(){
    let result = await ImagePicker.requestCameraPermissionsAsync();
    if(result.granted){
         Alert.alert('Access Granted To Camera');
    }else{
        Alert.alert('Access Denied');
    }
}

  async function OpenCamera(){
    try{
        const result = await ImagePicker.launchCameraAsync();
        if(result.assets!=null){
            setDefualtURI(result.assets[0].uri);
        }
    }catch(error){
        console.log('Camera coudlnt Open : '+error);
    }
}

  useEffect(() => {
    (async () => {
            const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!res.granted) {
                Alert.alert('Permission Required', 'Please grant permission to access the photo library.');
            }else{
              console.log('granted access to media');
            }
        
    })();
}, []);

// const [readimages,AppendReadimages] = useState(['']);

    async function SelectImage(){
        try{
          const result =  await ImagePicker.launchImageLibraryAsync();
          
           console.log(result);
          if(result.assets!=null && !result.canceled){
            // AppendReadimages.append(result.assets[0].uri);
            //AppendReadimages((prevImages) => [...prevImages, result.assets[0].uri]);
            AppendReadimages(() => [result.assets[0].uri]);
            imgchanged(true);
          }
        }catch{
            console.log('Error while trying to select Image');
        }
        }
        function deleteImageURI(item){
            AppendReadimages(readimages.filter((obj) => obj != item))
            setDeleteUiState(false);
            imgchanged(true);
        }
        const [DeleteUi, setDeleteUiState] = useState(false);
function EnableDeleteUI(){
    setDeleteUiState(!DeleteUi);
}
  return (
    <SafeAreaView style={{alignContent:'center',justifyContent:'center'}}>
        {/* // START MULTIPLE IMAGE SELECTOR */}
        <View style={{alignContent:'center',justifyContent:'center',flexDirection: 'row'}}>
            
            <TouchableOpacity onPress={SelectImage} style={{backgroundColor:colors.lightGray , padding:5,borderRadius: 10,alignSelf: 'center'}}>
                <CIcon name='camera' color='gray' size={90}></CIcon>
            </TouchableOpacity>
            <FlatList
            keyExtractor={(obj)=>obj}
            data={readimages}
            renderItem={({item})=>{
                if(item!= null && item!=''){
                
                return <>
                <TouchableOpacity onLongPress={()=>{EnableDeleteUI()}}>
                <Image source={{uri:item}} style={{ width: 100, height: 100, margin: 5 }}></Image>
                
                {DeleteUi && <TouchableOpacity onPress={()=>deleteImageURI(item)}style={{backgroundColor:colors.darkGray , padding:5,borderRadius: 10,alignSelf: 'center'}} ><CIcon name='close'color='black' size={10}></CIcon></TouchableOpacity>}
                
                </TouchableOpacity>
                </>
                }
                return null;
            }
            }
            horizontal
            style={{ marginLeft: 10,marginRight:10 }}
            >
            </FlatList>
            
        </View>
        {/* // END MULTIPLE IMAGE SELECTOR */}

    </SafeAreaView>
  )
}