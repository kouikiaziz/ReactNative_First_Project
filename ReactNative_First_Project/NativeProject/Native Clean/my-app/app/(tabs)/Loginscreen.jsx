import {Alert, StyleSheet, Text, View,Image,TextInput, Touchable, TouchableOpacity, Modal, Button,ScrollView,TouchableWithoutFeedback, BackHandler } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import Screen from '../components/Screen'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../config/colors'
import CText from '../components/CText'
import {  } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient';
import CButton from '../components/CButton'
import CTextInput from '../components/CTextInput'
import PasswordInput from '../components/PasswordInput'
import { Link, useFocusEffect, useNavigation } from 'expo-router'
import {Formik} from 'formik';
import * as Yup from 'yup';

import Error from '../components/Error'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Auth from '../api/Auth'
import AuthStroage from '../Auth/storage'
import ImagesSelector from '../components/ImagesSelector'

{/* <Formik initialValues={{username:'',email:'',phone:'',password:'',cpassword:''}} */}
import PToken from '../config/PhoneTokenExtractor'


import AuthContext from '../Auth/Context'
import storage from '../Auth/storage'
const validationScheme = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .label('Email'),
  username: Yup.string()
    .required('Username is required')
    .label('Username'),
    phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Phone number must only contain digits')
    .length(8, 'Phone number must be exactly 8 digits')
    .label('Phone'),
    password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .label('Password'),
  cpassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .label('Confirm Password')
})


const Loginscreen = ({navigation}) => {

  const [IsModelOpen,setIsModelOpen] = useState(false);
  const [ErrorOnRegister,setErrorOnRegister] = useState(false);
  const [readimages,AppendReadimages] = useState([]);
  const [Token,setToken] = useState();
  async function HandleRestorationToken(){
    return await storage.getStoredToken();
  }
  useEffect(()=>{
    setToken(HandleRestorationToken());
  },[]);
  
  

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (IsModelOpen) {
          setIsModelOpen(false);
          console.log('what?');
          return true;
        }
        Alert.alert('Notification', "You're Leaving the Application Are you sure you want to continue?", [
          {
            text: 'Yes',
            onPress: () => BackHandler.exitApp()
          },
          {
            text: 'No',
            onPress: () => {},
            style: 'cancel'
          }
        ]);
        return true; // Prevent default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    },[IsModelOpen])
  );
let session = useContext(AuthContext);

   async function Register(v){
    
    if(readimages != []){
      v.image = readimages[0];
    }
    if(Token._j)
    v.Device_Token =Token._j;

    console.log(v);
   let res = await Auth.Register2(v);
   if(res.ok){
    console.log('Registred');
    setErrorOnRegister(false);
    console.log(res.data);
    session.setUser(res.data); 
    AuthStroage.StoreUser(JSON.stringify(res.data));
    navigation.navigate('Home');
   }else{
    if( res.problem==="HTTP_SERVICE_UNAVIALABLE"){
      console.log(res.problem);
    }else if(res.problem === "SERVER_ERROR"){
      console.log(res.problem);
    }else{
      setErrorOnRegister(true);
      console.log(res.data);
      console.log(res.problem);
    }  
   }
  }


  return (
    // <SafeAreaView style={styles.container}>
   
      <View style={styles.container} >
        <Image resizeMode='contain'  style={styles.logo} source={require("../assests/Loginpage/logo.png")}></Image>
        <LinearGradient
        colors={['#8A00D4', '#FF3CAC']}
        
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }} style={styles.lineargradiant}
      >
        <TouchableOpacity style={styles.getstartedbutton} onPress={()=>setIsModelOpen(!IsModelOpen)}>
          <View >
        <Text style={styles.getstartedtext}>Let's Get Started!</Text>
          </View>
        </TouchableOpacity>
        </LinearGradient>
        <Text style={styles.TextunderCreateAccount} >Already Have An Account? 
          {/* <Link  style={styles.loginlink}  href='/Login'>Login</Link> Instead.</Text> */}
          <TouchableWithoutFeedback onPress={()=>{navigation.navigate('Login')}}><Text style={{color:'blue'}}> Login</Text></TouchableWithoutFeedback>
          </Text>
        <Modal visible={IsModelOpen} animationType='slide' >
        <View style={{flex:1}}>
          
          <ScrollView  style={{marginHorizontal: 20,marginBottom:10}} contentContainerStyle={{ flexGrow: 1}}>
          <View style={{width:30,height:30,alignItems:'flex-end',alignSelf:'flex-end'}}>
            <TouchableOpacity onPress={()=> {setIsModelOpen(false);setErrorOnRegister(false);AppendReadimages([])}} style={{backgroundColor:colors.lightGray ,borderRadius: 30,width:'100%',height:'100%'}}>
            <MaterialCommunityIcons name='close' color='black' size={30}></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>

          <View style={styles.insidemodelcontainer}>
          <Image    style={styles.logoModel}source={require('../assests/Loginpage/LogoBelrasmi.png')}></Image>
          <Formik initialValues={{username:'',email:'',phone:'',password:'',cpassword:''}}
          onSubmit={Register}
          validationSchema={validationScheme}
          > 
          {({handleChange,handleSubmit,errors,setFieldTouched,touched})=>(
            <React.Fragment>
           
            <CTextInput onBlur={()=>setFieldTouched("username")}  iconname='user' Iconcolor='purple' placeholder='UserName' onChangeTextP={handleChange("username")}></CTextInput>
           { touched.username && <Error errormsg={errors.username}></Error>}
          
          <CTextInput onBlur={()=>setFieldTouched("email")} keyboard='email-address' iconname='mail' Iconcolor='purple' placeholder='Email' onChangeTextP={handleChange("email")} ></CTextInput>
          { touched.email &&<Error errormsg={errors.email}></Error>}

          <CTextInput onBlur={()=>setFieldTouched("phone")}  placeholder='PhoneNumber' iconname={'phone'} Iconcolor='purple' keyboard='numeric' maxL={8} onChangeTextP={handleChange("phone")} ></CTextInput>
          { touched.phone && <Error errormsg={errors.phone}></Error>}

          <PasswordInput onBlur={()=>setFieldTouched("password")}  placeholder='Password' iconNameEyeHidden='eye-with-line'  iconnameysar={'key'} Iconcolor='purple'  IconNameEyeColor='purple' onChangeTextP={handleChange("password")} ></PasswordInput>
          { touched.password &&<Error errormsg={errors.password}></Error>}

          <PasswordInput  onBlur={()=>setFieldTouched("cpassword")} placeholder='Confirm Password' iconNameEyeHidden='eye-with-line'  iconnameysar={'key'} Iconcolor='purple'  IconNameEyeColor='purple' onChangeTextP={handleChange("cpassword")} ></PasswordInput>
          { touched.cpassword &&<Error errormsg={errors.cpassword}></Error>}

          {/* <CButton Content={'GO BACK'} TextColor='White' onPress={()=>setIsModelOpen(false)} ></CButton> */}
          <LinearGradient
        colors={['#8A00D4', '#FF3CAC']}
        
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }} style={styles.lineargradiantModal}
      >
        <TouchableOpacity style={styles.getstartedbutton} onPress={()=>handleSubmit()}>
          <View >
        <Text style={styles.CreateAccount}>Create Account</Text>
          </View>
        </TouchableOpacity>
        </LinearGradient>
          
            <ImagesSelector AppendReadimages={AppendReadimages} readimages={readimages}></ImagesSelector>
            
        <Text style={styles.TextunderCreateAccount} >Already Have An Account? <Link onPress={()=>setIsModelOpen(!IsModelOpen)}style={styles.loginlink}  href='/Login'>Login</Link> Instead.</Text>

        { ErrorOnRegister && <Error errormsg={'User Already Registred!'}></Error>}
       
            </React.Fragment>
          )}
          </Formik>
        </View>
        </ScrollView>
        </View>
        </Modal>
        </View>
      // </SafeAreaView>
  )
}

export default Loginscreen

const styles = StyleSheet.create({
  container:{
    backgroundColor:colors.white,
    flex:1,
    justifyContent:'center',
    alignItems :'center',
    
  },
  logo: {
    width: '100%',
    height: 500,
    aspectRatio: 1,
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

