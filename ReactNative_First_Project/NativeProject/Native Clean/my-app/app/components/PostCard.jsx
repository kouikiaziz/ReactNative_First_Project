import { StyleSheet, Text, View,Image,TouchableOpacity,TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import {  } from 'react-native-gesture-handler';


function  PostCard({ post,navigatetoprofile,handlepost,likepost,isLikedbydefault=false,getpplwholiked,makeacomment}){

const [liked,setliked]= useState(isLikedbydefault);
return(
  <TouchableWithoutFeedback onLongPress={()=>{handlepost(post.id)}}>

    <View style={styles.postCard}>
        <>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={()=>navigatetoprofile(post.userId)} style={{flexDirection:'row',flex:1,alignItems:'center'}}>
        <Image source={{ uri: post.userimage }} style={styles.postAvatar} />
        <Text style={styles.postUsername}>{post.username}</Text>
        </TouchableOpacity>
        <Text style={styles.postDate}>{post.date}</Text>
      </View>
      <Text style={styles.postDescription}>{post.content}</Text>
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.postButton} onLongPress={()=>{getpplwholiked(post.id)}} onPress={()=>{
          likepost(post.id);
          setliked(!liked);
          }}>
          {!liked ? <Text style={styles.postButtonText}>Like</Text> : <Text style={styles.liked}>Like</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={()=>{makeacomment(post.id)}}>
          <Text style={styles.postButtonText}>Comment</Text>
        </TouchableOpacity>
        
      </View>
      </>
    </View>
    </TouchableWithoutFeedback>

    )

};

export default PostCard

const styles = StyleSheet.create({
    container: {
      paddingTop:60,
      paddingBottom:120,
    },
    userContainer: {
      flexDirection: 'row',
      padding: 10,
      backgroundColor:'#fff',
      height:100,
    },
    userItem: {
      marginRight: 10,
      alignItems: 'center',
  
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    statusUserName:{
      marginTop:5,
      fontSize:12,
      color:'#483D8B',
      width:60,
      textAlign:'center'
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    postListContainer:{
      paddingTop:20,
      paddingHorizontal:15,
    },
    postCard: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#fff',
      borderRadius:5,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    postAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 10,
    },
    postUsername: {
      flex: 1,
    },
    postDate: {
      fontSize: 12,
      color:'#A9A9A9',
    },
    postDescription:{
      fontSize:16,
      color:'#00008B'
    },
    postImage: {
      marginTop: 10,
      width: '100%',
      height: 200,
    },
    postFooter: {
      flexDirection: 'row',
      marginTop: 10,
    },
    postButton: {
      marginRight: 10,
    },
    postButtonText:{
      color:'#808080'
    },
    liked:{
      color:'tomato'
    }
  });
  