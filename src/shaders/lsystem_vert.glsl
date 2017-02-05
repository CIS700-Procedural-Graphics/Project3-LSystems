uniform sampler2D image;
uniform float xMin;
uniform float xMax;
uniform float yMin;
uniform float yMax;
uniform float zMin;
uniform float zMax;

uniform int time;

varying float h;
varying vec3 n;

void main() {
	float yr = yMax - yMin;


	vec3 p = (modelMatrix * vec4(position, 1.0)).xyz;

	// bend deformation preparation
	float tCoeff = 0.5 * sin(float(time) / 1000.0) + 0.55;


	float y0 = yMax * 0.5 - yMin; // bend center
	float curvature = tCoeff * 3.14 / 4.0 / yr;
	float theta = curvature * (p.y - yMin);
	float ct = cos(theta);
	float st = sin(theta);
	

	// sample texture from bounding box
	float v = (p.y - yMin) / (yMax - yMin);
	float ux = (p.x - xMin) / (xMax - xMin);
	float uz = (p.z - zMin) / (zMax - zMin);

	// apply deformation
	p.y = 0.5 * (p.y - st * (p.z - 1.0 / curvature));
	p.z = (1.0 / curvature + ct * (p.z - 1.0 / curvature));

	vec4 xDisp = texture2D(image, vec2(ux, v));
	vec4 zDisp = texture2D(image, vec2(uz, v));
	vec4 yDisp = texture2D(image, vec2(ux, uz));
	vec3 d = 0.5 * vec3(xDisp.x - 0.5, yDisp.y - 0.5, zDisp.z - 0.5);

	n =  vec3(xDisp.x, yDisp.y, zDisp.z);
	h = v;

	vec4 intermedPos = projectionMatrix * viewMatrix * vec4(p, 1.0 );
	intermedPos = intermedPos + projectionMatrix * vec4(d, 1.0);

	gl_Position = intermedPos;
}