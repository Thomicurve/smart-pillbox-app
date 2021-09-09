import React from 'react'
import {View, Text, Button} from 'react-native'
import globals from '../../styles/globals'

export default function Home({ navigation }){
    return(
        <View style={globals.container}>
            <Text>Home</Text>
            <Button 
            title="Registrar usuario"
            onPress={() => navigation.push('Registro')}/>
        </View>
    )
}

