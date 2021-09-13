import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome'

const IconContainerStyles = {
    borderRadius: 50,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

const navGradients = {
    first: '#1F547E',
    second: '#3378AD'
}

export default function Navbar() {
    return (
        
        <View style={styles.container}>
            <View>
                <LinearGradient colors={[navGradients.first, navGradients.second]} end={{ x: 1, y: 0 }} style={IconContainerStyles}>
                    <Icon
                        onPress={() => alert('This is a button!')}
                        name="bars"
                        color="#fff"
                        size={25}
                    />
                </LinearGradient>
            </View>
            <View>
                <LinearGradient colors={[navGradients.first, navGradients.second]} end={{ x: 1, y: 0 }} style={styles.titleContainer}>
                    <Text style={styles.title}>Smart Pillbox</Text>
                </LinearGradient>
            </View>
            <View> 
                <LinearGradient colors={[navGradients.first, navGradients.second]} end={{ x: 1, y: 0 }} style={IconContainerStyles}>
                    <Icon
                        onPress={() => alert('This is a button!')}
                        name="phone"
                        color="#fff"
                        size={25}
                    />
                </LinearGradient>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        paddingRight: 25
    },
    titleContainer: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 50
    },
    title: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold'
    }, 
});
