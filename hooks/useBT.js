import { useEffect, useState } from 'react'
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from "convert-string";

let btCelular = false; //bt celular esta enacendido?
let btConectado = false; //bt celular y arduino estan contactados?
const ID_HM10 = '50:33:8B:13:5D:01'; //ID del bluetooth del arduino
let boolFindSmartPillbox = false; //bool determina si se busca o no el pastillero
const Delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const useBT = () => {
    const [isEnabled, setIsEnabled] = useState(false); //switch state
    const toggleSwitch = () => setIsEnabled(previousState => !previousState); //switch state

    function findSmartPillbox(isEnabled) {
        if (!isEnabled) { //switch no activado
            boolFindSmartPillbox = false; //No se buscara el pastillero
        } else { //switch activado
            if (!btConectado) { //antes verificar que el celular y pastillero esten contectados
                console.log("El celular y pastillero deben estar conectados!");
                return;
            } else {
                boolFindSmartPillbox = true; //Si se se buscara el pastillero
            }
        }
    }

    //1- Funcion Comprobar si el bluetooth del celular esta encendido y permitido
    async function checkBT_device() {
        await BleManager.enableBluetooth()
            .then(() => {
                btCelular = true;
                console.info("El bluetooth ya esta encendido");
            })
            .catch((error) => {
                btCelular = false;
                console.info("El usuario no permite activar el bluetooth");
                console.error(error);
            });
    }

    //2- Funcion escanear dispositivos en 3seg
    async function scanDevices() {
        await BleManager.scan([], 3, true).then(() => {
            console.info("Empezando escaneo...");
        }); //hacer que escanee hasta que encuentre el pastillero
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
                await BleManager.retrieveServices(ID_HM10)
                // .then(
                //     (peripheralInfo) => {
                //         // Success code
                //         // console.log("Peripheral info:", peripheralInfo);
                //     }
                // );
            })
            .catch((error) => {
                // Failure code
                console.error(error);
                btConectado = false;
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
                btConectado = false;
            }
        });
    }

    // Funcion Apagar BUZZER
    async function apagar() {
        if (!boolFindSmartPillbox) { //Si no se busca el pastillero enviar 0 para que no suene el pastillero
            const data = stringToBytes('0');
            await BleManager.write(
                ID_HM10,
                "0000ffe0-0000-1000-8000-00805f9b34fb",
                "0000ffe1-0000-1000-8000-00805f9b34fb",
                data
            )
                // .then(() => {
                //     // Success code
                //     console.log("Write: " + data);
                // })
                .catch((error) => {
                    console.error(error);
                    btConectado = false;
                    // NOTIFIACION CELULAR DE PASTILLERO DESCONECTADO AQUI
                });
        } else {
            return; //No enviar nada para que el pastillero suene
        }
    }

    function findSmartPillbox(isEnabled) {
        if (!isEnabled) { //switch no activado
            boolFindSmartPillbox = false; //No se buscara el pastillero
        } else { //switch activado
            if (!btConectado) { //antes verificar que el celular y pastillero esten contectados
                console.log("El celular y pastillero deben estar conectados!");
                return;
            } else {
                boolFindSmartPillbox = true; //Si se se buscara el pastillero
            }
        }
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
                if (!btConectado) {
                    console.error("No se puedo conectar con el pastillero");
                    btConectado = false;
                }
            } else {
                console.error("El bluetooth no esta encendido");
                btConectado = false;
            }
        }
        bluetooth();
        console.log('working')
    }, [])

    return { findSmartPillbox, isEnabled, toggleSwitch }
}

export default useBT;