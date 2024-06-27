import { StyleSheet, Text, View,TouchableOpacity,TouchableWithoutFeedback } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CTextInput from '../components/CTextInput'
import PasswordInput from '../components/PasswordInput'
import { LinearGradient } from 'expo-linear-gradient'
import {  } from 'react-native-gesture-handler'
import colors from '../config/colors'


import CGradiantButton from '../components/CGradiantButton'
import { Link } from 'expo-router'
import {Formik} from 'formik';
import * as Yup from 'yup';
import Error from '../components/Error'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Auth from '../api/Auth'
import AuthContext from '../Auth/Context'

import AuthStroage from '../Auth/storage'
import PToken from '../config/PhoneTokenExtractor'
import storage from '../Auth/storage'

const validationScheme = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .label('Email'),
  password: Yup.string().required('Password is Required')
})


const Login = ({navigation}) => {

  const [ErrorOnLogin,setErrorOnLogin] = useState(false);
  let session = useContext(AuthContext);

  const [Token,setToken] = useState();
  async function HandleRestorationToken(){
    return await storage.getStoredToken();
  }
  useEffect(()=>{
    setToken(HandleRestorationToken());
  },[]);

  async function LogmeIn(v){
    if(Token._j){
      v.Device_Token = Token._j;
    }
    const res = await Auth.Login(v);
    if(res.ok){
      console.log(res.data);
      
      setErrorOnLogin(false);
      AuthStroage.StoreUser(JSON.stringify(res.data));
      session.setUser(res.data); // warning will be fixed once i implement the stack ig

      // navigation.navigate('Home');
    }else{
     if( res.problem==="HTTP_SERVICE_UNAVIALABLE"){
       console.log(res.problem);
     }else if(res.problem === "SERVER_ERROR"){
       console.log(res.problem);
     }else{
       setErrorOnLogin(true);
       console.log(res.data);
       console.log(res.problem);
     }  
    }
   }
   
  return (
    
    <SafeAreaView  style={styles.container} >
            
        <Formik initialValues={{email:'',password:''}}
         onSubmit={LogmeIn}
         validationSchema={validationScheme}
         >
          
          {({handleChange,handleSubmit,setFieldTouched,touched,errors})=>(
            <>
            <CTextInput onBlur={()=>setFieldTouched("email")} keyboard='email-address' iconname='mail' Iconcolor='purple' placeholder='Email' onChangeTextP={handleChange('email')} ></CTextInput>
            {touched.email && <Error errormsg={errors.email}></Error>}
            <PasswordInput  onBlur={()=>setFieldTouched("password")} placeholder='Password' iconNameEyeHidden='eye-with-line'  iconnameysar={'key'} Iconcolor='purple'  IconNameEyeColor='purple' onChangeTextP={handleChange('password')} ></PasswordInput>
            {touched.password && <Error errormsg={errors.password}></Error>}
            <CGradiantButton onPressB={()=>handleSubmit()} colorStart={"#8A00D4"} content={'Login'} colorEnd={"#FF3CAC"}  ></CGradiantButton>
            {ErrorOnLogin && <Error errormsg={'Wrong Email And/Or Password'}></Error>}
            </>
          )}
            
           
        
        </Formik>

        <Text style={{marginTop:15}}>Can't Login ? 
        <TouchableWithoutFeedback onPress={()=>{navigation.navigate('RecoverAccount')}}><Text style={{color:'blue'}}> Recover Account</Text></TouchableWithoutFeedback>
        </Text>

       
         
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
    container:{
      backgroundColor:colors.white,
      flex:1,
      justifyContent:'center',
      alignItems :'center'
    },
    
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
    lineargradiantModal:{
      width:'50%',
      borderRadius:25,
      justifyContent:'center',
      alignItems:'center',
      marginTop : 10,
  },
  insidemodelcontainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  CreateAccount:{
    color : colors.white,
      fontSize : 18,
  },
  logoModel:{
    height:"25%",
    width : "25%"
  },
  loginlink:{
    marginTop:10,
    color : 'blue'
  },
  TextunderCreateAccount:{
    marginTop:10,
  }
  })


//   <LinearGradient
//   colors={['#8A00D4', '#FF3CAC']}
  
//   start={{ x: 0, y: 0 }}
//   end={{ x: 1, y: 0 }} style={styles.lineargradiant}
// >
//   <TouchableOpacity style={styles.getstartedbutton} onPress={()=>console.log('hi')}>
//     <View >
//   <Text style={styles.getstartedtext}>Login</Text>
//     </View>
   
//   </TouchableOpacity>
//   </LinearGradient>