import React, { useState, useEffect } from 'react'

import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import usePills from '../hooks/usePills';
import { MaterialIcons } from '@expo/vector-icons';


export default function Home({ navigation }) {

    const [reload, setReload] = useState(false);
    const [todayPills, setTodayPills] = useState([]);
    const [nextPill, setNextPill] = useState({ pillName: '', pillHour: '' });
    const [isLoading, setIsLoading] = useState(true);
    const { GetTodayPills, pills } = usePills();


    const callPills = async () => {
        const todayPillsResult = GetTodayPills(reload);
        setTodayPills(todayPillsResult.todayPills);
        setNextPill(todayPillsResult.nextPillComplete);
        setIsLoading(false);
    }

    const handleReload = () => {
        setReload(!reload);
    }

    useEffect(() => {
        callPills();
        setTimeout(() => handleReload(), 2000);
    }, [])

    useEffect(() => {
        setIsLoading(true);
        callPills();
    }, [pills, reload])

    const goToCreatePill = () => {
        navigation.navigate('NewPill')
    }





    return (
        <ScrollView >
            <View style={styles.container}>
                <Text style={styles.title}>Próxima pastilla</Text>
                {isLoading ?
                    <View>
                        <Text>Cargando...</Text>
                    </View>
                    :
                    <View>
                        {nextPill !== undefined
                            ? <View style={styles.nextPillContainer}>
                                <Text style={styles.nextPillName}>{nextPill.pillName}</Text>
                                <Text style={styles.nextPillHour}>{nextPill.pillHour}</Text>
                            </View>
                            :
                            <View>
                                <Text style={styles.notNextPills}>No hay una próxima pastilla</Text>
                            </View>}

                        {todayPills.length == 0
                            ? <View>
                                <Text>No hay pastillas aún</Text>
                            </View>
                            :

                            <View style={{ marginTop: 30, display: 'flex', justifyContent: 'center' }}>
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
                <View style={styles.pillsButtons}>
                    <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
                        <MaterialIcons name="autorenew" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goToCreatePill} style={styles.newPillButton}>
                        <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Nueva pastilla</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#072F4E',
        height: 800
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
        height: '20%',
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
    notNextPills: {
        color: '#F2D06B',
        fontWeight: 'bold',
        fontSize: 18,
        textTransform: 'uppercase',
        textAlign: 'center',
        marginTop: 30
    },
    buttons: {
        marginVertical: 5,
        width: 250,
        marginLeft: 'auto',
        marginRight: 'auto'
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
        alignItems: 'center',
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
    },
    reloadButton: {
        backgroundColor: "#1F547E",
        width: 40,
        height: 40,
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pillsButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 15,
    },
    newPillButton: {
        backgroundColor: "#1F547E",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginLeft: 40
    }
})