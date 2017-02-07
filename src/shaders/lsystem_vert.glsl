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
varying float u;
varying float l;

mat3 transpose(in mat3 m) {
	mat3 n = mat3(vec3(m[0][0], m[1][0], m[2][0]),
		vec3(m[0][1], m[1][1], m[2][1]),
		vec3(m[0][2], m[1][2], m[2][2]));
	return m;
}


void main() {
	float yr = yMax - yMin;


	vec3 p = (modelMatrix * vec4(position, 1.0)).xyz;
	float h = pow((yMax - position.y) / (yr), 1.3);
	float radial = 1.3 * (sqrt(p.x * p.x + p.z * p.z)) / (h *(xMax - xMin));

	u = max(min(radial, 1.0), 0.0);
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

	mat3 jacobian = mat3(vec3(1.0, 0.0, 0.0),
		vec3(0.0, ct, st),
		vec3(0, -1.0 * st * (1.0 - curvature * p.z), ct * (1.0 - curvature * p.z)));


	vec3 nor = jacobian * transpose(mat3(modelMatrix)) * normal;
	l = dot(normalize(nor), vec3(0.0, 1.0, 0.0));
	l = pow(max(0.2, l), 0.4545);

	// apply deformation
	p.y = 0.5 * (p.y - st * (p.z - 1.0 / curvature));
	p.z = (1.0 / curvature + ct * (p.z - 1.0 / curvature));

	vec4 xDisp = texture2D(image, vec2(ux, v));
	vec4 zDisp = texture2D(image, vec2(uz, v));
	vec4 yDisp = texture2D(image, vec2(ux, uz));
	vec3 d = 0.5 * vec3(xDisp.x - 0.5, yDisp.y - 0.5, zDisp.z - 0.5);

	// coloration based on noise
	n =  vec3(xDisp.x, yDisp.y, zDisp.z);
	h = v;

	vec4 intermedPos = projectionMatrix * viewMatrix * vec4(p, 1.0 );
	intermedPos = intermedPos + projectionMatrix * vec4(d, 1.0);

	gl_Position = intermedPos;
}