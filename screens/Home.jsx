import React, { useState, useContext, useEffect } from 'react'

import TokenContext from '../context/TokenContext';
import { View, Text, Button } from 'react-native'
import globals from '../styles/globals'

import useAuthUser from '../hooks/useAuthUser';
import { GetPills } from '../services/PillsServices'


export default function Home({ navigation }) {
    const { deleteToken } = useAuthUser();
    const {token, setToken} = useContext(TokenContext);
    const [pills, setPills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        async function callPills() {
            try {
                const result = await GetPills(token);
                setPills(result);
                setIsLoading(false);
            } catch (err) {
                throw console.log(new Error(result));
            }
        }
        callPills();
    }, [])

    const handleLogout = async () => {
        await deleteToken();
        setTimeout(() => {
            setToken('');
            navigation.navigate('Login');
        }, 1500)
    }


    return (
        <View style={globals.container}>
            <Text>Registro de pastillas</Text>
            {isLoading ?
                <View>
                    <Text>Cargando...</Text>
                </View>
                :
                <View>
                    {pills.length > 0
                        ?
                        pills.map((item) => (
                            <Text key={item._id}>{item.pillName}</Text>
                        ))
                        :
                        <Text>Ninguna pastilla aun</Text>
                    }
                </View>
            }
            <Button
                title="Logout"
                onPress={handleLogout} />
        </View>
    )
}