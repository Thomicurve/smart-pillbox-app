import React from 'react'
import {View, Text, Button} from 'react-native'
import globals from '../styles/globals'

export default function Home({ navigation }){
    return(
        <View style={globals.container}>
            <Text>Registro de pastillas</Text>
            <Button 
            title="Volver al inicio"
            onPress={() => navigation.goBack()}/>
        </View>
    )
}