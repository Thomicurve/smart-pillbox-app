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

    async function researchPillbox() { //Funcion para intentar volver a conectarse al bt
        let loopScan = setInterval(async () => {
            if (!btConectado) { //si el bluetooth esta desconectado seguir escaneando cada 4seg
                console.info("No se puedo conectar con el pastillero");
                await checkBT_device();
                await scanDevices();
                await conectar();
                await checkArduino_Connected();
            } else { //cuando se conecte, eliminar el loopScan
                clearInterval(loopScan);
                return;
            }
        }, 4000);
    }

    //1- Funcion Comprobar si el bluetooth del celular esta encendido y permitido
    async function checkBT_device() {
        if (!btConectado) {
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
    }

    //2- Funcion escanear dispositivos en 3seg
    async function scanDevices() {
        if (btCelular) {
            await BleManager.scan([], 2, true).then(() => {
                console.info("Empezando escaneo...");
            }); //hacer que escanee hasta que encuentre el pastillero
            await Delay(2000); //esperar 2 segundos
            await BleManager.stopScan().then(() => { //Detener el escaneo
                // ! console.log("Scan stopped");
            });
        } else {
            console.info("Antes de escanear se debe encender el bluetooth.");
        }
    }


    //3- Funcion conectar al arduino
    async function conectar() {
        BleManager.connect(ID_HM10)
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

    //4- Funcion revisar conexion con el celular y el arduino y enviar dato apagar cada 300ms
    async function checkArduino_Connected() {
        await BleManager.isPeripheralConnected(
            ID_HM10,
            []
        ).then((isConnected) => {
            btConectado = isConnected;
            if (isConnected) {
                console.log("Peripheral is connected!");
                btConectado = true;
                let loopApagar = setInterval(async () => { //Blucle apagar cada 300ms
                    if (!btConectado) { //no hacer el blucle si el bt no esta conectado
                        clearInterval(loopApagar);
                        researchPillbox(); //revisar conexion con el arduino
                    } else if (!boolFindSmartPillbox && btConectado == true) { //Si no se busca el pastillero enviar 0 para que no suene el pastillero
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
                    } else if (boolFindSmartPillbox && btConectado == true) { //si se trata del switch buscar pastillero y bt siguen conectados
                        return; //No enviar nada para que el pastillero suene
                    }
                }, 300);
            } else {
                // ! console.error("Peripheral is NOT connected!");
                btConectado = false;
            }
        });
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
                await Delay(1000);
                await conectar();
                await checkArduino_Connected();
                researchPillbox();
            } else {
                console.error("El bluetooth no esta encendido");
                btConectado = false;
            }
        }
        bluetooth();
    }, [])

    return { findSmartPillbox, isEnabled, toggleSwitch }
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

export {useBT, findSmartPillbox};