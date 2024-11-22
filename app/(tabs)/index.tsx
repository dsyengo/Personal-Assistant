import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import { Stack, Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'



const index = () => {
  return (
    <>
    <Stack.Screen options={{
      headerTransparent: true,
      headerTitle: "",
      headerLeft: ()=>(
        <TouchableOpacity onPress={()=>{}}  style={styles.iconLeft}>
          <Image  style={styles.imageTop} source={{uri: "https://xsgames.co/randomusers/avatar.php?g=male"}}/>
        </TouchableOpacity>
      ),
      headerRight: ()=>(
        <TouchableOpacity onPress={()=>{}} style={styles.iconRight}>
          <Ionicons name='notifications' size={20} color={Colors.light.text}/>
        </TouchableOpacity>
      ),
    }}/>
    </>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTop: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  iconLeft:{
    marginLeft: 20,
  },
  iconRight:{
    marginRight: 30,
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#171717',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
});