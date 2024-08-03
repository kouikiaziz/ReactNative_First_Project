import client from './client'


const GetData = async (data) =>  client.post("/GetData",data);
const SendMsg = async(data) => client.post("/SendMsg",data);
const UpdateStatus = async(data) => client.post("/UpdateStatus",data);
const SendMsgImage = async (data) =>  {
    const d = new FormData();
    d.append('Token',data.Token);
    d.append('recv_id',data.recv_id);
    if(data.image){
    d.append('image',{
        name:'image',
        type: 'image/jpeg',
        uri: data.image
    });
}
   return client.post("/SendMsgImage",d,{
    headers: {
        'Content-Type': 'multipart/form-data',
    },
   });}



   const SendVoice = async (data) =>  {
    const d = new FormData();
    d.append('Token',data.Token);
    d.append('recv_id',data.recv_id);
    if(data.audio){
    d.append('audio',{
        name:'audio',
        type: 'audio/mpeg',
        uri: data.audio
    });
}
   return client.post("/SendVoice",d,{
    headers: {
        'Content-Type': 'multipart/form-data',
    },
   });}
   export default {GetData,SendMsg,UpdateStatus,SendMsgImage,SendVoice};