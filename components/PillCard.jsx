import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';


export default function PillCard({pill, setPills, todayPills}) {

    const deletePills = (pillID) => {
        const pillsWithoutSelected = todayPills.filter(({_id}) => _id !== pillID);
        setPills(pillsWithoutSelected)
    }


    return (
        <View style={styles.pillCard}>
            <Text style={styles.pillName}>{pill.pillName}</Text>
            <Text style={styles.pillHour}>{pill.pillHour}</Text>
            <Text style={styles.pillAmount}>{pill.takenToday} / {pill.amount}</Text>
            <TouchableOpacity onPress={() => deletePills(pill._id)}><MaterialIcons  name="delete" color="#fff" size={24} /></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
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
})

