import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import FaceDetection from '@react-native-ml-kit/face-detection';

const FaceLipsColor = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [showLandmarks, setShowLandmarks] = useState(true);
    const [showContours, setShowContours] = useState(true);
    const [faces, setFaces] = useState([]);
    const [capturedImageUri, setCapturedImageUri] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        const requestPermissions = async () => {
            const cameraPermission = await Camera.requestDeviceCameraAuthorization();
            setHasPermission(cameraPermission);
        };

        requestPermissions();
    }, []);

    const handleCaptureImage = async () => {
        if (cameraRef.current) {
            const image = await cameraRef.current.capture();
            setCapturedImageUri(image.uri);
            const detectedFaces = await handleFacesDetected(image.uri);
            setFaces(detectedFaces);
        }
    };

    const handleFacesDetected = async (uri) => {
        try {
            const detectedFaces = await FaceDetection.detect(uri, {
                landmarkMode: 'all',
                contourMode: 'all',
            });
            return detectedFaces;
        } catch (error) {
            console.error(error);
        }
        return [];
    };

    const renderFaceFeatures = (faces) => {
        if (!faces || faces.length === 0) return null;

        return faces.map((face, index) => {
            const { landmarks, contours } = face;
            const mouthBottom = landmarks?.mouthBottom;

            return (
                <View key={index} style={{ position: 'absolute', zIndex: 1000 }}>
                    {showLandmarks && landmarks && Object.keys(landmarks).map((key, idx) => (
                        <View
                            key={`landmark-${idx}`}
                            style={{
                                position: 'absolute',
                                left: landmarks[key].x,
                                top: landmarks[key].y,
                                width: 5,
                                height: 5,
                                backgroundColor: 'blue',
                            }}
                        />
                    ))}
                    {showContours && contours && Object.keys(contours).map((key, idx) => (
                        Array.isArray(contours[key]) && contours[key].map((point, pIdx) => (
                            <View
                                key={`contour-${key}-${pIdx}`}
                                style={{
                                    position: 'absolute',
                                    left: point.x,
                                    top: point.y,
                                    width: 1,
                                    height: 1,
                                    backgroundColor: 'green',
                                }}
                            />
                        ))
                    ))}
                    {mouthBottom && (
                        <View
                            style={{
                                position: 'absolute',
                                left: mouthBottom.x - 15,
                                top: mouthBottom.y - 10,
                                width: 30,
                                height: 20,
                                backgroundColor: 'rgba(255,0,0,0.5)', // Change to desired lip color
                            }}
                        />
                    )}
                </View>
            );
        });
    };

    // if (!hasPermission) {
    //     return (
    //         <View style={styles.container}>
    //             <Text>Requesting Camera Permissions...</Text>
    //         </View>
    //     );
    // }

    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                {capturedImageUri ? (
                    <Image source={{ uri: capturedImageUri }} style={styles.cameraPreview} resizeMode="contain" />
                ) : (
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
                )}
            </View>
            {capturedImageUri && renderFaceFeatures(faces)}
            <TouchableOpacity style={styles.captureButton} onPress={handleCaptureImage}>
                <Text style={styles.captureButtonText}>Capture</Text>
            </TouchableOpacity>
            <View style={styles.switchContainer}>
                <Switch
                    value={showLandmarks}
                    onValueChange={setShowLandmarks}
                    accessibilityLabel="Show Landmarks"
                />
                <Text style={styles.switchLabel}>Show Landmarks</Text>
                <Switch
                    value={showContours}
                    onValueChange={setShowContours}
                    accessibilityLabel="Show Contours"
                />
                <Text style={styles.switchLabel}>Show Contours</Text>
            </View>
        </View>
    );
};

export default FaceLipsColor;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraContainer: {
        flex: 1,
        width: '100%',
    },
    cameraPreview: {
        flex: 1,
        width: '100%',
    },
    captureButton: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{ translateX: -50 }],
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    captureButtonText: {
        color: 'white',
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    switchLabel: {
        color: '#333',
        marginLeft: 15,
    },
});
