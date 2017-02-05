varying float h;
varying vec3 n;


vec3 lerpvec(in vec3 a, in vec3 b, in float t)
{
	float tx = t * b[0] + (1.0 - t) * a[0];
	float ty = t * b[1] + (1.0 - t) * a[1];
	float tz = t * b[2] + (1.0 - t) * a[2];
	return vec3(tx, ty, tz);
}


void main() {
	

	//gl_FragColor = vec4( h, h, h, 1.0 );
	gl_FragColor = vec4( n, 1.0 );
}