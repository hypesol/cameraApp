import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Button, StatusBar, Switch, Text } from 'react-native';
import { launchCamera, MediaTypeOptions } from 'react-native-image-picker';
import FaceMap from './FaceMap';

const FaceLipsColor = ({ onBack }) => {
    const [image, setImage] = useState(null);
    const [faces, setFaces] = useState([]);
    const [showFrame, setShowFrame] = useState(true);
    const [showLandmarks, setShowLandmarks] = useState(false);
    const [showContours, setShowContours] = useState(false);
    const [lipColor, setLipColor] = useState('rgba(241,40,64,0.5)'); // Default color for lips

    useEffect(() => {
        startCamera();
    }, []);

    const startCamera = () => {
        launchCamera(
            {
                mediaType: 'photo', // Capture photo frames
                cameraType: 'front', // Use front camera
                includeBase64: false,
                width: 300, // Adjust as needed
                height: 400, // Adjust as needed
            },
            (response) => {
                if (response.didCancel || !response.assets || response.assets.length === 0) {
                    return;
                }

                const asset = response.assets[0];
                const currentImage = {
                    path: asset.uri,
                    width: asset.width,
                    height: asset.height,
                };

                setImage(currentImage);

                detectFaces(currentImage);
            },
        );
    };

    const detectFaces = async (currentImage) => {
        const result = await FaceDetection.detect(currentImage.path, {
            landmarkMode: 'all',
            contourMode: 'all',
        });

        setFaces(result);
    };

    const handleColorChange = (color) => {
        setLipColor(color);
    };

    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                {image ? (
                    <FaceMap
                        key={faces[0]?.trackingId || Math.random()}
                        face={faces[0]}
                        width={image.width}
                        height={image.height}
                        showFrame={showFrame}
                        showContours={showContours}
                        showLandmarks={showLandmarks}
                        lipColor={lipColor} // Pass the lip color to FaceMap
                    />
                ) : (
                    <TouchableOpacity style={styles.cameraPreview} onPress={startCamera}>
                        <Text style={styles.cameraText}>Tap to Start Camera</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.colorPicker}>
                <Text>Select Lip Color:</Text>
                <TouchableOpacity onPress={() => handleColorChange('rgba(153,88,106, 0.5)')} style={[styles.colorButton, { backgroundColor: 'rgb(153,88,106)' }]} />
                <TouchableOpacity onPress={() => handleColorChange('rgba(241,40,64, 0.5)')} style={[styles.colorButton, { backgroundColor: 'rgb(241,40,64)' }]} />
                <TouchableOpacity onPress={() => handleColorChange('rgba(247,190,174, 0.5)')} style={[styles.colorButton, { backgroundColor: 'rgb(247,190,174)' }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraPreview: {
        width: 300,
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 10,
    },
    cameraText: {
        fontSize: 20,
        color: '#333',
    },
    colorPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    colorButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 10,
    },
});

export default FaceLipsColor;
