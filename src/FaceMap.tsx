import { Face, Point } from '@react-native-ml-kit/face-detection';
import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

function rotateFrame(frame) {
    return {
        top: frame.left,
        left: frame.top,
        width: frame.height,
        height: frame.width,
    };
}

function rotatePoint(point) {
    return { x: point.y, y: point.x };
}

function shownDimensionsPortrait(screenWidth, imageWidth, imageHeight) {
    const shownHeight = screenWidth;
    const shownWidth = (imageWidth / imageHeight) * screenWidth;

    return {
        width: shownWidth,
        height: shownHeight,
    };
}

function scalePointPortrait(screenWidth, imageWidth, imageHeight, point) {
    const shown = shownDimensionsPortrait(screenWidth, imageWidth, imageHeight);
    const xOffset = (screenWidth - shown.width) / 2;

    return {
        x: (shown.width / imageWidth) * point.x + xOffset,
        y: (shown.height / imageHeight) * point.y,
    };
}

function scalePoint(imageWidth, imageHeight, screenWidth) {
    return function scaledPoint(point) {
        const portrait = imageHeight > imageWidth;

        if (portrait) {
            return scalePointPortrait(screenWidth, imageWidth, imageHeight, point);
        }

        return rotatePoint(
            scalePointPortrait(screenWidth, imageHeight, imageWidth, rotatePoint(point)),
        );
    };
}

function scaleFramePortrait(screenWidth, imageWidth, imageHeight, frame) {
    const shown = shownDimensionsPortrait(screenWidth, imageWidth, imageHeight);
    const point = scalePointPortrait(screenWidth, imageWidth, imageHeight, {
        x: frame.left,
        y: frame.top,
    });

    return {
        left: point.x,
        top: point.y,
        width: (shown.width / imageWidth) * frame.width,
        height: (shown.height / imageHeight) * frame.height,
    };
}

function scaleFrame(imageWidth, imageHeight, screenWidth) {
    return function scaledFrame(frame) {
        if (!frame) {
            return;
        }

        const portrait = imageHeight > imageWidth;

        if (portrait) {
            return scaleFramePortrait(screenWidth, imageWidth, imageHeight, frame);
        }

        return rotateFrame(
            scaleFramePortrait(screenWidth, imageHeight, imageWidth, rotateFrame(frame)),
        );
    };
}

const FaceMap = ({ face, width, height, showLandmarks, showContours, showFrame, lipColor }) => {
    const screen = useWindowDimensions();
    const scaledFrame = scaleFrame(width, height, screen.width);
    const scaledPoint = scalePoint(width, height, screen.width);

    const { landmarks, contours } = face;
    const frame = scaledFrame(face.frame);

    function pointsToPath(points) {
        return points
            .map(scaledPoint)
            .map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'} ${x} ${y} `)
            .join(' ') + 'Z'; // Closing the path with 'Z' to fill the area
    }

    // Define lip contours
    const lipContours = [
        'upperLipTop',
        'upperLipBottom',
        'lowerLipTop',
        'lowerLipBottom',
    ];

    return (
        <Svg style={styles.container} width={width} height={height}>
            {showFrame && (
                <Rect
                    stroke="white"
                    fill="transparent"
                    strokeWidth={2}
                    strokeOpacity={0.75}
                    width={frame.width}
                    height={frame.height}
                    x={frame.left}
                    y={frame.top}
                />
            )}

            {showLandmarks &&
                landmarks &&
                Object.entries(landmarks).map(([key, landmark]) => {
                    const { x, y } = scaledPoint(landmark.position);

                    return <Circle key={key} r={3} fill="yellow" x={x} y={y} />;
                })}

            {
                contours &&
                Object.entries(contours).map(([key, contour]) => {
                    const points = contour.points;
                    const isLipContour = lipContours.includes(key);
                    const strokeColor = isLipContour ? lipColor : 'white';

                    if (isLipContour) {
                        return (
                            <React.Fragment key={key}>
                                <Path
                                    d={pointsToPath(points)}
                                    fill={lipColor} // Transparent color for lips
                                    stroke="transparent"
                                />
                                {/* {points.map((point, pointId) => {
                                    const { x, y } = scaledPoint(point);

                                    return (
                                        <Circle
                                            key={`${pointId}-${x}-${y}`}
                                            x={x}
                                            y={y}
                                            r={2}
                                            fill={isLipContour ? lipColor : 'skyblue'}
                                            opacity={0.5}
                                        />
                                    );
                                })} */}

                                <Path
                                    d={pointsToPath(points)}
                                    fill="transparent"
                                    strokeWidth={2}
                                    stroke={strokeColor}
                                    strokeOpacity={0.5}
                                />
                            </React.Fragment>
                        );
                    }


                })}

            {/* {showContours &&
                contours &&
                Object.entries(contours).map(([key, contour]) => {
                    const points = contour.points;
                    const isLipContour = lipContours.includes(key);

                    if (isLipContour) {
                        return (
                            <React.Fragment key={key}>
                                <Path
                                    d={pointsToPath(points)}
                                    fill={lipColor} // Transparent color for lips
                                    stroke="transparent"
                                />
                            </React.Fragment>
                        );
                    }

                    return (
                        <React.Fragment key={key}>
                            {points.map((point, pointId) => {
                                const { x, y } = scaledPoint(point);

                                return (
                                    <Circle
                                        key={`${pointId}-${x}-${y}`}
                                        x={x}
                                        y={y}
                                        r={2}
                                        fill="skyblue"
                                        opacity={0.5}
                                    />
                                );
                            })}

                            <Path
                                d={pointsToPath(points)}
                                fill="transparent"
                                strokeWidth={2}
                                stroke="white"
                                strokeOpacity={0.5}
                            />
                        </React.Fragment>
                    );
                })} */}
        </Svg>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
});

export default FaceMap;
