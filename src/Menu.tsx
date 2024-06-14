
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'


const Menu = () => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* <TouchableOpacity onPress={() => navigation.navigate('CameraScreen')}>
                <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CameraKitScreen')}>
                <Text>CameraKitScreen</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => navigation.navigate('FaceDetectionScreen')}>
                <Text>FaceDetectionScreen</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('FaceLipsColor')}>
                <Text>FaceLipsColor</Text>
            </TouchableOpacity>

        </View>

    )
}
export default Menu;

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
