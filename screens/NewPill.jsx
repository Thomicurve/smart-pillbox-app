import React, { useState, useContext } from 'react'
import { View, Text, StyleSheet, TextInput, ToastAndroid, FlatList, TouchableOpacity } from 'react-native'
import TokenContext from '../context/TokenContext';
import DateTimePicker from '@react-native-community/datetimepicker'
import { UploadPills } from '../services/PillsServices'
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
        if (result.message !== 'Pastilla cargada con éxito') {
            return ToastAndroid.show(`${result.message}`, ToastAndroid.SHORT, ToastAndroid.TOP);
        } else {
            ToastAndroid.show(`${result.message}`, ToastAndroid.SHORT, ToastAndroid.TOP);
            setTimeout(() => {
                navigate('Inicio');
            }, 2500)
        }
    }

    const navigateToHome = () => navigate('Inicio');

    return (
        <View style={styles.containerStyles}>
            <Text style={styles.newPillTitle}>Nueva pastilla</Text>
            <View style={styles.inputsContainer}>
                <TextInput
                    placeholder="Nombre de la pastilla"
                    style={styles.inputs}
                    onChangeText={value => setPillName(value)}
                    placeholderTextColor={'#ccc'}
                    selectionColor={'#fff'}
                />
                <View style={styles.hourAndAmount}>
                    <View>
                        <Text style={styles.middleInputTitles}>Horario</Text>
                        <TouchableOpacity
                            style={styles.hourButton}
                            onPress={handleTimePicker}>
                                <Text style={styles.hourText}>{hour}</Text>
                        </TouchableOpacity>
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

                    <View>
                        <Text style={styles.middleInputTitles}>Cantidad</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholderTextColor={'#ccc'}
                            placeholder='1,2,3...'
                            keyboardType="numeric"
                            onChangeText={(value) => setAmount(value)}
                        />
                    </View>

                </View>


                <View>
                    <Text style={styles.daysTitle}>Dias que va a tomar la pastilla</Text>
                    <View >
                        <FlatList
                            style={styles.FlatList}
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
                <View style={{ width: '100%', display: 'flex', justifyContent: 'space-around', flexDirection: 'row', marginTop: 50 }}>
                    <TouchableOpacity style={styles.actionButtons} onPress={navigateToHome}>
                        <Text style={styles.actionTexts}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButtons} onPress={uploadPill}>
                        <Text style={styles.actionTexts}>Cargar pastilla</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerStyles: {
        backgroundColor: '#072F4E',
        height: '100%',
    },
    newPillTitle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 30,
        marginBottom: 10
    },
    inputs: {
        borderColor: '#fff',
        borderWidth: 2,
        color: '#fff',
        width: '70%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    inputsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: 540,
        width: '96%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        backgroundColor: '#1F547E',
        paddingVertical: 30,
        borderRadius: 10
    },
    hourAndAmount: {
        marginTop: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 20
    },
    middleInputTitles: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 5
    },  
    hourButton: {
        backgroundColor: '#072F4E',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    hourText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    amountInput: {
        borderWidth: 2,
        borderColor: '#fff',
        paddingVertical: 3,
        paddingHorizontal: 15,
        borderRadius: 5,
        color: '#fff',
        textAlign: 'center',
        fontSize: 16
    },
    daysTitle: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    actionButtons: {
        borderRadius: 5,
        backgroundColor: '#3378AD',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    actionTexts: {
        color: '#fff',
        fontWeight: 'bold'
    },
    FlatList: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        width: '100%',
        marginTop: 15
    },
    daysContainer: {
        width: 45,
        display: 'flex',
        marginHorizontal: 2,
        borderWidth: 4,
        borderRadius: 15,
        overflow: 'hidden',
    },
    daysItems: {
        textAlign: 'center',
        paddingVertical: 4,
        fontSize: 20,
        fontWeight: "700",
        color: '#fff',
    },
})