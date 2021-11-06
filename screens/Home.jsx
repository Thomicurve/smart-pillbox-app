import React, { useState, useEffect } from 'react'
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, SafeAreaView, Pressable, Modal
} from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import BackgroundJob from 'react-native-background-actions';
import moment from 'moment';
import ReactAlarm from 'react-native-alarm-notification';

//imports Alan
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from "convert-string";
//imports Alan - end


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

const Delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
let nextPillTime = { pillName: '', pillHour: '' };
let takeThePill = false;
let pillTaked = false;

export default function Home({ navigation }) {


    //variables Alan
    let btCelular = false; //bt celular esta enacendido?
    let btConectado = false; //bt celular y arduino estan contactados?
    const ID_HM10 = '50:33:8B:13:5D:01'; //ID del bluetooth del arduino

    //1- Funcion Comprobar si el bluetooth del celular esta encendido y permitido
    async function checkBT_device() {
        await BleManager.enableBluetooth()
            .then(() => {
                btCelular = true;
                console.info("El bluetooth ya esta encendido");
            })
            .catch((error) => {
                btCelular = false;
                console.error("El usuario no permite activar el bluetooth");
                console.error(error);
            });
    }

    //2- Funcion escanear dispositivos en 3seg
    async function scanDevices() {
        await BleManager.scan([], 3, true).then(() => {
            console.info("Empezando escaneo...");
        });
        await Delay(3000); //esperar 3 segundos
        await BleManager.stopScan().then(() => { //Detener el escaneo
            console.log("Scan stopped");
        });
    }

    //3- Funcion conectar al arduino
    async function conectar() {
        await BleManager.connect(ID_HM10)
            .then(async () => {
                // Success code
                console.log("Connected");
                await BleManager.retrieveServices(ID_HM10).then(
                    (peripheralInfo) => {
                        // Success code
                        // console.log("Peripheral info:", peripheralInfo);
                    }
                );
            })
            .catch((error) => {
                // Failure code
                console.error(error);
            });
    }

    //4- Funcion revisar conexion con el celular y el arduino
    async function checkArduino_Connected() {
        await BleManager.isPeripheralConnected(
            ID_HM10,
            []
        ).then((isConnected) => {
            btConectado = isConnected;
            if (isConnected) {
                console.log("Peripheral is connected!");
                setInterval(apagar, 300);
            } else {
                console.log("Peripheral is NOT connected!");
            }
        });
    }

    // Funcion Apagar BUZZER
    async function apagar() {
        const data = stringToBytes('0');
        await BleManager.write(
            ID_HM10,
            "0000ffe0-0000-1000-8000-00805f9b34fb",
            "0000ffe1-0000-1000-8000-00805f9b34fb",
            data
        )
            .then(() => {
                // Success code
                // console.log("Write: " + data);
            })
            .catch((error) => {
                console.error(error);
                // NOTIFIACION CELULAR DE PASTILLERO DESCONECTADO AQUI
            });
    }

    //Funcion mostrar RSSI señal
    async function showRSSI() {
        await BleManager.readRSSI(ID_HM10)
            .then((rssi) => {
                // Success code
                console.log("Current RSSI: " + rssi);
            })
            .catch((error) => {
                // Failure code
                console.error(error);
            });
    }
    //variables Alan - end

    const isFocused = useIsFocused();
    const [changeReload, setChangeReload] = useState(false);
    const [todayPills, setTodayPills] = useState([]);
    const [nextPill, setNextPill] = useState({ pillName: '', pillHour: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const { GetTodayPills, pills } = usePills();

    // ENVIAR NOTIFICACIÓN
    const pushNotification = async ({ pillName, pillHour }) => {
        if (takeThePill == false) {
            const alarmNotifData = {
                title: `Debe tomar ${pillName} de las ${pillHour}`,
                message: "Ya es hora de tomar su pastilla",
                channel: "my_channel_id",
                small_icon: "ic_launcher",
            };
            setModalVisible(true);
            ReactAlarm.sendNotification(alarmNotifData);
        }
    }

    // PARAR ALARMA
    useEffect(() => {
        async function getAlarms () {
            const result = await ReactAlarm.getScheduledAlarms();
            if(result.length !== 0) {
                ReactAlarm.stopAlarmSound();
            } 
        }

        getAlarms();
    }, [pillTaked])

    // VERIFICAR CADA X TIEMPO SI ES LA HORA DE LA PASTILLA
    const verifyPillHour = async (taskData) => {
        await new Promise(async () => {
            const { delay } = taskData;


            for (let i = 0; BackgroundJob.isRunning(); i++) {
                let nextPillFormated = nextPillTime.pillHour.substring(1);
                let hourNow = moment().format('LT');
                if (nextPillTime.pillHour[0] == '0') {
                    if (nextPillFormated == hourNow || takeThePill == true) {
                        pushNotification(nextPillTime);
                        takeThePill = true;
                    }

                } else {
                    if (hourNow == nextPillFormated || takeThePill == true) {
                        pushNotification(nextPillTime);
                        takeThePill = true;
                    }
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
        const todayPillsResult = await GetTodayPills();
        setTodayPills(todayPillsResult.todayPills);
        setNextPill(todayPillsResult.nextPillComplete);

        if (todayPillsResult.nextPillComplete != undefined)
            nextPillTime = todayPillsResult.nextPillComplete;

        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true);
        callPills();
    }, [pills, isFocused, changeReload])

    const goToCreatePill = () => {
        navigation.navigate('NewPill')
    }

    const handleTakeThePill = () => {
        takeThePill = false;
    }


    useEffect(() => {

        async function bluetooth() {
            // Iniciar modulo bluetooth de la libreria
            await BleManager.start({ showAlert: true }).then(() => {
                console.info("Libreria iniciada...");
            });
            await checkBT_device();
            if (btCelular) { //si el bluetooth esta encendido y permitido
                await scanDevices();
                await conectar();
                await checkArduino_Connected();
                if (btConectado) {
                } else {
                    console.error("No se pudo conectar con el pastillero");
                }
            } else {
                console.error("El bluetooth no esta encendido");
            }



        }
        bluetooth();

    }, [])




    return (
        <SafeAreaView style={styles.container}>
            <ScrollView scrollEnabled={true}>
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
                                            <PillCard
                                                pill={pill}
                                                todayPills={todayPills}
                                                setPills={setTodayPills}
                                                key={pill._id}
                                                setChangeReload={setChangeReload}
                                                changeReload={changeReload}
                                            />
                                        )
                                    })}
                                </View>
                            </View>
                        }
                    </View>
                }
                <View style={styles.pillsButtons}>
                    <TouchableOpacity onPress={goToCreatePill} style={styles.newPillButton}>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Nueva pastilla</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Debes tomar la pastilla {nextPillTime.pillName} de las {nextPillTime.pillHour}</Text>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {pillTaked = true; setModalVisible(false)}}
                                >
                                    <Text style={styles.textStyle}>Ya la tomé!</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={styles.backgroundModal}></View>
                    </Modal>

                </View>
                <View>
                    <TouchableOpacity
                        style={styles.newPillButton}
                        title="Mostrar potencia antena"
                        onPress={() => showRSSI()}
                    >
                        <Text style={styles.textStyle}>Mostrar potencia antena</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
        textAlign: "center"
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 30,
        marginTop: 30,
        // position: 'absolute',
        // top: 100
    },
    newPillButton: {
        backgroundColor: "#1F547E",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginLeft: 40
    }
})