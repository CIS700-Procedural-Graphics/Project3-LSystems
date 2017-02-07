varying vec2 vUv;
uniform sampler2D ramp;
void main() {
	float xd = vUv.x - 0.5;
	float yd = vUv.y - 0.5;

	float dist = sqrt(xd * xd + yd * yd);
	float u = min(dist * 2.0, 1.0);
	vec4 col = texture2D(ramp, vec2(0.5, u));
	gl_FragColor = col;
}