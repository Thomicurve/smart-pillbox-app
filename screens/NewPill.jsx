import React, { useState, useContext, useRef } from 'react'
import { View, Text, Button, StyleSheet, TextInput, ToastAndroid, FlatList } from 'react-native'
import TokenContext from '../context/TokenContext';
import DateTimePicker from '@react-native-community/datetimepicker'
import {UploadPills} from '../services/PillsServices' 
import moment from 'moment';


const days = [
    {
        key: 1,
        letters: 'L'
    },
    {
        key: 2,
        letters: 'M'
    },
    {
        key: 3,
        letters: 'X'
    },
    {
        key: 4,
        letters: 'J'
    },
    {
        key: 5,
        letters: 'V'
    },
    {
        key: 6,
        letters: 'S'
    },
    {
        key: 7,
        letters: 'D'
    }
]


export default function NewPill({ navigation: { navigate } }) {

    const { token } = useContext(TokenContext);
    const [hour, setHour] = useState('10:00 PM');
    const [activateTimePicker, setActivateTimePicker] = useState(false);
    const [dateSelected, setDateSelected] = useState(new Date());

    const [pillDays, setPillDays] = useState([]);
    const [pillName, setPillName] = useState('');
    const [amount, setAmount] = useState(0);

    const handleTimePicker = () => {
        setActivateTimePicker(true);
    }

    const handleHour = (event, selectedDate) => {
        setActivateTimePicker(false);
        if (!selectedDate) {
            setDateSelected(dateSelected);
            return setHour(hour);
        }
        else {
            setDateSelected(new Date(selectedDate));
            return setHour(moment(selectedDate).format('LT'));
        }
    }

    const changeDisabledButton = (day) => {
        if (pillDays.includes(day)) {
            const removedDay = pillDays.filter((dayItem) => dayItem !== day);
            setPillDays(removedDay);
        } else {
            setPillDays([...pillDays, day]);
        }
    }

    const uploadPill = async () => {
        const dataObj = {
            pillName,
            repeat: parseInt(pillDays.join('')),
            pillHour: hour.length == 7 ? '0'.concat(hour) : hour,
            amount
        };
        const result = await UploadPills(token, dataObj);
        if(result.message !== 'Pastilla cargada con éxito') {
            return ToastAndroid.show(`${result.message}`, ToastAndroid.SHORT, ToastAndroid.TOP);
        } else {
            ToastAndroid.show(`${result.message}`, ToastAndroid.SHORT, ToastAndroid.TOP);
            setTimeout(() => {
                navigate('Home');
            }, 2500)
        }
    }

    const navigateToHome = () => navigate('Home');

    return (
        <View>
            <Text>Nueva pastilla</Text>
            <View>
                <TextInput
                    placeholder="Nombre de la pastilla"
                    style={styles.inputs}
                    onChangeText={value => setPillName(value)}
                />
                <View style={styles.inputsContainer}>
                    <Text>Hora</Text>
                    <Button
                        title={hour}
                        onPress={handleTimePicker}
                    />
                    {
                        activateTimePicker &&
                        <DateTimePicker
                            display="spinner"
                            value={dateSelected}
                            mode="time"
                            is24Hour={false}
                            onChange={handleHour}
                            locale="es-ES"
                        />
                    }

                </View>
                <View style={styles.inputsContainer}>
                    <Text>Cantidad</Text>
                    <TextInput
                        style={styles.inputs}
                        keyboardType="numeric"
                        onChangeText={(value) => setAmount(value)}
                    />
                </View>

                <View>
                    <Text>Dias que va a tomar la pastilla</Text>
                    <Text>{pillDays}</Text>
                    <View >
                        <FlatList
                            data={days}
                            numColumns={7}
                            renderItem={({ item }) =>
                                <View
                                    key={item.key}
                                    style={{ borderColor: pillDays.includes(item.key) ? "#71C25C" : "#C4C4C4", ...styles.daysContainer }}>
                                    <Text
                                        onPress={() => changeDisabledButton(item.key)}
                                        style={{
                                            backgroundColor: pillDays.includes(item.key) ? "#478A6D" : "#717171",
                                            ...styles.daysItems
                                        }}
                                    >
                                        {item.letters}
                                    </Text>
                                </View>
                            }
                        />
                    </View>
                </View>
                <View style={{width: 400, display:'flex', justifyContent:'space-evenly', flexDirection: 'row', marginTop: 20}}>
                    <Button title="Cancelar" onPress={navigateToHome}/>
                    <Button title="Cargar pastilla ✔" onPress={uploadPill}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputs: {
        borderColor: 'red',
        borderWidth: 2,
        width: 200,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    inputsContainer: {
        borderColor: 'blue',
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 10
    },
    daysContainer: {
        width: 45,
        display: 'flex',
        marginHorizontal: 5,
        borderWidth: 5,
        borderRadius: 15,
        overflow: 'hidden',
    },
    daysItems: {
        textAlign: 'center',
        paddingVertical: 4,
        fontSize: 20,
        fontWeight: "700",
        color: '#fff',
    }
})