// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians) {
    return radians * 180 / Math.PI;
};


export function clampAngle(angle) {   //funckja zwracajaca podany kat w przedziałe 0-2PI
    if (angle > 2 * Math.PI)
        return angle - Math.PI * 2;
    if (angle < 0)
        return angle + Math.PI * 2;
    return angle
}


export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image)
        })
        image.src = url;
    })
}


