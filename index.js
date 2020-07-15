/**
* Input:
* p1Lat: latitude for position 1
* p1Lng: longitude for position 1
* p2Lat: latitude for position 2
* p2Lng: longitude for position 2
* p1x: meters away from p1Lng (x direction)
* p1y: meters away from p1Lat (y direction)
* angle: rotation in degrees (clockwise=negative. conterclockwise=positive). origin of rotation = p1
* Output:
* p2x: x position in meters, relative to p1
* p2y: y position in meters, relative to p1
*/
export function calculateDistanceInMetersBetweenTwoPoints(p1Lat, p1Lng, p2Lat, p2Lng, p1x, p1y, angle) {
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