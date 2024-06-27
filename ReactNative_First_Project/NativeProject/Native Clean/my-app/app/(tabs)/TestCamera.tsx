import { View, Text, Alert, Button,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker  from 'expo-image-picker'
import * as Notifications from 'expo-notifications';

const TestCamera = () => {


   
    async function RPermission(){
        let result = await ImagePicker.requestCameraPermissionsAsync();
        if(result.granted){
             Alert.alert('Access Granted To Camera');
        }else{
            Alert.alert('Access Denied');
        }
    }
    
    const [testonchange,settestonchange] = useState(0);
    useEffect(()=>{
        RPermission();
    },[testonchange])
    const [defaultUri,setDefualtURI] = useState("");
   async function SelectImage(){
    try{
      const result =  await ImagePicker.launchImageLibraryAsync();
      console.log(result);
      if(result.assets!=null && !result.canceled){
        setDefualtURI(result.assets[0].uri);
      }
    }catch{
        console.log('Error while trying to select Image');
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
  return (
    <SafeAreaView style={{backgroundColor:'orange',flex:1}}>
        <View style={{backgroundColor:'yellow',flex:1,alignContent:'center',justifyContent:'center'}}>
        <Text >TEST PERMISSION</Text>
        

        <Button title='Click ME' onPress={SelectImage}/>
        <Button title='Open Camera' onPress={OpenCamera}/>
        {defaultUri && <Image style={{width:200,height:200}}source={{uri : defaultUri}}/>}
        </View>
    </SafeAreaView>
  )
}

export default TestCamera