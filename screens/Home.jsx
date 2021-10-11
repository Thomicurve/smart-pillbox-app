import React, { useState, useContext, useEffect, useLayoutEffect } from 'react'

import TokenContext from '../context/TokenContext';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native'
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

    const callPills = () => {
        const todayPillsResult = GetTodayPills(reload);
        setTodayPills(todayPillsResult.todayPills);
        setNextPill(todayPillsResult.nextPillComplete);
        setIsLoading(false);
    }

    useEffect(() => {
        callPills();
        setTimeout(() => handleReload(), 2000);
    }, [])

    useEffect(() => {
        setIsLoading(true);
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
        navigation.navigate('NewPill')
    }

    const handleReload = () => {
        setReload(!reload);
    }



    return (
        <View style={styles.container}>
                <Text style={styles.title}>Próxima pastilla</Text>
                {isLoading ?
                    <View>
                        <Text>Cargando...</Text>
                    </View>
                    :
                    <View>
                        {nextPill
                            ? <View style={styles.nextPillContainer}>
                                <Text style={styles.nextPillName}>{nextPill.pillName}</Text>
                                <Text style={styles.nextPillHour}>{nextPill.pillHour}</Text>
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
                                <Text style={styles.todayPillsTitle}>Pastillas de hoy:</Text>
                                <View style={styles.todayPillsContainer}>
                                    {todayPills.map(pill => {
                                        return (
                                            <View key={pill._id} style={styles.pillCard}>
                                                <Text style={styles.pillName}>{pill.pillName}</Text>
                                                <Text style={styles.pillHour}>{pill.pillHour}</Text>
                                                <Text style={styles.pillAmount}>{pill.takenToday} / {pill.amount}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
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
    container: {
        backgroundColor: '#072F4E',
        height: '100%'
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 32,
        textAlign: 'center',
        marginTop: 20
    },
    nextPillContainer: {
        backgroundColor: '#1F547E',
        width: '70%',
        height: '30%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    nextPillHour: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 36
    },
    nextPillName: {
        color: '#F2D06B',
        fontWeight: 'bold',
        fontSize: 18,
        textTransform: 'uppercase'
    },  
    buttons: {
        marginVertical: 5,
        width: 250,
        marginHorizontal: 80
    },
    todayPillsTitle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10
    },
    pillCard: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '93%',
        marginHorizontal: 'auto',
        borderRadius: 5,
        backgroundColor: '#1F547E',
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 13
    },
    todayPillsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pillName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    pillHour: {
        color: '#2EF1C2',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    },
    pillAmount: {
        color: '#2EF1C2',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    }
})