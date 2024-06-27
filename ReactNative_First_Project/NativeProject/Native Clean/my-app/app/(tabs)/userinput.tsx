import { StyleSheet, Text, View,ScrollView,Switch } from 'react-native'
import React, { useState } from 'react'

import Screen from '../components/Screen.js'
import CTextInput from '../components/CTextInput.js'
import { SafeAreaView } from 'react-native-safe-area-context'
import {  } from 'react-native-gesture-handler'

import CPicker, { Item } from '../components/CPicker.js'


const userinput = () => {
  const [phone , setphone]= useState("");
  const [Name , setName]= useState("");
  const [LName , setLName]= useState("");

function myf(s:string){
  console.log(s.toString());
  setphone(s);
}
function myf2(s:string){
  console.log(s.toString());
  setName(s);
}
function myf3(s:string){
  console.log(s.toString());
  setLName(s);
}

const [myswitchvar , setmyswitchvar] = useState(false);
function f(b:boolean){
console.log(b);
setmyswitchvar(b);
}

const list_testing = [
  { label : "Furniture" , value:1},
  { label : "Couch" , value:2},
  { label : "Black slaves" , value:3},
  { label : "Fatotos" , value:4},
  
]
const [inserteditems , setinserteditems ]= useState(list_testing)
function getSearchInput(s:string){
  console.log(s);
  if(s === ''){
    setinserteditems(list_testing);
  }else{
  // setinserteditems(list_testing.filter((item)=> item.label = s));
  setinserteditems(list_testing.filter((item) => item.label.toLowerCase().includes(s.toLowerCase())));
  }
}
function searchedfor(s:Item){
  console.log('user clicked on :'+ JSON.stringify(s))
  console.log(s.value)
  console.log(s.label)
}
  return (
    <SafeAreaView>
        <View>
          <ScrollView>
            <CTextInput placeholder='First Name' iconname={'adduser'} Iconcolor='black' onChangeTextP={myf2}></CTextInput>
            <CTextInput placeholder='LastName Name' iconname={'user'} Iconcolor='black' onChangeTextP={myf3}></CTextInput>
            <CTextInput  placeholder='PhoneNumber' iconname={'phone'} Iconcolor='black' keyboard='numeric' maxL={8} onChangeTextP={myf}  ></CTextInput>
            <Text>First Name  is : {Name}</Text>
            <Text>Last Name is : {LName}</Text>
            <Text>Phone number is : {phone}</Text>
            <Switch value={myswitchvar} onValueChange={f}/>
            <CPicker OnPressEventSearch={searchedfor} items={inserteditems} iconname='apps' Iconcolor='gray' placeholder='Category' content='' onChangeTextP={getSearchInput}></CPicker>
            
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

export default userinput

const styles = StyleSheet.create({})