import React, { useState, useEffect, useContext } from 'react'
import TokenContext from '../context/TokenContext';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, SafeAreaView, Pressable, Modal, Image
} from 'react-native';
import renderSmartPillbox from '../assets/illustrations/render-pastillero.png';
import { useIsFocused } from '@react-navigation/native';
import BackgroundJob from 'react-native-background-actions';
import moment from 'moment';
import ReactAlarm from 'react-native-alarm-notification';
import { MaterialIcons } from '@expo/vector-icons';


import usePills from '../hooks/usePills';
import { SubmitRecords } from '../services/RecordsServices';
import PillCard from '../components/PillCard';


const notificationConfig = {
    taskName: 'SmartPillbox',
    taskTitle: 'Smart Pillbox 💊',
    taskDesc: 'Analizando pastillas...🔍',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#072F4E',
    parameters: {
        delay: 5000,
    },
};

const Delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
let nextPillTime = [];
let schedulePills = [];
let pillTaken = false;
let pillsRemaining = 0;
let takeThePill = false;
const positionSelectedColor = '#F2D06B';

export default function Home({ navigation }) {
    const isFocused = useIsFocused();

    const [changeReload, setChangeReload] = useState(false);
    const [todayPills, setTodayPills] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [uploadingRecords, setUploadingRecords] = useState(false);
    const { token } = useContext(TokenContext);
    const { GetTodayPills, pills } = usePills();

    // PARAR ALARMA
    useEffect(() => {
        async function getAlarms() {
            const result = await ReactAlarm.getScheduledAlarms();
            if (result.length !== 0) {
                ReactAlarm.stopAlarmSound();
                ReactAlarm.removeAllFiredNotifications();
                takeThePill = false;
                schedulePills.shift();
            }
        }

        getAlarms();
    }, [pillTaken])

    // ENVIAR NOTIFICACIÓN
    const pushNotification = (pill) => {
        const alarmNotifData = {
            title: `Debe tomar ${pill.pillName} de las ${pill.pillHour}`,
            message: "Ya es hora de tomar su pastilla",
            channel: "my_channel_id",
            small_icon: "ic_launcher",
        };

        setModalVisible(true);
        ReactAlarm.sendNotification(alarmNotifData);
    }


    // VERIFICAR CADA X TIEMPO SI ES LA HORA DE LA PASTILLA
    const verifyPillHour = async (taskData) => {
        await new Promise(async () => {
            const { delay } = taskData;
            for (let i = 0; BackgroundJob.isRunning(); i++) {
                let hourNow = moment().format('LT');
                if (nextPillTime.length !== 0) {
                    nextPillTime.forEach((pill) => {
                        let formatedPill = '';
                        // FORMATEA LA HORA AMOLDANDOSE AL FORMATO DE LA LIBRERIA
                        if (pill.pillHour[0] === '0') formatedPill = pill.pillHour.substring(1);
                        else formatedPill = pill.pillHour;

                        // COLA DE PASTILLAS
                        //  Busca si hay alguna las pastillas que siguen están en la cola
                        const scheduleFiltered = schedulePills.some((schedulePill) => schedulePill._id == pill._id);

                        // Si no están en la cola y además es la hora de la pastilla se agregan a la cola 
                        if (hourNow == formatedPill && !scheduleFiltered) {
                            schedulePills.push(pill);
                        }

                        // si queda algo en la cola que ejecute lo siguiente
                        if (schedulePills.length !== 0) {
                            // envía la notificación y se utiliza el "takeThePill" para evitar que se envien infinitas notificaciones.
                            if (hourNow == schedulePills[0].pillHour && !takeThePill) {
                                pushNotification(schedulePills[0]);
                                takeThePill = true;
                            }
                        }
                    })

                }
                // en el caso de que no haya próximas pastillas pero que hayan quedado pastillas en la cola, estas se le notifican al usuario.
                if (schedulePills.length !== 0 && !takeThePill) {
                    pushNotification(schedulePills[0]);
                    takeThePill = true;
                }
                await Delay(delay);
            }
        });
    };

    // COMENZAR TAREAS EN SEGUNDO PLANO
    useEffect(() => {
        async function handleBackgroundJobs() {
            await BackgroundJob.start(verifyPillHour, notificationConfig);
        }
        handleBackgroundJobs();
    }, [])


    // ESTABLECER TODAS LAS PASTILLAS QUE SE VAN A MOSTRAR EN LA UI
    const callPills = async () => {
        try {
            const todayPillsResult = await GetTodayPills();
            setTodayPills(todayPillsResult.todayPills);
            if (todayPillsResult.nextPillComplete.length !== 0) {
                // Este filtro es para saber si las pastillas no fueron tomadas aún
                let pillFiltered = todayPillsResult.nextPillComplete.filter(({ takenToday }) => takenToday == 0);
                if (pillFiltered.length !== 0) {
                    pillsRemaining = pillFiltered[0].amount;
                    nextPillTime = pillFiltered;
                } else nextPillTime = [];
            } else {
                nextPillTime = [];
            }
            console.log('today pills',todayPills.length)
        } catch (error) {
            console.error(error);
            alert('Error obteniendo pastillas');
        }
    }

    useEffect(() => {
        callPills();
    }, [isFocused, pills, changeReload])

    const goToCreatePill = () => {
        navigation.navigate('NewPill')
    }

    // SUBIR LOS REGISTROS
    const handleSubmitRecord = async (data) => {
        try {
            await SubmitRecords(token, data);
            setUploadingRecords(false);
            alert('Registro guardado correctamente!');
        } catch (error) {
            alert('Error guardando el registro:', error);
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView scrollEnabled={true}>
                <Text style={styles.title}>Próxima pastilla</Text>
                <View>
                    {nextPillTime.length != 0 ?
                        <View style={styles.nextPillContainer}>
                            <Text style={styles.nextPillName}>{nextPillTime[0].pillName}</Text>
                            <Text style={styles.nextPillHour}>{nextPillTime[0].pillHour}</Text>
                        </View>
                        :
                        <View>
                            <Text style={styles.notNextPills}>No hay una próxima pastilla</Text>
                        </View>
                    }
                    <View style={styles.pillsButtons}>
                        <TouchableOpacity
                            style={styles.pillButtons}
                            onPress={() => navigation.navigate('Records')}
                        >
                            <Text style={styles.textStyle}>Registros de pastillas</Text>
                            <MaterialIcons name="assignment" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={goToCreatePill} style={styles.pillButtons}>
                            <Text style={styles.textStyle}>Nueva pastilla</Text>
                            <MaterialIcons name="add-alarm" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {todayPills.length === 0
                        ? <View>
                            <Text style={styles.notNextPills}>No hay pastillas aún</Text>
                        </View>
                        :

                        <View style={{ marginTop: 30, display: 'flex', justifyContent: 'center' }}>
                            <Text style={styles.todayPillsTitle}>Pastillas de hoy:</Text>
                            <View style={styles.todayPillsContainer}>
                                {todayPills.map(pill => {
                                    return (
                                        <PillCard
                                            pill={pill}
                                            todayPills={todayPills}
                                            setPills={setTodayPills}
                                            key={pill._id}
                                            setChangeReload={setChangeReload}
                                            changeReload={changeReload}
                                            navigation={navigation}
                                        />
                                    )
                                })}
                            </View>
                        </View>
                    }
                </View>
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={uploadingRecords}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Guardando registro... 👨‍💻👨‍💻</Text>
                            </View>
                        </View>
                        <View style={styles.backgroundModal}></View>
                    </Modal>
                    {
                        schedulePills.length != 0 &&
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>Debes tomar la pastilla {schedulePills[0].pillName} de las {schedulePills[0].pillHour}.
                                        Debe tomar {pillsRemaining} pastilla/s</Text>
                                    <View>
                                        <Image style={{ width: 400, height: 270 }} source={renderSmartPillbox} />
                                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', top: 155, width: '100%', right: 80}}>
                                            <View
                                                style={[styles.pillSlot, { backgroundColor: schedulePills[0].position == 1 && positionSelectedColor}]}></View>
                                            <View
                                                style={[styles.pillSlot, { backgroundColor: schedulePills[0].position == 2 && positionSelectedColor}]}></View>
                                            <View
                                                style={[styles.pillSlot, { backgroundColor: schedulePills[0].position == 3 && positionSelectedColor}]}></View>
                                            <View
                                                style={[styles.pillSlot, { backgroundColor: schedulePills[0].position == 4 && positionSelectedColor}]}></View>
                                        </View>
                                    </View>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => {
                                            handleSubmitRecord({
                                                pillName: schedulePills[0].pillName,
                                                amount: schedulePills[0].amount,
                                                pillID: schedulePills[0]._id,
                                                pillHour: moment().format('LT'),
                                                pillDate: moment().format('L')
                                            })
                                            pillTaken = !pillTaken;
                                            setModalVisible(false);
                                            setUploadingRecords(true)
                                        }}
                                    >
                                        <Text style={styles.textStyle}>Ya la tomé!</Text>
                                    </Pressable>
                                </View>
                            </View>
                            <View style={styles.backgroundModal}></View>
                        </Modal>
                    }


                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pillSlot: {
        borderRadius: 50,
        width: 30,
        height: 30,
        // position: 'absolute',
        // top: 155
    },
    backgroundModal: {
        position: 'absolute',
        backgroundColor: '#000',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.9,
        zIndex: 0
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        position: 'relative',
        zIndex: 1
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        marginRight: 10,
        fontSize: 16
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    container: {
        backgroundColor: '#072F4E',
        flex: 1,
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
        height: 120,
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 30,
    },
    pillButtons: {
        backgroundColor: "#1F547E",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginVertical: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
})