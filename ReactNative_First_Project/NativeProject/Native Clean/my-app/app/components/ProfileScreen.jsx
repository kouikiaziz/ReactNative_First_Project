import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import PostCard from './PostCard';
export default ProfileScreen = ({profileName,ImageLink,profile_id,session,profileposts,handlepost,likepost,getpplwholiked,makeacomment}) => {


 

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image style={styles.avatar} source={{ uri: ImageLink }}/>
          <Text style={styles.name}>{profileName}</Text>
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
