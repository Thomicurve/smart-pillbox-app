import React, { useState, useContext, useEffect } from 'react'

import TokenContext from '../context/TokenContext';
import { View, Text, Button, StyleSheet } from 'react-native'
import globals from '../styles/globals'
import useAuthUser from '../hooks/useAuthUser';
import usePills from '../hooks/usePills';


export default function Home({ navigation }) {
    const { deleteToken } = useAuthUser();
    const { setToken } = useContext(TokenContext);

    const [reload, setReload] = useState(false);
    const [todayPills, setTodayPills] = useState([]);
    const [nextPill, setNextPill] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { GetTodayPills, pills } = usePills();

    const callPills = async () => {
        const todayPillsResult = await GetTodayPills();
        setTodayPills(todayPillsResult.todayPills);
        setNextPill(todayPillsResult.nextPillComplete);
        setIsLoading(false)
    }


    useEffect(() => {
        callPills();
    }, [pills, reload])

    const logoutUser = async () => {
        await deleteToken();
        setTimeout(() => {
            setToken('');
            navigation.navigate('Login');
        }, 1500)
    }

    const goToCreatePill = () => {
        navigation.navigate('New-pill')
    }

    const handleReload = () => {
        setReload(!reload);
    }



    return (
        <View style={globals.container}>
            <Text style={{ fontSize: 32, textAlign: 'center' }}>Próxima pastilla</Text>
            {isLoading ?
                <View>
                    <Text>Cargando...</Text>
                </View>
                :
                <View>
                    {nextPill
                        ? <View>
                            <Text style={{ textAlign: 'center', fontSize: 26, fontWeight: 'bold' }}>{nextPill.pillHour}</Text>
                            <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: 'red' }}>{nextPill.pillName}</Text>
                        </View>
                        :
                        <View>
                            <Text>No hay una próxima pastilla</Text>
                        </View>}

                    {todayPills.length == 0
                        ? <View>
                            <Text>No hay pastillas aún</Text>
                        </View>
                        :

                        <View style={{ marginTop: 50, display: 'flex', justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center' }}>Pastillas restantes de hoy:</Text>
                            {todayPills.map(pill => {
                                return (
                                    <View key={pill._id} style={{width: 250, marginLeft: 80, marginVertical: 5, borderWidth: 1.5, borderColor: 'red' }}>
                                        <Text style={{ fontSize: 17, textAlign: 'center', color: 'red' }}>{pill.pillName}</Text>
                                        <Text style={{ fontSize: 17, textAlign: 'center' }}>{pill.pillHour}</Text>
                                        <Text style={{ textAlign: 'center' }}>{pill.takenToday} / {pill.amount}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    }
                </View>
            }
            <View style={styles.buttons}>
                <Button
                    title="Reload"
                    onPress={handleReload}
                />
            </View>

            <View style={styles.buttons}>
                <Button
                    title="New pill"
                    onPress={goToCreatePill}
                />
            </View>

            <View style={styles.buttons}>
                <Button
                    title="Logout"
                    onPress={logoutUser} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttons: {
        marginVertical: 5,
        width: 250,
        marginHorizontal: 80
    }
})


// {todayPills.map(pill => {
//     return (
//         <View key={pill._id} style={{ display: 'block', width: 250, marginLeft: 80, marginVertical: 5, borderWidth: 1.5, borderColor: 'red' }}>
//             <Text style={{ fontSize: 17, textAlign: 'center', color: 'red' }}>{pill.pillName}</Text>
//             <Text style={{ fontSize: 17, textAlign: 'center' }}>{pill.pillHour}</Text>
//             <Text style={{ textAlign: 'center' }}>0 / {pill.amount}</Text>
//         </View>
//     )
// })}