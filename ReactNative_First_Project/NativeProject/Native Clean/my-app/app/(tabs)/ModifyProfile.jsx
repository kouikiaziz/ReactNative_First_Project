import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import AuthContext from '../Auth/Context';
import ImagesSelector from '../components/ImagesSelector';
import CTextInput from '../components/CTextInput';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PasswordInput from '../components/PasswordInput';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import Error from '../components/Error';
import PostApi from '../api/PostApi';
import storage from '../Auth/storage';

const ModifyProfile = () => {
  const validationSchema = Yup.object().shape({
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
      .nullable()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .label('Password'),
    cpassword: Yup.string()
      .nullable()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .label('Confirm Password'),
    Oldpassword: Yup.string()
      .nullable()
      .min(8, 'Old Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Old Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .label('Old Password'),
  }).test('passwords-required', null, function (values) {
    const { password, cpassword, Oldpassword } = values;
    if ((password || cpassword || Oldpassword) && !(password && cpassword && Oldpassword)) {
      return this.createError({
        path: 'cpassword',
        message: 'Password, Confirm Password, and Old Password are all required if one of them is filled',
      });
    }
    return true;
  });
  
  
  
  

  let session = useContext(AuthContext);
  const [readimages, AppendReadimages] = useState([session.user.image]);
  const [imgchanged,setimgchanged] = useState(false);
  async function Register(v) {

    if(v.username == session.user.username && v.email == session.user.email && v.phone == session.user.phone && imgchanged==false){
      console.log("nothing to change");
      return;
    }
    if(v.username != session.user.username){
      console.log('problem in name *************');
    }
    if(v.email != session.user.email){
      console.log('problem in email *************');
    }
    if(v.phone != session.user.phone){
      console.log('problem in phone *************');
    }
    if(imgchanged==true){
      console.log('img changed ***********');
    }

    if (readimages.length > 0) {
      v.image = readimages[0];
    }else{
      v.image= null;
    }
    v.ischanged = imgchanged;
    v.Token = session.user.Token;
    console.log("data to send :",v);
    console.log('in');
    let res = await PostApi.UpdateClient(v);
    setimgchanged(false);
    console.log('out');
    if(res.ok){
      console.log(res.data);
      storage.StoreUser(JSON.stringify(res.data));
      session.setUser(res.data);
      
    }else{
      console.log('not ok');
      console.log(res.data)
    }
  }

  return (
    <>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.title}>Modify Profile</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Profile Image</Text>
          <ImagesSelector imgchanged={(b)=>setimgchanged(b)} AppendReadimages={AppendReadimages} readimages={readimages} />
          <Formik
            initialValues={{
              username: session.user.username,
              email: session.user.email,
              phone: session.user.phone,
              password: '',
              cpassword: '',
              Oldpassword: '',
            }}
            onSubmit={Register}
            validationSchema={validationSchema}
          >
            {({ handleChange, handleSubmit, errors, setFieldTouched, touched, values }) => (
              <React.Fragment>
                <CTextInput
                  value={values.username}
                  onBlur={() => setFieldTouched("username")}
                  iconname='user'
                  Iconcolor='purple'
                  placeholder='UserName'
                  onChangeText={handleChange("username")}
                />
                {touched.username && <Error errormsg={errors.username} />}

                <CTextInput
                  value={values.email}
                  onBlur={() => setFieldTouched("email")}
                  keyboard='email-address'
                  iconname='mail'
                  Iconcolor='purple'
                  placeholder='Email'
                  onChangeText={handleChange("email")}
                />
                {touched.email && <Error errormsg={errors.email} />}

                <CTextInput
                  value={values.phone}
                  onBlur={() => setFieldTouched("phone")}
                  placeholder='PhoneNumber'
                  iconname='phone'
                  Iconcolor='purple'
                  keyboard='numeric'
                  maxL={8}
                  onChangeText={handleChange("phone")}
                />
                {touched.phone && <Error errormsg={errors.phone} />}

                <PasswordInput
                  value={values.Oldpassword}
                  onBlur={() => setFieldTouched("Oldpassword")}
                  placeholder='Old Password'
                  iconNameEyeHidden='eye-with-line'
                  iconnameysar='key'
                  Iconcolor='purple'
                  IconNameEyeColor='purple'
                  onChangeText={handleChange("Oldpassword")}
                />
                {touched.Oldpassword && <Error errormsg={errors.Oldpassword} />}

                <PasswordInput
                  value={values.password}
                  onBlur={() => setFieldTouched("password")}
                  placeholder='Password'
                  iconNameEyeHidden='eye-with-line'
                  iconnameysar='key'
                  Iconcolor='purple'
                  IconNameEyeColor='purple'
                  onChangeText={handleChange("password")}
                />
                {touched.password && <Error errormsg={errors.password} />}

                <PasswordInput
                  value={values.cpassword}
                  onBlur={() => setFieldTouched("cpassword")}
                  placeholder='Confirm Password'
                  iconNameEyeHidden='eye-with-line'
                  iconnameysar='key'
                  Iconcolor='purple'
                  IconNameEyeColor='purple'
                  onChangeText={handleChange("cpassword")}
                />
                {touched.cpassword && <Error errormsg={errors.cpassword} />}

                <LinearGradient
                  colors={['#8A00D4', '#FF3CAC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.lineargradiantModal}
                >
                  <TouchableOpacity style={styles.getstartedbutton} onPress={handleSubmit}>
                    <View>
                      <Text style={styles.CreateAccount}>Save Changes</Text>
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
              </React.Fragment>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
};

export default ModifyProfile;

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    paddingLeft: 10,
    marginBottom: 10,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getstartedbutton: {
    borderRadius: 25,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineargradiant: {
    width: '60%',
    borderRadius: 25,
  },
  getstartedtext: {
    color: colors.white,
    fontSize: 18,
  },
  lineargradiantModal: {
    width: '50%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  insidemodelcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CreateAccount: {
    color: colors.white,
    fontSize: 18,
  },
  logoModel: {
    height: '25%',
    width: '25%',
  },
  loginlink: {
    marginTop: 10,
    color: 'blue',
  },
  TextunderCreateAccount: {
    marginTop: 10,
  },
});
