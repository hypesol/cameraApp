import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import FaceMap from './FaceMap';
import { Camera } from 'react-native-camera-kit';
import FaceDetection from '@react-native-ml-kit/face-detection';

const FaceLipsColor = ({ onBack }) => {
    const [image, setImage] = useState(null);
    const [faces, setFaces] = useState([]);
    const [showFrame, setShowFrame] = useState(true);
    const [showLandmarks, setShowLandmarks] = useState(false);
    const [showContours, setShowContours] = useState(false);
    const [lipColor, setLipColor] = useState('rgba(241,40,64,0.5)'); // Default color for lips

    const cameraRef = useRef(null);

    useEffect(() => {
        // startCamera();
    }, []);
    const PreviewImage = ({ source }) => {
        return <Image source={{ uri: source }} style={styles.image} />;
    };
    const startCamera = async () => {
        try {
            const isAuthorized = await Camera.checkDeviceCameraAuthorizationStatus();
            if (!isAuthorized) {
                const granted = await Camera.requestDeviceCameraAuthorization();
                if (!granted) {
                    throw new Error('Camera permission not granted');
                }
            }

            await cameraRef.current.start({
                cameraType: 'front',
                flashMode: 'off',
                zoom: 0,
                maxZoom: 10,
                torchMode: 'off',
                resetFocusWhenMotionDetected: true,
            });
        } catch (error) {
            console.error('Failed to start camera:', error);
        }
    };

    const handleColorChange = (color) => {
        console.log("COLOR");
        setLipColor(color);
    };

    const takePicture = async () => {
        console.log("TP");
        try {
            const imageData = await cameraRef.current.capture();
            const { uri, width, height } = imageData;
            setImage({ path: uri, width, height });
            await detectFaces(uri);
        } catch (error) {
            console.error('Failed to take picture:', error);
        }
    };

    const detectFaces = async (imagePath) => {
        try {
            const result = await FaceDetection.detect(imagePath, {
                landmarkMode: 'all',
                contourMode: 'all',
            });
            console.log('Face detection result:', result);
            if (result.length === 0) {
                throw new Error('No faces detected');
            }
            setFaces(result);
        } catch (error) {
            console.error('Face detection failed:', error);
        }
    };

    return (
        <View style={styles.container}>
            {!image && (
                <>
                    <View style={styles.cameraContainer}>
                        <Camera
                            ref={cameraRef}
                            style={styles.cameraPreview}
                            cameraType={'front'}
                            flashMode={'off'}
                            resetFocusWhenMotionDetected
                            zoom={0}
                            maxZoom={10}
                            torchMode="off"
                        />
                    </View>
                    <TouchableOpacity onPress={() => takePicture()} style={styles.captureButton}>
                        <Text style={styles.captureButtonText}>Capture</Text>
                    </TouchableOpacity>
                </>
            )}


            {/* <View style={styles.colorPicker}>
                <Text>Select Lip Color:</Text>
                <TouchableOpacity onPress={() => handleColorChange('rgba(153,88,106, 0.5)')} style={[styles.colorButton, { backgroundColor: 'rgb(153,88,106)' }]} />
                <TouchableOpacity onPress={() => handleColorChange('rgba(241,40,64, 0.5)')} style={[styles.colorButton, { backgroundColor: 'rgb(241,40,64)' }]} />
                <TouchableOpacity onPress={() => handleColorChange('rgba(247,190,174, 0.5)')} style={[styles.colorButton, { backgroundColor: 'rgb(247,190,174)' }]} />
            </View> */}

            {image && (
                <View style={styles.imageContainer}>
                    <PreviewImage source={image.path} />

                    {faces.map(face => (
                        <FaceMap
                            key={face.trackingId || Math.random()}
                            face={face}
                            width={image.width}
                            height={image.height}
                            showFrame={showFrame}
                            showContours={showContours}
                            showLandmarks={showLandmarks}
                            lipColor={lipColor} // Pass the lip color to FaceMap
                        />
                    ))}

                    {/* <OptionSwitch
                        label="Show Frame"
                        value={showFrame}
                        onChange={setShowFrame}
                    />
                    <OptionSwitch
                        label="Show Landmarks"
                        value={showLandmarks}
                        onChange={setShowLandmarks}
                    />
                    <OptionSwitch
                        label="Show Contours"
                        value={showContours}
                        onChange={setShowContours}
                    /> */}

                    <View style={styles.colorPicker}>
                        <Text>Select Lip Color:</Text>
                        <TouchableOpacity onPress={() => setLipColor('rgba(153,88,106, 0.5)')} style={[styles.colorButton, { backgroundColor: 'rgb(153,88,106)' }]} />
                        <TouchableOpacity onPress={() => setLipColor('rgba(241,40,64, 0.5)')} style={[styles.colorButton, { backgroundColor: 'rgb(241,40,64)' }]} />
                        <TouchableOpacity onPress={() => setLipColor('rgba(247,190,174, 0.5)')} style={[styles.colorButton, { backgroundColor: 'rgb(247,190,174)' }]} />
                    </View>
                </View>
            )}
            {/* {image && faces && faces.length > 0 && (
                <FaceMap
                    key={faces[0]?.trackingId || Math.random()}
                    face={faces[0]}
                    width={image.width}
                    height={image.height}
                    showFrame={showFrame}
                    showContours={showContours}
                    showLandmarks={showLandmarks}
                    lipColor={lipColor}
                />
            )} */}
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
        backgroundColor: 'red'
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
    captureButton: {
        margin: 20,
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
    captureButtonText: {
        color: 'white',
        fontSize: 18,
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
    imageContainer: {
        marginTop: 15,
        marginBottom: 20,
    },
    image: {
        aspectRatio: 1,
        width: '100%',
        resizeMode: 'contain',
        backgroundColor: 'black',
    },
});

export default FaceLipsColor;
