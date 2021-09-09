import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import GradientColor from '../styles/colors'



export default function Navbar() {
    return (
        
        <View style={styles.container}>
            <View style={styles.gradientContainer}> 
                <LinearGradient colors={[GradientColor.first, GradientColor.second]} end={{ x: 1, y: 0 }} style={styles.titleContainer}>
                    <Text style={styles.title}>Smart Pillbox</Text>
                </LinearGradient>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
    },
    gradientContainer: {
        width: '90%',
        marginHorizontal: 'auto'
    },
    titleContainer: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    title: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    }, 

});