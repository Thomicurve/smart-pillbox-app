import React, {useState} from 'react'
import { View, Text, Button, StyleSheet, TextInput } from 'react-native'
import { login } from '../services/AuthServices'

export default function Home({ navigation: {navigate} }) {

    const [dni, setDni] = useState(0);

    const handleSubmit = () => {
        login(dni)
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
            <Button
                title="Iniciar sesión"
                onPress={handleSubmit} />
            <Text>Vuelve al registro <Text onPress={() => navigate('Registro')}>aquí</Text></Text>
        </View>
    )
}

const RegisterStyles = StyleSheet.create({
    container: {
        backgroundColor: '#141416',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
    },
    inputFields: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 30,
        color: '#111',
        marginVertical: 10,
        borderRadius: 5
    }
})