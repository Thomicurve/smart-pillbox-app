import React, {useState} from 'react'
import { View, Text, Button, StyleSheet, TextInput, ToastAndroid } from 'react-native'
import { register } from '../services/AuthServices'

export default function Home({ navigation }) {

    const [name, setName] = useState('')
    const [dni, setDni] = useState(0);

    const handleSubmit = async () => {
        const registerResults = await register(dni, name);
        if(registerResults.message == 'Usuario registrado correctamente!'){
            ToastAndroid.show(registerResults.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM)
            setTimeout(() => {
                navigation.navigate('Login')
            }, 2000) 
        } else {
            ToastAndroid.show(`Error: ${registerResults.message}`, ToastAndroid.SHORT, ToastAndroid.BOTTOM)
        }
        
    }

    return (
        <View style={RegisterStyles.container}>
            <Text>Registro</Text>
            <TextInput
                placeholder="DNI"
                keyboardType='numeric'
                onChangeText={num => setDni(num)}
                style={RegisterStyles.inputFields}
                />
            <TextInput
                iconName='person'
                iconType='MaterialIcons'
                style={RegisterStyles.inputFields}
                placeholder='Nombre'
                onChangeText={text => setName(text)}
            />
            <Button
                title="Registrarse"
                onPress={handleSubmit} />
            <Text style={RegisterStyles.linkToLogin}>Tienes una cuenta? <Text onPress={() => navigation.navigate('Login')}>Inicia sesión</Text></Text>
        </View>
    )
}

const RegisterStyles = StyleSheet.create({
    container: {
        backgroundColor: '#141416',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        
    },
    inputFields: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 30,
        color: '#111',
        marginVertical: 10,
        borderRadius: 5
    },
    linkToLogin: {
        color: '#fff',
        marginTop: 10
    }
})