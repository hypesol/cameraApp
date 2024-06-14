
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Animated, StatusBar } from 'react-native';

import { Camera, CameraApi, CameraType, Orientation, } from 'react-native-camera-kit';


const flashImages = {
    on: require('./images/flashOn.png'),
    off: require('./images/flashOff.png'),
    auto: require('./images/flashAuto.png'),
};

const flashArray = [
    {
        mode: 'auto',
        image: flashImages.auto,
    },
    {
        mode: 'on',
        image: flashImages.on,
    },
    {
        mode: 'off',
        image: flashImages.off,
    },
] as const;

const CameraKitScreen = ({ onBack }: { onBack: () => void }) => {

    // const [hasPermission, setHasPermission] = useState(false);
    // useEffect(() => {
    //     const requestPermissions = async () => {
    //         const cameraPermission = await Camera.requestDeviceCameraAuthorization();
    //         const microphonePermission = await Camera.requestDeviceMicrophoneAuthorization();
    //         console.log('cameraPermission', cameraPermission);
    //         setHasPermission(cameraPermission && microphonePermission);
    //     };

    //     requestPermissions();
    // }, []);

    // if (!hasPermission) {
    //     return <View style={styles.container}><Text>Loading...</Text></View>;
    // }


    return (
        <View style={styles.container}>


            <Camera
                actions={{ rightButtonText: 'Done' }}
                style={styles.cameraPreview}

                onBottomButtonPressed={(event) => console.log(event)}
                hideControls={false}
                showFrame={true}
                scanBarcode={true}
            />

        </View>

    );
};

export default CameraKitScreen;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraPreview: {
        flex: 1,
        width: '100%',
    },
});
