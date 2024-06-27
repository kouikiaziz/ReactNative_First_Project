
import React from 'react'
import LottieView from 'lottie-react-native';

export default function CActivityIndicator({visible=false}) {
  if(!visible) return;
  return (
    <LottieView source={require('../assests/saroukh.json')}
    autoPlay
    loop
    />
  )
}