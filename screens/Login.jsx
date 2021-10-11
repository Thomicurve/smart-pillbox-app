import React, {useState, useContext} from 'react'
import { View, Text, StyleSheet, TextInput, ToastAndroid, TouchableOpacity } from 'react-native'
import { login } from '../services/AuthServices'
import TokenContext from '../context/TokenContext';
import useAuthUser from '../hooks/useAuthUser';

export default function Login({ navigation: {navigate} }) {

    const {token, setToken} = useContext(TokenContext);
    const {saveToken} = useAuthUser();
    const [dni, setDni] = useState(0);

    const handleSubmit = async () => {
        const loginResults = await login(dni, token);
        
        if(loginResults.message == 'Inicio sesíon exitoso!'){

            ToastAndroid.show(loginResults.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            await saveToken(loginResults.token)
            setToken(loginResults.token);
            setTimeout(() => {
                navigate('Home');
            }, 1500)

        } else {
            ToastAndroid.show(`Error: ${loginResults.message}`, ToastAndroid.SHORT, ToastAndroid.BOTTOM)
        }
    }

    return (
        <View style={LoginStyles.container}>
            <Text style={LoginStyles.loginTitle}>Iniciar sesión</Text>
            <TextInput
                placeholder="DNI (sin puntos)"
                keyboardType='numeric'
                onChangeText={num => setDni(num)}
                style={LoginStyles.inputFields}
                placeholderTextColor={'#fff'}
                />
                <TouchableOpacity style={LoginStyles.buttonContainer} onPress={handleSubmit} >
                    <Text style={LoginStyles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            <Text style={LoginStyles.linkToRegister}>No tienes cuenta?<Text style={LoginStyles.link} onPress={() => navigate('Register')}> Regístrese aquí</Text></Text>
        </View>
    )
}

const LoginStyles = StyleSheet.create({
    container: {
        backgroundColor: '#072F4E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
        paddingTop: 100
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
    linkToRegister: {
        color: '#fff',
        marginTop: 30,
        fontSize: 16
    },
    loginTitle: {
        fontSize: 34,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 40
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
        fontSize: 20,
    },
    link: {
        color: '#F1982E',
    }
})