
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
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FaceDetectionScreen')}>
                <Text style={styles.btnText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FaceLipsColor')}>
                <Text style={styles.btnText}>Camera</Text>
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
    button: {
        backgroundColor: '#000',
        width: '70%',
        padding: 10,
        marginBottom: 10
    },
    btnText: {
        color: "#fff",
        textAlign: 'center'
    }
})
