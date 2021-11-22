import React, { useContext, useState } from 'react'
import {
        Text, StyleSheet, TouchableOpacity,
    ActivityIndicator
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { DeletePills } from '../services/PillsServices';
import TokenContext from '../context/TokenContext';

export default function PillCard({ pill, setPills, todayPills, changeReload, setChangeReload, navigation }) {

    const { token } = useContext(TokenContext);
    const [isLoading, setIsLoading] = useState(false);

    const deletePills = async (pillID) => {
        setIsLoading(true);
        const pillsWithoutSelected = todayPills.filter(({ _id }) => _id !== pillID);
        const deleteResult = await DeletePills(token, pillID);
        setChangeReload(!changeReload);
        setPills(pillsWithoutSelected);

        if (!deleteResult.done) return alert(deleteResult.message);
        setIsLoading(false);
    }

    const goToEdit = () => {
        navigation.navigate('EditPill', {pill});
    }

    return (
        <TouchableOpacity style={styles.pillCard} onPress={goToEdit}>
            <Text style={styles.pillName}>{pill.pillName}</Text>
            <Text style={styles.pillHour}>{pill.pillHour}</Text>
            <Text style={styles.pillAmount}>{pill.takenToday} / {pill.amount}</Text>
            {
                !isLoading ?
                    <TouchableOpacity style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => deletePills(pill._id)}>
                        <MaterialIcons name="delete" color="#fff" size={24} />
                    </TouchableOpacity>
                    :
                    <ActivityIndicator size="small" color="#fff" style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
            }
        </TouchableOpacity>
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
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
})

