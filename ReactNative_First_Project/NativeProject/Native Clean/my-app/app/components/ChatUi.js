import React, { useContext, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
import ChatContext from '../Auth/ChatContext';
import * as Notifications from 'expo-notifications';
import { func } from 'prop-types';
import * as ImagePicker  from 'expo-image-picker'
import { ProgressBarAndroid } from '@react-native-community/progress-bar-android';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';


export default Chat = ({data,uploadMessageIntoDb,setData}) => {

  let chats = useContext(ChatContext);
  const flatListRef = useRef(null);
  const recordingRef = useRef(null);

  const [messages, setMessages] = useState(data.chat)
 
  const [newMsg, setNewMsg] = useState()

  const getLowestId = (messages) => {
    if (messages.length === 0) return -1; // default to -1 if no messages
    return Math.min(...messages.map(msg => msg.msg_id));
  };

  const [counter, setcounter] = useState(getLowestId(data.chat) - 1);

  const renderDate = date => {
    return <Text style={styles.time}>{date}</Text>
  }

  const handleSend = (voiceRecord=null,ImageURI=null) => {
    if (((newMsg == null||newMsg.trim() === '') && voiceRecord==null && ImageURI==null)) return;
    let newMessage = {}
if(voiceRecord == null && ImageURI == null){
     newMessage = {
      msg_id: counter,
      am_i_sender: true,
      content: newMsg,
      time: new Date().toISOString(), // Or use "test" if you prefer
    };
  }else if (voiceRecord != null){
     newMessage = {
      msg_id: counter,
      am_i_sender: true,
      content: '',
      voiceRecord : voiceRecord,
      time: new Date().toISOString(), // Or use "test" if you prefer
    };
  }else if (ImageURI != null){
     newMessage = {
      msg_id: counter,
      am_i_sender: true,
      content: '',
      image:ImageURI,
      time: new Date().toISOString(), // Or use "test" if you prefer
    };
  }
  //  console.log("the new message is :" , newMessage);
    uploadMessageIntoDb(newMessage,data.user_id);
    setMessages((previousMsgs) => [...previousMsgs,newMessage]);
    //.log("the new ALL message are :" , messages);
    updateDataChats(newMessage,data.user_id);
    setcounter(counter - 1);
    setNewMsg(''); // Clear the input field
    flatListRef.current.scrollToEnd({ animated: true });

  };




  function updateDataChats(msg, user_id) {
    chats.setdata(prevChats =>
      prevChats.map(chat => 
        chat.user_id === user_id ? 
        { ...chat, chat: [...chat.chat, msg] } : 
        chat
      )
    );
  }













  const responseListener = useRef(null);
  const notificationListener = useRef(null);

  useEffect(() => {
    console.log("Inside chat Mounted");

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      console.log("INSIDE CHAT :");
      // console.log(notification.request.content.data);
      console.log(notification);

      if(notification.request.content.data.APPEND_NEW_MESSAGE){
        let Msg =notification.request.content.data.APPEND_NEW_MESSAGE.New_msg;
        let conversation_id = notification.request.content.data.APPEND_NEW_MESSAGE.conversation_id;
        
        console.log("i hould update inside ui only");
        setMessages((previousMsgs) => [...previousMsgs,Msg]);
        //update global ui ?


        // const sortedConversations = chats.getdata.sort((a, b) => {
        //   // Get the time of the latest message for each conversation
        //   const timeA = a.chat.length > 0 ? new Date(a.chat[a.chat.length - 1].time) : new Date(0);
        //   const timeB = b.chat.length > 0 ? new Date(b.chat[b.chat.length - 1].time) : new Date(0);
          
        //   // Sort by descending order (latest time first)
        //   return timeB - timeA;
        // });

        // chats.setdata(chats.getdata());












      //   chats.setdata((previousData) => {
      //     return previousData.map(conversation => {
      //         if (conversation.conversation_id === conversation_id) {
      //             // Append the new message to the chat array
      //             return {
      //                 ...conversation,
      //                 chat: [...conversation.chat, Msg]
      //             };
      //         }
      //         // Return the conversation as is if it doesn't match the conversation_id
      //         return conversation;
      //     });
      // });
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("INSIDE CHAT  :");
      console.log(response);
     
    });
    

    return () => {
      console.log("INSIDE CHAT Unmounted");
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);





  async function SelectImage(){
    try{
      const result =  await ImagePicker.launchImageLibraryAsync();
      console.log(result);
      if(result.assets!=null && !result.canceled){
       return result.assets[0].uri;

      }
    }catch{
        console.log('Error while trying to select Image');
        return null;
    }
    }


    async function OpenCamera(){
      try{
          const result = await ImagePicker.launchCameraAsync();
          if(result.assets!=null){
              return result.assets[0].uri
          }
      }catch(error){
          console.log('Camera coudlnt Open : '+error);
      }
  }




 async function getImage(number){ // from library
  let res = null;
  if(number == 1){
    res = await SelectImage();
  }else if (number == 2){
    res = await OpenCamera();
  }
 if(res != null){

  handleSend(null,res);
 }
return
 }


 async function startRecording() {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access microphone was denied');
      return;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await recording.startAsync();
    recordingRef.current = recording;
  } catch (error) {
    console.log('Failed to start recording:', error);
  }
}


async function stopRecording() {
  try {
    const recording = recordingRef.current;
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      handleSend(uri);
      recordingRef.current = null;
    }
  } catch (error) {
    console.log('Failed to stop recording:', error);
  }
}

async function playAudio(uri){
  if(uri != null){


    if(uri.startsWith('file:///')){
      try {
        const { sound,status } = await Audio.Sound.createAsync({uri}, { shouldPlay: true });
        await sound.playAsync();

        // sound.setOnPlaybackStatusUpdate(status => {
        //   setPlaybackStatus(status);
        // });

        // setPlayingAudio(sound);
      } catch (error) {
        console.log('Failed to play recording:', error);
      }
    }else if(uri.startsWith('https://')){
      //console.log("should download from internet first then play it");
      console.log("Downloading audio from the internet...");
      try {
        const downloadResumable = FileSystem.createDownloadResumable(uri, FileSystem.documentDirectory + 'audio.mp3');

        const { uri: localUri } = await downloadResumable.downloadAsync();

        const { sound, status } = await Audio.Sound.createAsync(
          { uri: localUri },
          { shouldPlay: true }
        );

        await sound.playAsync();
      } catch (error) {
        console.log('Failed to download or play audio from the internet:', error);
      }
    }
  }
}






  return (
    <View style={styles.container}>
        <Image src={''}></Image>
      <FlatList
      onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      ref={flatListRef}
        style={styles.list}
        data={messages}
        keyExtractor={(chat)=>{ 
            return chat.msg_id.toString();
        }}
        renderItem={({item}) => {
            
          let inMessage = item.am_i_sender === false
          let itemStyle = inMessage ? styles.itemIn : styles.itemOut
         // console.log("item is ",item)
          return (

            <>
            <View style={[styles.item, itemStyle]}>

              {!inMessage && renderDate(item.time)}
              <View style={[styles.balloon]}>
                <Text>{item.content}</Text>
                
                {item.image && <Image width={200} height={200} source={{uri:item.image}}></Image>}
                {item.voiceRecord && <TouchableOpacity onPress={()=>{console.log("clicked?");playAudio(item.voiceRecord)}}><Image height={50} width={50}  source={{uri:"https://img.icons8.com/small/75/ffffff/play.png"}}></Image></TouchableOpacity>}
                
              </View>

              {inMessage && renderDate(item.time)}
            </View>
            </>
          )
        }}
      />
      <View style={styles.footer}>

<View style={{justifyContent:'space-evenly',flexDirection:'row'}}>
   {/* Microphone */}
      <TouchableOpacity style={styles.btnSend} onPressIn={()=>{startRecording()}} onPressOut={()=>{stopRecording()}}>

    <Image
  source={{ uri: 'https://img.icons8.com/small/75/ffffff/microphone.png' }}
  style={styles.iconSend}
    />
      </TouchableOpacity>

        {/* Gallery */}
      <TouchableOpacity style={styles.btnSend} onPress={()=>{getImage(1)}}>

    <Image
  source={{ uri: 'https://img.icons8.com/small/75/ffffff/gallery.png' }}
  style={styles.iconSend}
    />
      </TouchableOpacity>


       {/* Camera */}
       <TouchableOpacity style={styles.btnSend} onPress={()=>{getImage(2)}}>

<Image
source={{ uri: 'https://img.icons8.com/small/75/ffffff/camera.png' }}
style={styles.iconSend}
/>
  </TouchableOpacity>
      </View>



        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Write a message..."
            underlineColorAndroid="transparent"
            onChangeText={(msg) => setNewMsg( msg )}
            value={newMsg}
          />
        </View>

        <TouchableOpacity style={styles.btnSend} onPress={()=>{handleSend()}}>

          <Image
            source={{ uri: 'https://img.icons8.com/small/75/ffffff/filled-sent.png' }}
            style={styles.iconSend}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 17,
  },
  footer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#eeeeee',
    paddingHorizontal: 10,
    padding: 5,
  },
  btnSend: {
    backgroundColor: '#00BFFF',
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSend: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  balloon: {
    maxWidth: 250,
    padding: 15,
    borderRadius: 20,
  },
  itemIn: {
    alignSelf: 'flex-start',
  },
  itemOut: {
    alignSelf: 'flex-end',
  },
  time: {
    alignSelf: 'flex-end',
    margin: 15,
    fontSize: 12,
    color: '#808080',
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E0FFFF',
    borderRadius: 300,
    padding: 5,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },progressBar: {
    flex: 1,
    height: 10,
  },
})

                