import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import CTextInput from '../components/CTextInput'
import PasswordInput from '../components/PasswordInput'
import colors from '../config/colors'
import {Formik} from 'formik';
import * as Yup from 'yup';
import Error from '../components/Error'


import { LinearGradient } from 'expo-linear-gradient'
import Auth from '../api/Auth'
import AuthContext from '../Auth/Context'
import storage from '../Auth/storage'

const validationScheme = Yup.object().shape({
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


import PToken from '../config/PhoneTokenExtractor'

const ResetPassword = ({navigation,route}) => {
  const authConext = useContext(AuthContext);
  const [Token,setToken] = useState();
  async function HandleRestorationToken(){
    return await storage.getStoredToken();
  }
  useEffect(()=>{
    setToken(HandleRestorationToken());
  },[]);
    async function ResetMe(v){
      
      if(Token._j){
        v.Device_Token = Token._j;
      }

        v.Token = route.params.myuser.Token;
    let res = await Auth.RequestPasswordChange(v);
    if(res.ok){
        let last = route.params.myuser;
        last.DeviceToken=Token._j;
        console.log(last);
        storage.StoreUser(JSON.stringify(last));
        authConext.setUser(last);
    }else{
        console.log(res.data);
    }
    }
   
  return (
    <View>
    <Formik initialValues={{password:'',cpassword:''}}
          onSubmit={ResetMe}
          validationSchema={validationScheme}
          > 
          {({handleChange,handleSubmit,errors,setFieldTouched,touched})=>(
            <React.Fragment>

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
        <Text style={styles.CreateAccount}>Reset Password</Text>
          </View>
        </TouchableOpacity>
        </LinearGradient>

            </React.Fragment>
          )}
          </Formik>
    
    </View>
)
}

export default ResetPassword

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