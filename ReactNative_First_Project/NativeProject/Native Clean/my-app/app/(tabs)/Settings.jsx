import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import AuthContext from '../Auth/Context'
import SettingsCard from '../components/SettingsCard'
import storage from '../Auth/storage'
import Auth from '../api/Auth'

const Settings = ({navigation}) => {
    let session = useContext(AuthContext);

    user = session.user;
    function logout(){
          Auth.Logout({Token:session.user.Token});
          storage.RemoveUser();
          session.setUser(null);
      }
    return (
    <View style={{flex:1}}>
      <SettingsCard Title={session.user.username} onP={()=>navigation.navigate('ModifyProfile')}  Subtitle={session.user.email} uri_u={user.image}></SettingsCard>
      
      <View style={{ marginBottom: 30}}>
      </View>
      
                <SettingsCard Title={'Logs'} onP={()=>navigation.navigate('Logs')}   uri_u={'https://cdn-icons-png.flaticon.com/512/2620/2620995.png'}></SettingsCard>
                <SettingsCard onP={()=>logout()} Title={"LogOut"}   uri_u={"https://www.iconpacks.net/icons/2/free-user-logout-icon-3056-thumb.png"}></SettingsCard>


    </View>
  )
}

export default Settings

const styles = StyleSheet.create({})