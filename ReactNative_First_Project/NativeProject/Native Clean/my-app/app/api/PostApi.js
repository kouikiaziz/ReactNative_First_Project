import client from './client'



const GetUsersBySearch = async (data) =>  client.post("/SearchUsers",data);
const SendFriendRequest = async (data) => client.post("/SendFriendRequest",data);
const GetMyFriendRequests = async (data) => client.post("/GetFriendRequests",data);
const AcceptFriendRequest = async (data) => client.post("/AcceptFr",data);
const RejectFriendRequest = async (data) => client.post("/RejectFr",data);
const getMyPosts = async (data) => client.post("/GetMyPosts",data);
const getPosts = async (data) => client.post("/GetPosts",data);
const ShareAPost = async (data) =>  {
    const d = new FormData();
    d.append('Token',data.Token);
    d.append('content',data.content);
    if(data.image){
    d.append('image',{
        name:'image',
        type: 'image/jpeg',
        uri: data.image
    });
}
   return client.post("/AddPost",d,{
    headers: {
        'Content-Type': 'multipart/form-data',
    },
   });}
const DeleteMyPost = async(data)=> client.post("/DeleteMyPost",data);
const SendPostLike = async(data)=>client.post("/LikePost",data);
const getLikesPpl = async(data)=>client.post("/GetLikesPPL",data);
const getComments = async(data)=>client.post("/GetComments",data);
const postComment = async(data)=>client.post("/PostComment",data);
const deletemyComment = async(data)=>client.post("/DeleteMyComment",data);
const getFriends = async(data)=>client.post("/GetFriends",data);
const LoadProfilex = async(data)=>client.post("/LoadPorfile",data);
const RemoveFriend = async(data)=>client.post("/RemoveFriend",data);
const RemoveFrQ = async(data)=>client.post("/CancelFR",data);
const UpdateClient = async (data) =>  {
    const d = new FormData();
    d.append('Token',data.Token);
    d.append('username',data.username);
    d.append('email',data.email);
    d.append('phone',data.phone);
    d.append('Oldpassword',data.Oldpassword);
    d.append('password',data.password);
    d.append('cpassword',data.cpassword);
    d.append('ischanged',data.ischanged);
    if(data.image){
        if(data.image.includes('https:')){
            d.append('image',data.image);
        }else{
            d.append('image',{
                name:'image',
                type: 'image/jpeg',
                uri: data.image
            });
        }
   
}
   return client.post("/UpdateClient",d,{
    headers: {
        'Content-Type': 'multipart/form-data',
    },
   });}
export default {UpdateClient,RemoveFrQ,RemoveFriend,LoadProfilex,getFriends,deletemyComment,postComment,getComments,getLikesPpl,SendPostLike,DeleteMyPost,ShareAPost,getPosts,getMyPosts,GetUsersBySearch,SendFriendRequest,GetMyFriendRequests,AcceptFriendRequest,RejectFriendRequest};