import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import PostCard from './PostCard';
export default ProfileScreen_user = ({profileName,ImageLink,profile_id,session,profileposts,handlepost,likepost,getpplwholiked,AreWeFriends,AddFriend,RemoveFriend,userconfirmedtosendfr=false,RemoveSentFriendRq,userconfirmedtoremovefr,makeacomment}) => {
const [bool,setbool] = useState(AreWeFriends);
const [enableAddFriend,setenableAddFriend] = useState(false);
const [enableRemoveFriend,setenableRemoveFriend] = useState(false);
const [enableCancelFr,setenableCancelFr] = useState(false);
const [acceptrefusefr,setacceptrefusefr] = useState(false);

useEffect(()=>{

console.log(AreWeFriends);
  if(bool == 'waiting'){
    setenableCancelFr(true);
    setenableRemoveFriend(false);
    setenableAddFriend(false);
  }else if(bool==true){
    setenableRemoveFriend(true);
    setenableAddFriend(false);
    setenableCancelFr(false);
  }else if (bool == false){
    setenableAddFriend(true);
    setenableCancelFr(false);
    setenableRemoveFriend(false);
  }else if (bool == null){
   console.log('bool = null  = my profile')
  }else if (bool == 'waitingAcceptance'){
    setacceptrefusefr(true);
    setenableAddFriend(false);
    setenableCancelFr(false);
    setenableRemoveFriend(false);
  }

},[bool])

function CLICKED_ON_REMOVE_FRIEND(){
  RemoveFriend(profile_id);
  setbool(false);

}

function CLICKED_ON_ADD_FRIEND(){
  AddFriend(profile_id);
  setbool('waiting');
}

function CLICKED_ON_REMOVE_FRIEND_REQUEST(){
  RemoveSentFriendRq(profile_id);
  setbool(false);

}

function CLICKED_ON_ACCEPT_FRIEND(){
  AddFriend(profile_id);
  setbool(true);
}


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image style={styles.avatar} source={{ uri: ImageLink }}/>
          <Text style={styles.name}>{profileName}</Text>
         
              {enableRemoveFriend && <Button title='Remove Friend' onPress={() => { CLICKED_ON_REMOVE_FRIEND() }} />}
              {enableAddFriend && <Button title='Add Friend' onPress={() => { CLICKED_ON_ADD_FRIEND() }} />}
          { enableCancelFr && <Button title='Remove Friend Request' onPress={()=>{CLICKED_ON_REMOVE_FRIEND_REQUEST()}}></Button>}
          {acceptrefusefr && (<Button title='Accept Friend Request' onPress={()=>{setacceptrefusefr(false);CLICKED_ON_ACCEPT_FRIEND()}}></Button>)}
          {acceptrefusefr && <Button title='Refuse Friend Request' onPress={()=>{setacceptrefusefr(false);CLICKED_ON_REMOVE_FRIEND_REQUEST()}}></Button>}
          <View style={styles.statsContainer}>
            
            <View style={styles.statsBox}>
              <Text style={styles.statsCount}>{profileposts.length}</Text>
              <Text style={styles.statsLabel}>Posts</Text>
            </View>
            
            
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        {/* {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: image }}/>
          </View>
        ))} */}
        {profileposts.map( (post) => (
          <View key={post.id} style={styles.postContainer}>
            
                  <PostCard makeacomment={()=>makeacomment(post.id)} getpplwholiked={()=>getpplwholiked(post.id)}  handlepost={(postid)=>{handlepost(postid)}} isLikedbydefault={post.liked} likepost={(idpost)=>likepost(idpost)}  post={post} navigatetoprofile={()=>{}}  />
          </View>
                ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 30,
    marginTop:20,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statsBox: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statsCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  statsLabel: {
    fontSize: 14,
    color: '#999999',
  },
  body: {
    alignItems: 'center',
    padding: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: '33%',
    padding: 5,
  },
  image: {
    width: '100%',
    height: 120,
  },
  postContainer: {
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
},
});
