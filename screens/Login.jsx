import React, {useState, useContext} from 'react'
import { View, Text, Button, StyleSheet, TextInput, ToastAndroid } from 'react-native'
import { login } from '../services/AuthServices'
import TokenContext from '../context/TokenContext';
import useAuthUser from '../hooks/useAuthUser';
import { logout } from '../services/AuthServices'

export default function Login({ navigation: {navigate} }) {

    const {token, setToken} = useContext(TokenContext);
    const {saveToken} = useAuthUser();
    const [dni, setDni] = useState(0);

    const logOut = async () => {
        await logout();
    }

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
            <Text>Inicio de sesión</Text>
            <TextInput
                placeholder="DNI"
                keyboardType='numeric'
                onChangeText={num => setDni(num)}
                style={LoginStyles.inputFields}
                />
            <Button
                title="Iniciar sesión"
                onPress={handleSubmit} />
            <Button
                title="Logout"
                onPress={logOut} />
            <Text style={LoginStyles.linkToRegister}>No tienes cuenta? Regístrese <Text onPress={() => navigate('Register')}>aquí</Text></Text>
        </View>
    )
}

const LoginStyles = StyleSheet.create({
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
    linkToRegister: {
        color: '#fff',
        marginTop: 30
    }
})
// import React, {useState, useContext} from 'react'
// import { View, Text, Button, StyleSheet, TextInput, ToastAndroid } from 'react-native'
// import { login } from '../services/AuthServices'
// import TokenContext from '../context/TokenContext'
// import useAuthUser from '../hooks/useAuthUser'

// export default function Home({ navigation: {navigate} }) {

//     const token = useContext(TokenContext);
//     const {saveToken} = useAuthUser();
//     const [dni, setDni] = useState(0);

//     const handleSubmit = async () => {
//         const loginResults = await login(dni, token);
        
//         if(loginResults.message == 'Inicio sesíon exitoso!'){
//             ToastAndroid.show('Inicio de sesíon exitoso!', ToastAndroid.SHORT, ToastAndroid.BOTTOM)
//             await saveToken(loginResults.token)
//             setTimeout(() => {
//                 navigate('Home');
//             }, 1500)

//         } else {
//             ToastAndroid.show(`Error: ${loginResults.message}`, ToastAndroid.SHORT, ToastAndroid.BOTTOM)
//         }
//     }

//     return (
//         <View style={LoginStyles.container}>
//             <Text>Inicio de sesión</Text>
//             <TextInput
//                 placeholder="DNI"
//                 keyboardType='numeric'
//                 onChangeText={num => setDni(num)}
//                 style={LoginStyles.inputFields}
//                 />
//             <Button
//                 title="Iniciar sesión"
//                 onPress={handleSubmit} />
//             <Text style={LoginStyles.linkToRegister}>No tienes cuenta? Regístrese <Text onPress={() => navigate('Register')}>aquí</Text></Text>
//         </View>
//     )
// }

// const LoginStyles = StyleSheet.create({
//     container: {
//         backgroundColor: '#141416',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100%',
//     },
//     inputFields: {
//         backgroundColor: '#fff',
//         paddingVertical: 10,
//         paddingHorizontal: 30,
//         color: '#111',
//         marginVertical: 10,
//         borderRadius: 5
//     },
//     linkToRegister: {
//         color: '#fff',
//         marginTop: 30
//     }
// })