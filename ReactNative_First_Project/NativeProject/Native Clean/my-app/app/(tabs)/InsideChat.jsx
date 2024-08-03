import { Image, StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import ChatUi from '../components/ChatUi'
import AuthContext from '../Auth/Context';
import HomeApi from '../api/HomeApi';
import * as Notifications from 'expo-notifications';
import ChatContext from '../Auth/ChatContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import {  } from 'react-native-gesture-handler';

const InsideChat = ({route}) => {
  let session = useContext(AuthContext);

   async function handleUpload(msg,user_id){
    data = {}
    let res = null;
    if(msg.voiceRecord){
      data= {Token:session.user.Token,audio:msg.voiceRecord,recv_id:user_id};
       res = await HomeApi.SendVoice(data);

    }else if(msg.image){
      data= {Token:session.user.Token,image:msg.image,recv_id:user_id};
       res = await HomeApi.SendMsgImage(data);

    }else{
      data= {Token:session.user.Token,msg:msg.content,recv_id:user_id};
       res = await HomeApi.SendMsg(data);
    }
 
  if(res.ok){
    console.log(res.data);
  }else{
    console.log('not ok');
    console.log(res.data);
    
  }
    
  }
  return (
    // <View>
    //   <Text>{route.params.user.user_id }</Text>
    // </View>
    <>
    <View style={styles.header}>
    <View style={styles.userImageContainer}>
          <Image 
            source={{ uri: route.params.user.user_image }} 
            style={styles.userImage} 
          />
          {route.params.user.online_status === true && (
            <View style={styles.onlineIndicator}>
              <FontAwesome name="circle" size={14} color="green" />
            </View>
          )}
        </View>
        <Text>{route.params.user.user_name}</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
        <Icon name="videocam" size={30} color="#000" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
        <Icon name="call" size={30} color="#000" style={styles.icon} />
        </TouchableOpacity>
        </View>
      </View>
    <ChatUi data={route.params.user} uploadMessageIntoDb={(msg,user_id)=>{handleUpload(msg,user_id)}}></ChatUi>
    </>
  )
}

export default InsideChat
const styles = StyleSheet.create({
  header: {
    flex: 0.15,
    backgroundColor: '#eeeeee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  userImageContainer: {
    position: 'relative',
    marginLeft: 10,
  },
  userImage: {
    height: 70,
    width: 70,
    borderRadius: 35, // Half of the width/height to make it a circle
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: '#ffffff', // Adding a border to make it stand out
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10, // Adjust the margin as needed
  },
});