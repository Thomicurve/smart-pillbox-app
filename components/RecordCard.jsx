import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import TokenContext from '../context/TokenContext';


export default function RecordCard() {

    const { token } = useContext(TokenContext);



    return (
        <View style={styles.pillCard}>
            <Text style={styles.pillName}>Ibuprofeno</Text>
            <Text style={styles.pillHour}>11/11/2021</Text>
            <Text style={styles.pillAmount}>2</Text>
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