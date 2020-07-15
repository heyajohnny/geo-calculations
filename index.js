/**
* Input:
* p1Lat: latitude for position 1
* p1Lng: longitude for position 1
* p2Lat: latitude for position 2
* p2Lng: longitude for position 2
* p1x: meters away from unknown position (x direction)
* p1y: meters away from unknown position (y direction)
* angle: rotation in degrees (clockwise=negative. conterclockwise=positive). origin of rotation = p1
* Output:
* p2x: x position in meters, relative to p1
* p2y: y position in meters, relative to p1
*/
export function calculateXYInMetersOfPoint2(p1Lat, p1Lng, p2Lat, p2Lng, p1x, p1y, angle) {
	//convert meters to kilometers
	p1x = p1x / 1000;
	p1y = p1y / 1000;

	const latMeanRad = .5 * (p2Lat + p1Lat) * Math.PI / 180;

	const dLat = p2Lat - p1Lat;
	const dLng = p2Lng - p1Lng;

	const k1 = 111.13209 - 0.56605 * Math.cos(2 * latMeanRad) + 0.00120 * Math.cos(4 * latMeanRad);
	const k2 = 111.41513 * Math.cos(latMeanRad) - 0.09455 * Math.cos(3 * latMeanRad) + 0.00012 * Math.cos(5 * latMeanRad);

	const dx = k2 * dLng;
	const dy = k1 * dLat;

	const angleRad = -angle * Math.PI / 180;

	const p2x = (p1x + dx * Math.cos(angleRad) - dy * Math.sin(angleRad)) * 1000;
	const p2y = (p1y + dx * Math.sin(angleRad) + dy * Math.cos(angleRad)) * 1000;

	return {x: p2x, y: p2y};
}

/**
* Input:
* p1Lat: latitude for position 1
* p1Lng: longitude for position 1
* p1x: meters away from unknown position (x direction)
* p1y: meters away from unknown position (y direction)
* p2x: meters away from unknown position (x direction)
* p2y: meters away from unknown position (y direction)
* angle: rotation in degrees (clockwise=negative. conterclockwise=positive). origin of rotation = p1
* Output:
* p2Lat: latitude for position 2
* p2Lng: longitude for position 2
*/
export function calculateLatLngOfPoint2(p1Lat, p1Lng, p1x, p1y, p2x, p2y, angle) {
	//convert meters to kilometers
	p1x = p1x / 1000;
	p1y = p1y / 1000;
	p2x = p2x / 1000;
	p2y = p2y / 1000;

	//Assumptions
	const earthRadius = 6371.0; //km

	//Convert angle to radians
	const angleRad = -angle * Math.PI / 180;

	//Determine difference position in kilometers
	const dx = (p2x - p1x) * Math.cos(angleRad) + (p2y - p1y) * Math.sin(angleRad);
	const dy = -(p2x - p1x) * Math.sin(angleRad) + (p2y - p1y) * Math.cos(angleRad);


	const dLat = dy / earthRadius;
	const dLng = dx / (earthRadius * Math.cos(p1Lat * Math.PI / 180));

	const p2Lat = p1Lat + dLat * 180 / Math.PI;
	const p2Lng = p1Lng + dLng * 180 / Math.PI;

	return {lat: p2Lat, lng: p2Lng};
}

/**
* Input:
* cx: Origin of rotation x
* cy: Origin of rotation y
* x: current position of point 2 x
* y: current position of point 2 y
* angle: rotation to apply 
* Output:
* x: new position of point 2 x, after applying the rotation
* y: new position of point 2 y, after applying the rotation
*/
export function calculateXYOfPoint2(cx, cy, x, y, angle) {
	let radians = (Math.PI / 180) * angle,
		cos = Math.cos(radians),
		sin = Math.sin(radians),
		nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
		ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
	return {x: nx, y: ny};
}

/**
* Input:
* cx: Origin of rotation x
* cy: Origin of rotation y
* ex: Point 2 x
* ey: Point 2 y
* Output:
* Rotation / angle in degrees
*/
export function calculateRotationBetweenTwoPoints(cx, cy, ex, ey) {
	const dy = ey - cy;
	const dx = ex - cx;
	let theta = Math.atan2(dy, dx); // range (-PI, PI]
	theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
	if (theta < 0) theta = 360 + theta; // range [0, 360)
	return theta;
}