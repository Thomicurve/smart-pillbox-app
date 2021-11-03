import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import BackgroundJob from 'react-native-background-actions';
import moment from 'moment';


import usePills from '../hooks/usePills';
import PillCard from '../components/PillCard';


const notificationConfig = {
    taskName: 'Example',
    taskTitle: 'Corriendo...🔍',
    taskDesc: 'Analizando pastillas',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#072F4E',
    parameters: {
        delay: 5000,
    },
};

const makeDelay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
let nextPillTime = {pillName: '', pillHour: ''};
let takeThePill = false;

export default function Home({ navigation }) {
    
    const isFocused = useIsFocused();
    const [todayPills, setTodayPills] = useState([]);
    const [nextPill, setNextPill] = useState({ pillName: '', pillHour: '' });
    const [isLoading, setIsLoading] = useState(true);
    const { GetTodayPills, pills } = usePills();

    // 
    const verifyPillHour = async (taskData) => {
        await new Promise(async (resolve) => {
            const { delay } = taskData;
            let hourNow = moment().format('LT');
            
            for (let i = 0; BackgroundJob.isRunning(); i++) {
                let nextPillFormated = nextPillTime.pillHour.substring(1);
                if(nextPillTime.pillHour[0] == '0') {
                    if(nextPillFormated == moment().format('LT') || takeThePill == true) {
                        takeThePill = true;
                        console.log(`Debes tomar la pastilla ${nextPillTime.pillName} de las ${nextPillTime.pillHour}`)
                    }

                } else {
                    if(hourNow == nextPillTime.pillHour ) {
                        console.log(`Debes tomar la pastilla ${nextPillTime.pillName} de las ${nextPillTime.pillHour}`)
                    }
                }
                await makeDelay(delay);
            }
        });
    };

    useEffect(() => {
        async function handleBackgroundJobs () {
            await BackgroundJob.start(verifyPillHour, notificationConfig);
            console.log('Start tasks')
        }
        
        handleBackgroundJobs();
    }, [])

    // ESTABLECER TODAS LAS PASTILLAS QUE SE VAN A MOSTRAR EN LA UI
    const callPills = async () => {
        const todayPillsResult = await GetTodayPills(isFocused);
        setTodayPills(todayPillsResult.todayPills);
        setNextPill(todayPillsResult.nextPillComplete);
        
        if(todayPillsResult.nextPillComplete != undefined) 
            nextPillTime = todayPillsResult.nextPillComplete;

        setIsLoading(false);
    }

    useEffect(() => {
        callPills();
    }, [])

    useEffect(() => {
        setIsLoading(true);
        callPills();
    }, [pills, isFocused])

    const goToCreatePill = () => {
        navigation.navigate('NewPill')
    }

    const handleTakeThePill = () => {
        takeThePill = false;
    }




    return (
        <ScrollView scrollEnabled={true}>
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
                                            <PillCard pill={pill} todayPills={todayPills} setPills={setTodayPills} key={pill._id}/>
                                        )
                                    })}
                                </View>
                            </View>
                        }
                    </View>

                }
                <View style={styles.pillsButtons}>
                    <TouchableOpacity onPress={goToCreatePill} style={styles.newPillButton}>
                        <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Nueva pastilla</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleTakeThePill} style={styles.newPillButton}>
                        <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Listo!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#072F4E',
        height: 1800
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
    todayPillsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
        position: 'relative',
        top: -30
    },
    newPillButton: {
        backgroundColor: "#1F547E",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginLeft: 40
    }
})