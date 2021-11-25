import React, { useState, useContext } from 'react'
import {
    View, Text, StyleSheet, TextInput,
    ToastAndroid, FlatList, TouchableOpacity, Image, ActivityIndicator, SafeAreaView, ScrollView
} from 'react-native'
import renderSmartPillbox from '../assets/illustrations/render-pastillero.png';
import TokenContext from '../context/TokenContext';
import DateTimePicker from '@react-native-community/datetimepicker'
import { EditPills } from '../services/PillsServices'


const positionSelectedColor = '#F2D06B';
const positionDisabledColor = '#948352';



import useForm from '../hooks/useForm';


const days = [
    {
        key: 1,
        letters: 'L',
        firstChange: false
    },
    {
        key: 2,
        letters: 'M',
        firstChange: false
    },
    {
        key: 3,
        letters: 'X',
        firstChange: false
    },
    {
        key: 4,
        letters: 'J',
        firstChange: false
    },
    {
        key: 5,
        letters: 'V',
        firstChange: false
    },
    {
        key: 6,
        letters: 'S',
        firstChange: false
    },
    {
        key: 7,
        letters: 'D',
        firstChange: false
    }
]


export default function NewPill({ route, navigation: { navigate } }) {

    const { token } = useContext(TokenContext);
    const [loading, setLoading] = useState(false);
    const [activateTimePicker, setActivateTimePicker] = useState(false);
    const [amount, setAmount] = useState(0);
    const [pillName, setPillName] = useState('');
    const {
        changeDisabledButton,
        handleHour,
        handleTimePicker,
        handlePillName,
        handleAmount,
        hour,
        pillDays,
        dateSelected,
        handlePosition,
        position } = useForm({ setActivateTimePicker, setPillName, setAmount });

    const { pill } = route.params;

    const uploadPill = async () => {
        setLoading(true);
        const dataObj = {
            pillName,
            repeat: parseInt(pillDays.join('')),
            pillHour: hour == '10:00 PM' ? '' : hour.length == 7 ? '0'.concat(hour) : hour,
            amount,
            position
        };
        try {
            const result = await EditPills(token, pill._id, dataObj);
            if (result.message !== 'pill updated') {
                ToastAndroid.show(`${result.message}`, ToastAndroid.SHORT, ToastAndroid.TOP);
            } else {
                ToastAndroid.show(`Pastilla actualizada!`, ToastAndroid.SHORT, ToastAndroid.TOP);
                setTimeout(() => {
                    navigate('Home');
                }, 1000)
            }
        } catch (error) {
            console.error(error);
            alert('Error subiendo la pastillas');
        }
        setLoading(false);
    }


    const navigateToHome = () => navigate('Home');

    return (
        <SafeAreaView style={styles.containerStyles}>
            <ScrollView>

                {loading &&
                    <View style={{
                        backgroundColor: '#000', opacity: 0.8,
                        width: '100%', position: 'absolute', left: 0, top: 0, zIndex: 100, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ActivityIndicator size="large"
                            color="#fff"
                            style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                        <Text style={{ color: '#fff', fontSize: 22, marginTop: 15 }}>Subiendo pastilla...</Text>
                    </View>
                }
                <Text style={styles.newPillTitle}>Editar pastilla {pill.pillName}</Text>
                <View style={styles.inputsContainer}>
                    <TextInput
                        placeholder="Nombre de la pastilla"
                        style={styles.inputs}
                        onChangeText={handlePillName}
                        placeholderTextColor={'#ccc'}
                        selectionColor={'#fff'}
                    />
                    <View style={styles.hourAndAmount}>
                        <View>
                            <Text style={styles.middleInputTitles}>Horario: {pill.pillHour}</Text>
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
                            <Text style={styles.middleInputTitles}>Cantidad: {pill.amount}</Text>
                            <TextInput
                                style={styles.amountInput}
                                placeholderTextColor={'#ccc'}
                                placeholder='1,2,3...'
                                keyboardType="numeric"
                                onChangeText={handleAmount}
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
                                            onPress={() => {
                                                changeDisabledButton(item.key)
                                                item.firstChange = true;
                                            }}
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
                        <Text style={styles.daysTitle}>Posición de la pastilla</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', position: 'relative', marginBottom: -20, marginTop: -55 }}>
                            <Image style={{ width: 400, height: 270 }} source={renderSmartPillbox} />
                            <TouchableOpacity
                                style={[styles.pillSlot, { left: 60, backgroundColor: position == 1 ? positionSelectedColor : positionDisabledColor }]}
                                onPress={() => handlePosition(1)}></TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.pillSlot, { left: 120, backgroundColor: position == 2 ? positionSelectedColor : positionDisabledColor, }]}
                                onPress={() => handlePosition(2)}></TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.pillSlot, { left: 180, backgroundColor: position == 3 ? positionSelectedColor : positionDisabledColor, }]}
                                onPress={() => handlePosition(3)}></TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.pillSlot, { left: 240, backgroundColor: position == 4 ? positionSelectedColor : positionDisabledColor, }]}
                                onPress={() => handlePosition(4)}></TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', display: 'flex', justifyContent: 'space-around', flexDirection: 'row', marginTop: -20 }}>
                            <TouchableOpacity style={styles.actionButtons} onPress={navigateToHome}>
                                <Text style={styles.actionTexts}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButtons} onPress={uploadPill}>
                                <Text style={styles.actionTexts}>Actualizar Pastilla</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        position: 'absolute',
        top: 155
    },
    containerStyles: {
        backgroundColor: '#072F4E',
        flex: 1
    },
    newPillTitle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 20,
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
        textAlign: 'center'
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
        marginTop: 20,
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