import { Image, View, StyleSheet, ScrollView, Touchable,Text, Alert, Button,TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import CText from '../components/CText';
import CIcon from '../components/CIcon';
import CButton from '../components/CButton';
import CCard from '../components/CCard';
import colors from '../config/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import {  } from 'react-native-gesture-handler';
// npm install @react-navigation/elements
// npx expo install react-native-screens react-native-safe-area-context
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loginscreen from './Loginscreen';
import Login from './Login'
import RecoverAccont from './RecoverAccont';
import CActivityIndicator from '../components/CActivityIndicator';
import React, { useCallback, useEffect, useState } from 'react';
import AuthContext from '../Auth/Context'
import storage from '../Auth/storage';
import * as SplashScreen from 'expo-splash-screen';
import ResetPassword from './ResetPassword'
import Home from '../(tabs)/Home'
import AuthNavigator from './Navigators/authNavigator'
import InAppNavigator from './Navigators/InAppNavigator'
const Stack = createNativeStackNavigator();
import * as Notifications from 'expo-notifications';
import LottieView from 'lottie-react-native';
import PToken from '../config/PhoneTokenExtractor';
import HomeApi from '../api/HomeApi';

export default function index() {
  const [user,setUser] = useState(null);
  const [isAppReady,setIsAppReady] = useState(false);

  // Notifications.setNotificationHandler(null);Notifications.setNotificationHandler({
  
  async function handleUserRestoration(){
    let res = await storage.getStoredUser();
     
   
   if(!res) return;
   setUser(res);
   console.log('user restored from secure storage : ',res);
   if(res != null){
    updateStatus({Token:res.Token},true);
    console.log("user status updated");
  }
  }
 
  async function HandlePushToken(){
    let res = await storage.getStoredToken();
    if(res==null) {
      let Token = await PToken();
      await storage.StorePToken(Token);}
  }

  async function updateStatus(data,bool){
    if(bool == true){
      data.setStatus=1;
    }else{
      data.setStatus=2;
    }
    let res = await HomeApi.UpdateStatus(data);
    if(res.ok){
      console.log(res.data);
    }else{
      console.log('not ok');
    }
  }
  
  
  useEffect(() => {
    // console.log(PhoneTokenExtractor());
    async function prepare() {
      try {
        await HandlePushToken();
        await handleUserRestoration();
        // await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsAppReady(true);
  
      }

    }
    prepare();
    
  },[]
  )

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      
      await SplashScreen.hideAsync();
      
      
      
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return <View style={{flex: 1,
      justifyContent: 'center',
      alignItems: 'center'}}>
      <LottieView autoPlay loop    style={{width:200,height:200}}     source={require('./Loading.json')}    /><Text>LOADING</Text></View>;
  }

  

  return (
    <AuthContext.Provider value={{user,setUser}}>   
            {user==null ?<AuthNavigator/> : <InAppNavigator/>}
</AuthContext.Provider>

  );

}

const styles = StyleSheet.create({
  safe:{
backgroundColor:'orange',
flex : 1,
justifyContent:'center',
alignItems:'center'
  },
  Container: {
    flex: 1,
    backgroundColor:  colors.goodgray,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop : 125,
    padding:20,
    
    
  },
  
});




{/* <Link href='Login'>login</Link>
     <Link href='Loginscreen'>Loginscreen</Link>
     <Link href='TestCamera' >TestCamera</Link>
     <Link href= 'userinput'>uerInput</Link>
     <Link href='explore'>explore</Link>
     <Link href='exercice'>exercice</Link>
     <Link href='Navigation'>Navigation test</Link> 
     <CActivityIndicator visible={true}></CActivityIndicator> */}


{/* <Stack.Navigator initialRouteName="Welcome">
<Stack.Screen name="Welcome" component={Loginscreen}/>
<Stack.Screen name="Login" component={Login}/>
<Stack.Screen name="Account Recovery" component={RecoverAccont}/>
</Stack.Navigator> */}



 {/* <TouchableOpacity onPress={()=>{
        Alert.alert('test Alert','Alert Content',[
          {
            text:'Click me1',
            onPress: ()=> { console.log('You clicked click me1');}
          },
          {
            text:'Click me2',
            onPress: ()=>{console.log('You clicked on click me2')}
          }
        ])
      }} >
      <Text>test alert read answer</Text>
      </TouchableOpacity> */}