import React, { useState, useContext, useEffect, useMemo } from 'react'

import TokenContext from '../context/TokenContext';
import { View, Text, Button } from 'react-native'
import globals from '../styles/globals'
// import moment from 'moment';
import useFormatDatePills from '../hooks/useFormatDatePills';
import useAuthUser from '../hooks/useAuthUser';
import { GetPills } from '../services/PillsServices'


export default function Home({ navigation }) {
    const { deleteToken } = useAuthUser();
    const { token, setToken } = useContext(TokenContext);
    const [pills, setPills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [todayNumber, setTodayNumber] = useState([]);
    const [todayPills, setTodayPills] = useState([])

    const { getToday } = useFormatDatePills();


    useEffect(() => {
        

        async function callPills() {
            try {
                const result = await GetPills(token);
                setPills(result);
                setTodayPills(getToday(result));
                console.log('todaypills', todayPills)
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
            <Text>Próxima pastilla</Text>
            {/* {todayPills.map(pill => <Text style={{ fontSize: 29 }} key={pill._id}>{pill.pillHour}</Text>)} */}
            {isLoading ?
                <View>
                    <Text>Cargando...</Text>
                </View>
                :
                <View>
                        {todayPills.map((item) => (
                            <Text style={{ fontSize: 29 }} key={item._id}>{item.pillHour}</Text>
                        ))}
                </View>}
            {/* <Text style={{fontSize:29}}>{todayPills}</Text> */}
            {isLoading ?
                <View>
                    <Text>Cargando...</Text>
                </View>
                :
                <View>
                    {/* <Text style={{fontSize: 28}}>{}</Text> */}
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