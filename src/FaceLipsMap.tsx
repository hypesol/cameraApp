import React from 'react';
import { View, StyleSheet } from 'react-native';

const FaceLipsMap = ({ face, showLandmarks, showContours }) => {
    const renderLips = (landmarks) => {
        if (!landmarks || landmarks.length === 0) return null;

        const lips = landmarks.find(landmark => landmark.type === 'MOUTH');
        if (!lips) return null;

        return (
            <View
                style={{
                    position: 'absolute',
                    left: lips.position.x,
                    top: lips.position.y,
                    width: lips.boundingBox.width,
                    height: lips.boundingBox.height,
                    backgroundColor: 'rgba(255,0,0,0.5)', // Change to desired lip color
                    zIndex: 1000,
                }}
            />
        );
    };

    return (
        <View style={StyleSheet.absoluteFill}>
            {showLandmarks && renderLips(face.landmarks)}
            {showContours && face.contours.map((contour, index) => (
                <View
                    key={index}
                    style={{
                        position: 'absolute',
                        left: contour.position.x,
                        top: contour.position.y,
                        width: contour.boundingBox.width,
                        height: contour.boundingBox.height,
                        borderWidth: 1,
                        borderColor: 'yellow',
                    }}
                />
            ))}
        </View>
    );
};

export default FaceLipsMap;
