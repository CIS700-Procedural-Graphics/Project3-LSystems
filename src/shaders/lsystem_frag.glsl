varying float h;
varying vec3 n;
varying float u;
varying float l;

vec3 lerpvec(in vec3 a, in vec3 b, in float t)
{
	float tx = t * b[0] + (1.0 - t) * a[0];
	float ty = t * b[1] + (1.0 - t) * a[1];
	float tz = t * b[2] + (1.0 - t) * a[2];
	return vec3(tx, ty, tz);
}


void main() {
	vec3 base = vec3(0.1, 0.5, 0.16);
	vec3 trunk = vec3(0.2, 0.11, 0.02);
	vec3 c1 = lerpvec(trunk, base, pow(u, 0.7));
	vec3 col = lerpvec(c1, vec3(1.0, 1.0, 0.5) * n, 0.15);
	col = lerpvec(vec3(0.15, 0.03, 0.15), col, l);
	//gl_FragColor = vec4( h, h, h, 1.0 );
	gl_FragColor = vec4(col, 1.0 );
}