import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'

import RecordCard from '../components/RecordCard';

export default function Records() {

    const [records, setRecords] = useState([{ id: 1 },{ id: 2 },{ id: 3 },{ id: 4 },{ id: 5 },{ id: 6 },{ id: 7 },{ id: 8 },{ id: 9 }]);
    const [dayFiltered, setDayFiltered] = useState('HOY');
    const [dayNumber, setDayNumber] = useState(0);
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const decreaseDay = () => {
        setDayNumber(dayNumber + 1);
    }

    const increaseDay = () => {
        setDayNumber(dayNumber - 1);
    }

    const handleTime = (event, selectedDate) => {
        setDatePickerOpen(false);
        setDayFiltered(moment(selectedDate).format('L'));
        setDayNumber(moment().diff(selectedDate, 'day'));

    }



    useEffect(() => {
        if (dayNumber === 0) setDayFiltered('HOY');
        else setDayFiltered(moment().subtract(dayNumber, 'day').format('L'));

    }, [dayNumber])

    return (
        <SafeAreaView style={styles.container}>
            
                <Text style={styles.title}>Registro de pastillas</Text>
                <Text style={{ textAlign: 'center', color: '#fff', marginTop: 15, fontSize: 17 }}>Formato:
                    <Text style={{ fontWeight: 'bold' }}> MES / DIA / AÑO</Text>
                </Text>
                {
                    dayNumber !== 0
                        ?
                        <View style={styles.filtersTitle2}>
                            <TouchableOpacity onPress={decreaseDay}>
                                <MaterialIcons name="keyboard-arrow-left" color="#fff" size={40} />
                            </TouchableOpacity>
                            <Text style={styles.dayFilterText2}>{dayFiltered}</Text>
                            <TouchableOpacity onPress={increaseDay}>
                                <MaterialIcons name="keyboard-arrow-right" color="#fff" size={40} />
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.filtersTitle}>
                            <TouchableOpacity style={{ marginRight: 50 }} onPress={decreaseDay}>
                                <MaterialIcons name="keyboard-arrow-left" color="#fff" size={40} />
                            </TouchableOpacity>
                            <Text style={styles.dayFilterText}>{dayFiltered}</Text>
                        </View>
                }
                <View style={styles.datePickerContainer}>
                    <TouchableOpacity style={styles.datePicker} onPress={() => setDatePickerOpen(true)}>
                        <MaterialIcons name="date-range" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
                {
                    datePickerOpen &&
                    <DateTimePicker
                        display="calendar"
                        mode="date"
                        locale="es-ES"
                        value={new Date()}
                        onChange={handleTime}
                        maximumDate={new Date()}
                    />
                }

            <ScrollView>
                <View style={styles.recordContainer}>
                    {records.map(record => (
                        <RecordCard key={record.id} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#072F4E',
        flex: 1,
        height: '100%'
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 32,
        textAlign: 'center',
        marginTop: 20
    },
    recordContainer: {
        backgroundColor: '#ccc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 15
    },
    filtersTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30
    },
    dayFilterText: {
        color: '#fff',
        fontSize: 30,
        marginRight: 70
    },
    filtersTitle2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30
    },
    dayFilterText2: {
        color: '#fff',
        fontSize: 30,
    },
    datePickerContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        width: '90%',
        marginBottom: 20,
        marginTop: 15
    },
    datePicker: {
        backgroundColor: '#1F547E',
        borderRadius: 50,
        padding: 8
    }

})
