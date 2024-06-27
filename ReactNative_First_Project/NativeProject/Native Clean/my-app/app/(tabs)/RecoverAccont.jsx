import { View, Text,TouchableOpacity, Alert, Modal,StyleSheet,TouchableWithoutFeedback } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CGradiantButton from '../components/CGradiantButton'
import CButton from '../components/CButton'
import CTextInput from '../components/CTextInput'
import colors from '../config/colors'
import {  } from 'react-native-gesture-handler'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'
import {Formik} from 'formik';
import * as Yup from 'yup';
import Error
 from '../components/Error'
import AuthStorage from '../Auth/storage'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import Auth from '../api/Auth'
import AuthContext from '../Auth/Context'



const validationScheme = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .label('Email'),
})
function RequestCodeVerification(code){
  console.log(code);
}




// '#8A00D4', '#FF3CAC'
const RecoverAccont = ({navigation}) => {
    // const navigation = useNavigation();
    const [isModalEnabled,setIsModalEnabled] = useState(false);
    const [email,setEmail] = useState('');
    const [code,setCode] = useState('');
    const [Codenot5,setCodenot5] = useState(null);
    const authConext = useContext(AuthContext);
 async function recoverme(data){
  console.log(data);
  setEmail(data.email);
 let res = await Auth.Recover(data);
 if(res.ok){
    console.log('ok');
    Alert.alert('Notification','You Should Recieve an Email Containing A Recovery Code',[
      {
        text:'Continue',
        onPress:()=>{setIsModalEnabled(true)}
      }
    ])
 }else{
  console.log(res.data);
 }
 }

 async function Verify(){
if(code.length==5){
  const data = {
    email: email, // Replace with your actual email
    code: code,
  };
 let res = await Auth.VerifRecoveryCode(data);

  if(res.ok){
  console.log(res.data);
  // authConext.setUser(res.data); // warning will be fixed once i implement the stack ig
  
  navigation.navigate('ResetPassword',{ myuser: res.data});
  }else{
console.log('not ok');
Alert.alert('Notification','Something Went Wrong',[
  {
    text:'Continue',
    onPress:()=>{}
  }
])
  }
}else{
  setCodenot5(true);
}
 }
  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{flex:1 , alignItems:'center',justifyContent:'center'}}>
      <Formik initialValues={{email:''}}
         onSubmit={recoverme}
         validationSchema={validationScheme}
         >
          {({handleChange,handleSubmit,setFieldTouched,touched,errors})=>(
            <>
            <CTextInput onBlur={()=>setFieldTouched("email")} keyboard='email-address' iconname='mail' Iconcolor='purple' placeholder='Email' onChangeTextP={handleChange('email')} ></CTextInput>
            {touched.email && <Error errormsg={errors.email}></Error>}
            <CGradiantButton  onPressB={handleSubmit} colorStart={"#8A00D4"} content={'Recover Account'} colorEnd={"#FF3CAC"}  ></CGradiantButton>
            </>
          )}
        </Formik>
        </View>
        {/* <View style={{flex:1 , alignItems:'center',justifyContent:'center'}}>
            
            <CTextInput keyboard='email-address' IconSize={30} Iconcolor={'purple'} iconname='user' placeholder='Email' onChangeTextP={()=>{}}></CTextInput>
            <CGradiantButton colorStart={'#FF3CAC'} colorEnd={'#8A00D4'} onPressB={recoverme} content={'Send Recovery Code'}/>
        </View> */}
        <Modal visible={isModalEnabled} animationType='slide'>
        {/* //closeButton */}
        <View style={{width:30,height:30,alignItems:'flex-end',alignSelf:'flex-end'}}>
            <TouchableOpacity onPress={()=> {setIsModalEnabled(false);}} style={{backgroundColor:colors.lightGray ,borderRadius: 30,width:'100%',height:'100%'}}>
            <MaterialCommunityIcons name='close' color='black' size={30}></MaterialCommunityIcons>
            </TouchableOpacity>
          </View >
         <View style={styles.ModalContainer}>
          <CTextInput  onChangeTextP={(c)=>{setCode(c);
            
            if(Codenot5!= null){
              setCodenot5(true);
            }
            if(c.length ==5){
              setCodenot5(false);
              
            }  
            
          }} maxL={5}></CTextInput>
          <CGradiantButton 
          isdisabled={true} onPressB={Verify} colorStart={"#8A00D4"} content={'Verify'} colorEnd={"#FF3CAC"}  ></CGradiantButton>
          { Codenot5 && <Error errormsg={"Code must be 5"}></Error>}
          <Text>Didn't Recieve Recovery Code? <TouchableWithoutFeedback onPress={()=>{recoverme({ email: email })}}>
              <Text style={{color:'blue'}}>Resend</Text>
            </TouchableWithoutFeedback></Text>
                    </View>
         
        </Modal>
    </SafeAreaView>
  )
}


export default RecoverAccont

const styles = StyleSheet.create({
  ModalContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});