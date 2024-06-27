import { TouchableWithoutFeedback,Image, StyleSheet, Text, View, ScrollView, Button, Alert,FlatList,TextInput, ActivityIndicator, TouchableOpacity, Modal } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import CPickerProfile from '../components/CPickerProfile'
import PostApi from '../api/PostApi'
import AuthContext from '../Auth/Context'
import * as Notifications from 'expo-notifications';
import {  } from 'react-native-gesture-handler'
import PostCard from '../components/PostCard'
import PostInput from '../components/PostInput'
import ProfileScreen from '../components/ProfileScreen'
import colors from '../config/colors'
import CTextInput from '../components/CTextInput'
import ImagesSelector from '../components/ImagesSelector'
import SettingsCard from '../components/SettingsCard'
import ProfileScreen_user from '../components/ProfileScreen_user'
const List = [
    { id: 1, name: "Kouiki Mohamed Aziz", image: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg" }
]



const Posts = () => {


//notif handelling
const responseListener = useRef(null);
const notificationListener = useRef(null);

  useEffect(() => {
    console.log("Posts Mounted");

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
      console.log("Posts : Recieved");
      console.log(notification);

      // console.log(notification.request.content.data);
      if(notification.request.content.data.ADD_FRIEND_IN_FRIEND_REQUEST_LIST){
        console.log(notification.request.content.data.ADD_FRIEND_IN_FRIEND_REQUEST_LIST);
        let newFr = {id:notification.request.content.data.ADD_FRIEND_IN_FRIEND_REQUEST_LIST.id,
                    name:notification.request.content.data.ADD_FRIEND_IN_FRIEND_REQUEST_LIST.name,
                    image:notification.request.content.data.ADD_FRIEND_IN_FRIEND_REQUEST_LIST.image
        };
        
        setListFr(prevList => [newFr,...prevList]);
        
    }
    // if(notification.request.content.data.REMOVE_FRIEND_IN_FRIEND_REQUEST_LIST){
    //     console.log(notification.request.content.data.REMOVE_FRIEND_IN_FRIEND_REQUEST_LIST);
    //     setListFr(ListRecvFr.filter(fr => fr.id !== notification.request.content.data.REMOVE_FRIEND_IN_FRIEND_REQUEST_LIST.id));
    // }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Posts Clicked");
      console.log(response);
    });
    

    return () => {
      console.log("Posts Unmounted");
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);


//handelling Accept/Refuse Fr
const [ListRecvFr,setListFr] = useState([]);
const [isFrReady,setisFrReady] = useState(false);

async function getFr(){
    setisFrReady(false);
    data = {Token:session.user.Token}
    let res = await PostApi.GetMyFriendRequests(data);
    if(!res.ok){
        console.log('not ok');
    }else{
        if(res.data.Success != []){
            setListFr(res.data.Success);
            setisFrReady(true);
            
            
        }
        //console.log(res.data.Success[0]);
    }

}
useEffect(()=>{
     getFr();
     getPostsFeed();
     getMyPosts();
     
},[])







//handelling search and sending fr
    let session = useContext(AuthContext);

    const [searchList,setsearchlist] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const cache = useRef({}).current; // useRef for caching

    // Implementing debounce function to delay API call
    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            const context = this;
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    };

    // Debounced function for fetching users
    const debouncedSearch = debounce((s) => getUsers(s), 2000);

    async function getUsers(s) {
        setSearchTerm(s);

        try {
            // Check if search term is empty
            if (!s.trim()) {
                setsearchlist([]);
                return;
            }

            const cachedResult = getCachedResult(s);
            if (cachedResult) {
                setsearchlist(cachedResult);
                return;
            }

            const data = { Name: s, Token: session.user.Token };
            const res = await PostApi.GetUsersBySearch(data);
            console.log("Cache when Calling \n",cache);
            if (!res.ok) {
                console.log('Something went wrong');
                setsearchlist([]);
            } else {
                const users = res.data.Result;
                setsearchlist(users);
                cacheResult(s, users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setsearchlist([]);
        }
    }

    // Simple cache implementation using object

    const getCachedResult = (key) => {
        return cache[key];
    };

    const cacheResult = (key, value) => {
        cache[key] = value;
    };































    //  async function getUsersSearch(s){
    //     let data = {"Name":s,"Token":session.user.Token};
    //     let res =  await PostApi.GetUsersBySearch(data);
    //     if(!res.ok){
    //         console.log('Something Went Wrog');
    //         setsearchlist([]);
    //     }else{
    //         // console.log(res.data);
    //         // res.data.Result.forEach(FoundUser => {
    //         //         console.log(FoundUser.id);
    //         //         console.log(FoundUser.name);

    //         //     });
    //         setsearchlist(res.data.Result);

    //     }
        
    // }
    async function sendFr(profile_id){
        data = {'id':profile_id , 'Token':session.user.Token}
       let res =  await PostApi.SendFriendRequest(data);
       setuserconfirmedtosendfr(true);
       if(!res.ok){
        console.log("no friend rq");
       }else{
        console.log(res.data);
        // setListFr(ListRecvFr.filter(fr => fr.id !== profile_id));
       }

    }

    function handleSendingFriendRequest(profile_id,name){
        Alert.alert('Add a Friend','Do You Want to Send A Friend Request To '+name,[
{
    text:"Yes",
    onPress: ()=>{sendFr(profile_id);
    }
},
{
    text:"No",
    onPress: ()=>{console.log("no send fr");setuserconfirmedtosendfr(false);}
}
        ])
    }

   async function RefuseFr(id){
        setListFr(ListRecvFr.filter(fr => fr.id !== id));
        data = {Token:session.user.Token , Sender : id}
        let res = await PostApi.RejectFriendRequest(data);
        if(res.ok){
            console.log(res.data);
        }else{
            console.log(res.data);
            console.log('not ok');
        }
    }
  async function AcceptFr(id){
        setListFr(ListRecvFr.filter(fr => fr.id !== id));
        data = {Token:session.user.Token , Sender : id}
        let res = await PostApi.AcceptFriendRequest(data);
        if(res.ok){
            console.log(res.data);
        }else{
            console.log('not ok');
        }
    }
    




    const [posts, setPosts] = useState([])
const [myposts , setmyposts ]= useState([]);

async function getMyPosts(){
    data = {Token : session.user.Token};
   let res  =  await PostApi.getMyPosts(data);
   if(res.ok){
    setmyposts(res.data.Success);
   }
}
const [feedrdy,setfeedrdy] = useState(false);
async function getPostsFeed(){
    setfeedrdy(false)
    data = {Token : session.user.Token};
   let res=  await PostApi.getPosts(data);
   if(res.ok){
    setPosts(res.data.Success);
    setfeedrdy(true);

   }else{
    console.log('not ok');
   }
}
const [ModelProfileppl,setModelProfileppl] = useState(false);
const [currentProfile,setcurrentProfile] = useState([{name:'',image:null,friends:null}]);
const [profileposts,setprofileposts] = useState([])
const [profileloaded,setprofileloaded]= useState(false);
async function handleProfileNavigation(id){
    setprofileloaded(false);
    console.log(id);
    setModelProfileppl(true);
    data = {Token :session.user.Token,id : id};
    let res = await PostApi.LoadProfilex(data);
    if(res.ok){
        console.log(res.data)
        setcurrentProfile(res.data.Success);
        setprofileposts(res.data.Posts);
    }else{
        console.log('not ok');
    }
    setprofileloaded(true);
    
}

const [inputHeight, setInputHeight] = useState(120); // Initial height

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    // console.log(contentHeight);
    setInputHeight(220);
  };
const [counter , setcounter ] = useState(-1);
const [isupoadedfinished,setisuploadedfinished] = useState(true);
  async function uploadPost(){
    if((contentPost == null || contentPost == '') && readimages == []){
        console.log('something is missing');
    }else{
        setisuploadedfinished(false);
        data = {Token: session.user.Token,content: contentPost,image:readimages[0]}
       let  res = await PostApi.ShareAPost(data);
       setisuploadedfinished(true);
        if(res.ok){
            console.log(res.data);
            
            Alert.alert('Confirmation','Post Uploaded Successfully');
             getPostsFeed();
             getMyPosts();
             //setmyposts((MypreviousPosts) => [{id:counter,userId:99,username:session.user.username,userimage:session.user.image,date:"Just Now",content:contentPost,image:readimages[0]},...MypreviousPosts])
             //setcounter(counter-1);
             AppendReadimages([]);
             setcontentPost('');
            setModaltosharePost(false);
            
            // setListFr(prevList => [newFr,...prevList]);
        }else{
            console.log(res.data);
        }
    }
  }

const [contentPost,setcontentPost] = useState('');
const [ModelProfile,setModelProfile] = useState(false);
const [Modaltoshareapost,setModaltosharePost] = useState(false);
const [readimages,AppendReadimages] = useState([]);


async function handlepost(id){
    console.log(id);
    data = {Token:session.user.Token,postid:id}
    let res = await PostApi.DeleteMyPost(data);
    if(res.ok){
        console.log(res.data);
        setmyposts(myposts.filter(post => post.id !== id));
        setPosts(posts.filter(post => post.id !== id));
    }else{
        console.log('not ok');
    }
}
function handepostinFeed(id){
    let test = myposts.find(post => post.id === id);
    if (test != undefined){ // its my post
        Alert.alert('Option','Do you Want to Delete Your Post ?',[
            {
                text:'Yes',
                onPress:()=>{handlepost(id);setprofileposts(profileposts.filter((poist)=>{poist.id != postid}))}
            },
            {
                text:'No',
                onPress:()=>{console.log('No delete')}
            }
        ])
    }else{ //not mine
        console.log('not yours ');
    }
}

async function likepost(idpost){
    data = {Token : session.user.Token , id:idpost};
    let res = await PostApi.SendPostLike(data);
    if(!res.ok){
        console.log('nt ok');
        console.log(res.data);
    }else{
        let test = posts.filter((post)=>post.id === idpost);
        if(test != undefined){// pot 

        }
        console.log(res.data);
    }
}

const [pplLike,setpplLike] = useState([]);
const [modellike,setmodellike] = useState(false);
const [gettinglikedfinishdloading,setgettinglikedfinishdloading] = useState(true);
async function getpplwholiked(id){
    setgettinglikedfinishdloading(false);
    console.log(id);
    data = {Token : session.user.Token ,id : id}
    setmodellike(true);
    let res = await PostApi.getLikesPpl(data);
    setgettinglikedfinishdloading(true)

    if(res.ok){
        console.log(res.data.Success);
        setpplLike(res.data.Success);
        
    }else{
        console.log('not ok');
    }
}

const [ModelComment,setModelComment]=useState(false);
const [comments,setcomments] = useState([]);
const [postid,setpostid] = useState(0);
const [commentcontent,setCommentContent] = useState('');
const [mycomments,setmycomments] = useState([]);


async function getCommentisolated(id){
    data = {Token: session.user.Token,id:id}
    let res = await PostApi.getComments(data);
    if(res.ok){
        console.log(res.data);
        setcomments(res.data.Success);
        setmycomments(res.data.MyComments);

    }else{
        console.log(res.data);

        console.log('not ok');
    }
}
const [AreCommentLoaded,setAreCommentsLoaded] = useState(false);
async function openCommentSection(id){
    setAreCommentsLoaded(false);
    setModelComment(true);
    setpostid(id);
    //handle comments loading
    await getCommentisolated(id);
    setAreCommentsLoaded(true);

}
async function makeacomment(){
    if(commentcontent == '') return;

    console.log(commentcontent);
    console.log(postid);
    data = {id: postid , comment_content : commentcontent , Token : session.user.Token}
    console.log(data);
    let res = await PostApi.postComment(data);
    if(res.ok){
        console.log(res.data);
        //setcomments((comments) =>[{id:,name:session.user.username,image:session.user.image,content:commentcontent},...comments])
        //setListFr(prevList => [newFr,...prevList]);
        await getCommentisolated(postid);
        
    }else{
        console.log('not ok');
    }

}
async function deleteCommentFromPostid(id_comment){
        data = {post_id:postid , Token : session.user.Token , id_comment: id_comment}
        let res = await PostApi.deletemyComment(data);
        if(res.ok){
            console.log(res.data);
            setcomments(prevComments => prevComments.filter((c) => c.id_c !== id_comment));
            setmycomments(prevMyComments => prevMyComments.filter((c) => c.id_c !== id_comment));
        }else{
            console.log('not ok');
        }
}
function checkifcommentismineornot(id){
    let test = mycomments.filter((c)=>c.id_c === id);
    if( test.length == 0){
        console.log('not yours');
    }else{
        Alert.alert('Options','Do You Want To Delete Your Comment ?',[
            {
                text: 'Yes',
                onPress:  () => {
                
                     deleteCommentFromPostid(id); // Ensure this is an async call
                   
                
            }
            }
            
            ,
            {
                text:'No',
                onPress:()=>{console.log('No delete my comment')}
            }
        ])
    }
}

const [userconfirmedtoremovefr,setuserconfirmedtoremovefr] = useState(false);
async function RemoveFriend(id){
    data = {Token : session.user.Token, id : id}
    let res = await PostApi.RemoveFriend(data);
    if(res.ok){
        setuserconfirmedtosendfr(false);
        setuserconfirmedtoremovefr(true);
        console.log(res.data);
    }else{
        console.log('not ok');
    }
    
}

async function cancelfrRequest(id){
data = {Token : session.user.Token,id : id};
let res = await PostApi.RemoveFrQ(data);
if(res.ok){
    console.log(res.data);
}else{
    console.log('not ok');
}
}
const [userconfirmedtosendfr,setuserconfirmedtosendfr] = useState(false);
        return (
       <ScrollView style={styles.container}>
            <View style={styles.pickerContainer}>
                <CPickerProfile
                    items={searchList}
                    navigateto={(profile_id, name) => { handleProfileNavigation(profile_id); }}
                    placeholder='Add a friend'
                    onChangeTextP={(s) => { getUsers(s); }}
                    iconname='account-search'
                    Iconcolor='black'
                />
            </View>
            <View style={styles.requestsContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.title}>Friend Requests</Text>
                </View>
                {isFrReady ? (
                    ListRecvFr.length > 0 ? (
                        <ScrollView horizontal={true} style={styles.horizontalScrollView}>
                            {ListRecvFr.map(item => (
                                <View key={item.id} style={styles.itemContainer}>
                                    <Image style={styles.image} source={{ uri: item.image }} />
                                    <Text>{item.name}</Text>
                                    <View style={styles.buttonRow}>
                                        <Button title="Accept" onPress={() => { AcceptFr(item.id); }} />
                                        <Button title="Reject" onPress={() => { RefuseFr(item.id); }} />
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <View style={[styles.scrollView, styles.emptyContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={styles.emptyText}>No friend requests</Text>
                            <Image style={{ height: 40, width: 40 }} source={require('../assests/sad.png')} />
                        </View>
                    )
                ) : (
                    <View style={[styles.scrollView, styles.loadingContainer]}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
                <View>
                    <Text style={styles.title}>POSTS</Text>
                </View>
                <View style={{flex:1,flexDirection:'row',alignItems: 'flex-end'}}>
                <TouchableOpacity onPress={()=>setModelProfile(true)}>
                <Image style={{height:50,width:50,borderRadius:25,margin:10}} source={{uri:session.user.image}}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={{width:"80%"}} onPress={()=>setModaltosharePost(true)}>
                <PostInput iconname='camera' style={{width:'100%'}}placeholder={session.user.username+' Whats On Your Mind'}></PostInput>
                </TouchableOpacity>
                </View>
                {feedrdy ? posts.map(post => (
                    <PostCard  makeacomment={(id)=>openCommentSection(id)} getpplwholiked={(id) => getpplwholiked(id)} isLikedbydefault={post.liked} likepost={(idpost)=>likepost(idpost)} handlepost={(id)=>handepostinFeed(id)} key={post.id} post={post} navigatetoprofile={(id)=>{handleProfileNavigation(id)}}/>
                )) : <View style={[styles.scrollView, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>}
            </View>
            <Modal visible={ModelProfile}>
        <Button title='Close' onPress={()=>setModelProfile(false)}></Button>
        <ProfileScreen makeacomment={(id)=>{openCommentSection(id)}} getpplwholiked={(id)=>getpplwholiked(id)} likepost={(id)=>likepost(id)}handlepost={(idpost)=>handepostinFeed(idpost)} profileposts={myposts} postCount={10} profileName={session.user.username} ImageLink={session.user.image} ></ProfileScreen>
        </Modal>
        <Modal visible={Modaltoshareapost} animationType="slide" transparent={true}>
  {/* <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> */}
  <TouchableWithoutFeedback onLongPress={()=>setModaltosharePost(false)}>
  <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, width: '100%', height: '100%',justifyContent:'center'}}>
  
    <>
  <Button title='Close' onPress={() => setModaltosharePost(false)} />
        <View style={{backgroundColor:'white',height:500}}>
        <Text style={styles.title}>Share A Post</Text>
        
      <TextInput 
                style={[styles.textInput, { height: inputHeight }]}
                multiline={true}
                onChangeText={(p)=>{setcontentPost(p)}}
                onContentSizeChange={(e) =>
                  handleContentSizeChange(e.nativeEvent.contentSize.width, e.nativeEvent.contentSize.height)
                }
                placeholder={"Share A Thought "+session.user.username}
              />
                <View style={{flex:1 , justifyContent:'center',alignItems:'center',marginTop:20,marginBottom:20}}> 
                    
              <ImagesSelector AppendReadimages={AppendReadimages} readimages={readimages}></ImagesSelector>
              
              <Button title='POST' style={{marginTop: 20}} onPress={()=>uploadPost()}></Button>

              {!isupoadedfinished ?  <ActivityIndicator size="large" color="#0000ff" />  : <></>}

              </View>
              
        </View>
        </>
    </View>
    </TouchableWithoutFeedback>

  {/* </View> */}
</Modal>







{/* modal mta el likes hetha */}
<Modal visible={modellike} animationType="slide" transparent={true}>
  {/* <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> */}
  <TouchableWithoutFeedback onLongPress={()=>setmodellike(false)}>
  <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, width: '100%', height: '100%',justifyContent:'center'}}>
  
    <>
  <Button title='Close' onPress={() => {setmodellike(false);setpplLike([])}} />

        <View style={{backgroundColor:'white',height:500}}>
        <Text style={styles.title}>People Who Liked This Post</Text>
        
        {!gettinglikedfinishdloading ?  <ActivityIndicator size="large" color="#0000ff" />  : <></>}

            <FlatList
            data={pplLike}
            keyExtractor={(ppl)=>ppl.id.toString()}
            renderItem={({item})=>{
                return(
                    <SettingsCard Title={item.name} uri_u={item.image} onP={()=>{handleProfileNavigation(item.id);console.log('should navigate to user profile id:',item.id)}}></SettingsCard>
                )
            }}
            ></FlatList>
        </View>
        </>
    </View>
    </TouchableWithoutFeedback>

  {/* </View> */}
</Modal>



<Modal visible={ModelComment} animationType='fade' transparent={true}>
<TouchableWithoutFeedback onLongPress={()=>setModelComment(false)}>
  <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, width: '100%', height: '100%',justifyContent:'center'}}>
  
    <>
  <Button title='Close' onPress={() => {setModelComment(false);setcomments([]);setpostid(0);setCommentContent('')}} />

        <View style={{backgroundColor:'white',height:500}}>
        <Text style={styles.title}>Comment Section</Text>
        {!AreCommentLoaded ?  <ActivityIndicator size="large" color="#0000ff" />  : <></>}
            <FlatList
            data={comments}
            keyExtractor={(comment)=>comment.id_c.toString()}
            renderItem={({item})=>{
                return(
                    
                                            <SettingsCard onLongPress={()=>{checkifcommentismineornot(item.id_c)}} Title={item.name} Subtitle={item.content} uri_u={item.image} onP={()=>{handleProfileNavigation(item.id);console.log('should navigate to user profile id:',item.id)}}></SettingsCard>

                )
            }}
            ></FlatList>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={{width:'85%'}}>
            <CTextInput placeholder='Share Your Comment...' value={commentcontent} onChangeTextP={(c)=>setCommentContent(c)} ></CTextInput>
            </View>
            <Button title='Send' onPress={()=>{makeacomment();setCommentContent('')}}></Button>
            

            </View>
        </View>
        
            
        
        </>
        
    </View>
    </TouchableWithoutFeedback>
</Modal>


<Modal visible={ModelProfileppl}>
<Button title='Close' onPress={() => { setprofileloaded(false); setuserconfirmedtosendfr(false);setModelProfileppl(false); setcurrentProfile([{name:'',image:null,friends:null}]) ;setprofileposts([]);}} />
{ profileloaded ? <ProfileScreen_user makeacomment={(id)=>{openCommentSection(id)}} profileName={currentProfile[0].name} ImageLink={currentProfile[0].image} profileposts={profileposts} handlepost={(postid)=>{handepostinFeed(postid);}} likepost={(postid)=>{likepost(postid)}} getpplwholiked={(postid)=>getpplwholiked(postid)} profile_id={currentProfile[0].id} userconfirmedtoremovefr={false}  AreWeFriends={currentProfile[0].friends} AddFriend={(id)=>{sendFr(id)}} RemoveFriend={(id)=>{RemoveFriend(id)}} userconfirmedtosendfr={userconfirmedtosendfr} RemoveSentFriendRq={(id)=>{{cancelfrRequest(id);setuserconfirmedtosendfr(false);}}}  ></ProfileScreen_user> :    <ActivityIndicator size="BIG" color="#0000ff" />}
</Modal>

        </ScrollView>
        
    );
};

export default Posts;

const styles = StyleSheet.create({
    textInput: {
        height: '100%',
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        textAlignVertical: 'top',  // Align text to the top for multiline input
      },
    container: {
        flex: 1,
        paddingRight: 10,
        paddingLeft: 10,
    },
    pickerContainer: {
        marginBottom: 10,
    },
    requestsContainer: {
        flex: 1,
    },
    title: {
        fontSize: 30,
        paddingLeft: 10,
        marginBottom: 10,
    },
    scrollView: {
        maxHeight: 220,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 10,
        marginRight: 10,
        borderRadius:75
    },
    itemContainer: {
        alignItems: 'center',
        marginRight: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 150,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    horizontalScrollView: {
        marginBottom: 10,
    },
});