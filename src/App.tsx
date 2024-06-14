import { NavigationContainer, useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Menu from './Menu'
import CameraScreen from './CameraScreen'
import CameraKitScreen from './CameraKitScreen'
import FaceDetectionScreen from './FaceDetection'
import FaceLipsColor from './FaceLipsColor'
import { PermissionsPage } from './PermissionsPage'
import { MediaPage } from './MediaPage'
import { CameraPage } from './CameraPage'
import { CodeScannerPage } from './CodeScannerPage'
import type { Routes } from './Routes'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PermissionsAndroid, StyleSheet, Text } from 'react-native'
import { DevicesPage } from './DevicesPage'

const Stack = createNativeStackNavigator<Routes>()
const App = () => {
    // const cameraPermission = Camera.getCameraPermissionStatus()
    // const microphonePermission = Camera.getMicrophonePermissionStatus()

    // console.log(`Re-rendering Navigator. Camera: ${cameraPermission} | Microphone: ${microphonePermission}`)
    // const device = useCameraDevice('back')

    return (

        <NavigationContainer>
            <GestureHandlerRootView style={styles.root}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        statusBarStyle: 'dark',
                        animationTypeForReplace: 'push',
                    }}
                >
                    <Stack.Screen name="Menu" component={Menu} />
                    <Stack.Screen name="CameraScreen" component={CameraScreen} />
                    <Stack.Screen name="CameraKitScreen" component={CameraKitScreen} />
                    <Stack.Screen name="FaceDetectionScreen" component={FaceDetectionScreen} />
                    <Stack.Screen name="FaceLipsColor" component={FaceLipsColor} />


                </Stack.Navigator>
            </GestureHandlerRootView>
        </NavigationContainer>
    )
}
export default App;

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
})
