varying float lengthfromPivot;
uniform vec3 petalPivot;
varying vec3 pos;
varying vec3 norm;

void main() {
	//to be used in fragment shader
	lengthfromPivot = length(position-petalPivot);

	pos = position;
	norm = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}