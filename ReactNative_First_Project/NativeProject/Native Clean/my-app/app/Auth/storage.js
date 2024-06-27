import * as SecureStore from 'expo-secure-store';

const key = 'MyUser';
const keyPToken = 'PToken';
async function StoreUser(user){
    try {
         SecureStore.setItem(key,user);
         console.log('user stored in secure storage');
    } catch (error) {
        console.log('Failed while Storing User',error);
    }
}

async function getStoredUser(){
    try {
        const MyUser = await SecureStore.getItemAsync(key);
        return JSON.parse(MyUser);
    } catch (error) {
        console.log('Failed while Restoring User From SecureStore',error);

    }
}

async function RemoveUser(){
    try {
        await SecureStore.deleteItemAsync(key);
        console.log('User Deleted from secure storage!');
    } catch (error) {
        console.log('Failed Removing User from SecureStore',error);
    }
}

async function StorePToken(Token){
    try {
        console.log("Storing PToken : ",(Token));
        SecureStore.setItem(keyPToken,Token);
        console.log('PushToken Stored in SecureStore');
   } catch (error) {
       console.log('Failed while Storing PushToken in secureStore',error);
   }
}

async function getStoredToken(){
    try {
        const MyToken = await SecureStore.getItemAsync(keyPToken);
        console.log("Restored PToken ",MyToken);
        return MyToken;
    } catch (error) {
        console.log('Failed while Restoring PushToken From SecureStore',error);
        return null;

    }
}

export default {RemoveUser,StoreUser,getStoredUser,StorePToken,getStoredToken}