import React, { useState, useContext, useEffect, } from 'react'

import TokenContext from '../context/TokenContext';
import { View, Text, Button } from 'react-native'
import globals from '../styles/globals'
import useAuthUser from '../hooks/useAuthUser';
import usePills from '../hooks/usePills';


export default function Home({ navigation }) {
    const { deleteToken } = useAuthUser();
    const { setToken } = useContext(TokenContext);
    const [todayPills, setTodayPills] = useState([]);
    const [nextPill, setNextPill] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { GetTodayPills, pills } = usePills();

    const callPills = async () => {
        const todayPillsResult = await GetTodayPills();
        setTodayPills(todayPillsResult.pillsRemainingResult);
        setNextPill(todayPillsResult.nextPill);
        setIsLoading(false)
    }


    useEffect(() => {
        setIsLoading(true)
        callPills();
    }, [pills])

    const handleLogout = async () => {
        await deleteToken();
        setTimeout(() => {
            setToken('');
            navigation.navigate('Login');
        }, 1500)
    }


    return (
        <View style={globals.container}>
            <Text style={{fontSize: 32, textAlign:'center'}}>Próxima pastilla</Text>
            {isLoading ?
                <View>
                    <Text>Cargando...</Text>
                </View>
                :
                <View>
                    <Text style={{ textAlign: 'center', fontSize: 26, fontWeight: 'bold' }}>{nextPill}</Text>

                    <View style={{marginTop: 50}}>
                        <Text style={{textAlign: 'center'}}>Pastillas restantes de hoy:</Text>
                        {todayPills.map(pill => {
                            return <Text style={{ fontSize: 17, textAlign: 'center' }} key={pill._id}>{pill.pillHour}</Text>
                        })}
                    </View>
                </View>
            }

            <Button
                title="Logout"
                onPress={handleLogout} />
        </View>
    )
}