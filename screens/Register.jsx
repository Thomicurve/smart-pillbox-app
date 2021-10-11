import React, {useState} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ToastAndroid } from 'react-native'
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
            <Text style={RegisterStyles.registerTitle}>Registrarse</Text>
            <TextInput
                placeholder="DNI"
                keyboardType='numeric'
                onChangeText={num => setDni(num)}
                style={RegisterStyles.inputFields}
                placeholderTextColor={'#fff'}
                />
            <TextInput
                iconName='person'
                iconType='MaterialIcons'
                style={RegisterStyles.inputFields}
                placeholder='NOMBRE'
                placeholderTextColor={'#fff'}
                onChangeText={text => setName(text)}
            />
            <TouchableOpacity style={RegisterStyles.buttonContainer} onPress={handleSubmit}>
                <Text style={RegisterStyles.buttonText}>Enviar</Text>
            </TouchableOpacity>
            <Text style={RegisterStyles.linkToLogin}>Tienes una cuenta? <Text style={{color: '#F1982E'}} onPress={() => navigation.navigate('Login')}>Inicia sesión</Text></Text>
        </View>
    )
}

const RegisterStyles = StyleSheet.create({
    container: {
        backgroundColor: '#072F4E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
        paddingTop: 100
    },
    registerTitle: {
        fontSize: 34,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 40
    },
    inputFields: {
        backgroundColor: '#072F4E',
        paddingVertical: 10,
        paddingHorizontal: 30,
        color: '#fff',
        marginVertical: 10,
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 2,
        width: 240,
        fontSize: 15,
        fontWeight: 'bold'
    },
    linkToLogin: {
        color: '#fff',
        marginTop: 20,
        fontSize: 16
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
        paddingHorizontal: 15,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#3378AD',
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
})