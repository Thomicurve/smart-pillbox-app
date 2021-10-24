import React, {useContext} from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import TokenContext from '../context/TokenContext'
import useAuthUser from '../hooks/useAuthUser';

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

export default function Navbar({navigation}) {
    const { deleteToken } = useAuthUser();
    const { setToken } = useContext(TokenContext)

    const logoutUser = async () => {
        await deleteToken();
        setTimeout(() => {
            setToken('');
            navigation.navigate('Login');
        }, 1500)
    }

    return (

        <View style={styles.container}>
            <View style={{flexBasis: 200}}>
                <LinearGradient colors={[navGradients.first, navGradients.second]} end={{ x: 1, y: 0 }} style={styles.titleContainer}>
                    <Text style={styles.title}>Smart Pillbox</Text>
                </LinearGradient>
            </View>
            <View>
                <LinearGradient colors={[navGradients.first, navGradients.second]} end={{ x: 1, y: 0 }} style={IconContainerStyles}>
                    <TouchableOpacity onPress={logoutUser}>
                        <MaterialIcons name="exit-to-app" size={30} color="white" />
                    </TouchableOpacity>
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
        paddingRight: 25,
    },
    titleContainer: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 50,
    },
    title: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    },
});
