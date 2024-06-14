import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Animated, StatusBar, Switch, Button } from 'react-native';

import { Camera, CameraApi, CameraType, Orientation } from 'react-native-camera-kit';
import FaceDetection from '@react-native-ml-kit/face-detection';
import { launchImageLibrary } from 'react-native-image-picker';
import FaceMap from './FaceMap';

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

const ChooseImageButton = ({ onChoose }) => {
    const handlePress = async () => {
        const imageResult = await launchImageLibrary({
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
        });

        if (imageResult.didCancel || !imageResult.assets || imageResult.assets.length === 0) {
            return;
        }

        const asset = imageResult.assets[0];
        const currentImage = {
            path: asset.uri,
            width: asset.width,
            height: asset.height,
        };

        onChoose(currentImage);
    };

    return <Button title="Choose an Image" onPress={handlePress} />;
};

const OptionSwitch = ({ value, onChange, label }) => {
    return (
        <View style={styles.switchContainer}>
            <Switch
                value={value}
                onValueChange={onChange}
                accessibilityLabel={label}
            />
            <Text style={styles.switchLabel}>{label}</Text>
        </View>
    );
};

const PreviewImage = ({ source }) => {
    return <Image source={{ uri: source }} style={styles.image} />;
};

const FaceDetectionScreen = ({ onBack }) => {
    const [image, setImage] = useState(null);
    const [faces, setFaces] = useState([]);
    const [showFrame, setShowFrame] = useState(true);
    const [showLandmarks, setShowLandmarks] = useState(false);
    const [showContours, setShowContours] = useState(false);
    const [lipColor, setLipColor] = useState('rgba(241,40,64,0.5)'); // Default color for lips

    const handleChoose = async (currentImage) => {
        setImage(currentImage);

        const result = await FaceDetection.detect(currentImage.path, {
            landmarkMode: 'all',
            contourMode: 'all',
        });

        setFaces(result);
    };

    return (
        <View style={styles.container}>
            <ChooseImageButton onChoose={handleChoose} />

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
        </View>
    );
};

export default FaceDetectionScreen;

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
    imageContainer: {
        marginTop: 15,
        marginBottom: 20,
    },
    face: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderRadius: 5,
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
    image: {
        aspectRatio: 1,
        width: '100%',
        resizeMode: 'contain',
        backgroundColor: 'black',
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
