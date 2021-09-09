import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions, FlatList } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import GradientColor from '../styles/colors'
import PillsImg from '../assets/illustrations/pills.png'



const ScreensWelcome = [
    {
        id: 'a',
        title: 'Recordatorio de pastillas',
        infoText: 'Planificá tus pastillas y se te notificará cuando tengas que tomarlas.',
        img: PillsImg
    },
    {
        id: 'b',
        title: 'Historial de pastillas',
        infoText: 'Monitoreá tu calendario y observa si olvidaste tomar alguna pastilla.',
        img: PillsImg
    }
];

export default function Welcome({ navigation: {navigate} }) {
    return (
        <View style={WelcomeStyles.container}>
            <FlatList
                data={ScreensWelcome}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={true}
                renderItem={({ item }) => (
                    <LinearGradient style={WelcomeStyles.welcomeTextContainer} colors={[GradientColor.first, GradientColor.second]}>
                        <Text style={WelcomeStyles.title}>{item.title}</Text>
                        <Image style={WelcomeStyles.illustration} source={item.img} />
                        <Text style={WelcomeStyles.infoText}>{item.infoText}</Text>
                        <Text style={WelcomeStyles.skipButton} 
                            onPress={() => navigate('Register')}>
                                Saltear</Text>
                    </LinearGradient>
                )}
            />
        </View>
    );
};

const { width } = Dimensions.get('window');

const WelcomeStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: "#152028"
    },
    welcomeTextContainer: {
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        paddingVertical: 35,
        width,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    illustration: {
        width: 250,
        height: 250,
        resizeMode: 'stretch',
        marginHorizontal: 'auto'
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50,
        width,
    },
    infoText: {
        fontSize: 20,
        color: "#fff",
        textAlign: 'center',
        marginTop: 80,
        width,
        paddingHorizontal: 10
    },
    skipButton: {
        color: "#fff",
        textAlign: "left",
        backgroundColor: "#152028",
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        fontSize: 15,
        position: 'absolute',
        right: 15,
        bottom: 20
    }

})