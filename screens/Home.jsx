import React, { useState, useContext, useEffect } from 'react'

import TokenContext from '../context/TokenContext';
import { View, Text, Button } from 'react-native'
import globals from '../styles/globals'

import useAuthUser from '../hooks/useAuthUser';
import { GetPills } from '../services/PillsServices'


export default function Home({ navigation }) {
    const { deleteToken } = useAuthUser();
    const {getToken} = useAuthUser();
    const [pills, setPills] = useState([]);


    useEffect(() => {
        async function callPills() {
            const token = await getToken();
            const result = await GetPills(token);

            if (!result) throw console.log(new Error(result));
            else setPills(result);
        }
        callPills();
    }, [])

    const handleLogout = async () => {
        await deleteToken();
        setTimeout(() => {
            navigation.navigate('Login');
        }, 1500)
    }


    return (
        <View style={globals.container}>
            <Text>Registro de pastillas</Text>
            {!pills.length ?
                <View>
                    <Text>Cargando...</Text>
                </View>
                :
                <View>
                    {pills.map((item) => (
                        <Text key={item._id}>{item.pillName}</Text>
                    ))}
                </View>
            }

            <Button
                title="Logout"
                onPress={handleLogout} />
        </View>
    )
}