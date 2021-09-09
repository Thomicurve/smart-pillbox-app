import React, {useState} from 'react'
import { View, Text, Button, StyleSheet, TextInput } from 'react-native'
// import { useForm } from 'react-hook-form'
import { register } from '../services/AuthServices'

export default function Home({ navigation: {navigate} }) {

    const [name, setName] = useState('')
    const [dni, setDni] = useState(0);

    const handleSubmit = () => {
        register(dni, name)
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
            <Text>Tienes una cuenta? <Text onPress={() => navigate('Login')}>Inicia sesión</Text></Text>
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