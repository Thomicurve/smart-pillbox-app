import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TouchableOpacity,
    AppState
} from 'react-native';
import { Header, Colors } from 'react-native/Libraries/NewAppScreen';

import BackgroundJob from 'react-native-background-actions';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));




const options = {
    taskName: 'Example',
    taskTitle: 'Corriendo...🔍',
    taskDesc: 'Analizando pastillas',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#072F4E',
    parameters: {
        delay: 1000,
    },
};


function Example() {
    const [playing, setPlaying] = useState(BackgroundJob.isRunning());

    const taskRandom = async (taskData) => {
        await new Promise(async (resolve) => {
            // For loop with a delay
            const { delay } = taskData;
            let count = 0;
            for (let i = 0; BackgroundJob.isRunning(); i++) {
                if(count >= 5) {
                    console.log('Tomar pastilla!!!');
                } else {
                    count++;
                }
                await sleep(delay);
            }
        });
    };


    useEffect(() => {
        async function handlePlayBackground() {
            if (playing) {
                await BackgroundJob.start(taskRandom, options);
                console.log('Successful start!');
            } else {
                console.log('Stop background service');
                await BackgroundJob.stop();
            }
        }
        handlePlayBackground();
    }, [playing])


    const toggleBackground = () => {
        setPlaying(!playing);
    };

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <Header />
                    <View style={styles.body}>
                        <TouchableOpacity
                            style={{ height: 100, width: 100, backgroundColor: 'red' }}
                            onPress={toggleBackground}></TouchableOpacity>
                        <TouchableOpacity
                            style={{ height: 100, width: 100, backgroundColor: 'blue' }}
                            onPress={toggleBackground}></TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

export default Example;