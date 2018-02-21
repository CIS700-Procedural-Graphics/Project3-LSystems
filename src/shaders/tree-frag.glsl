varying vec3 vPos;
uniform float uCylY;
uniform float uIters;

void main() {
vec3 yellow, magenta, green, blue;

blue.rg = vec2(0.0);
blue[2] = 1.0;

// Making Yellow 
yellow.rg = vec2(1.0);  // Assigning 1. to red and green channels
yellow[2] = 0.0;        // Assigning 0. to blue channel

// Making Magenta
magenta = yellow.rbg;   // Assign the channels with green and blue swapped

// Making Green
green.rgb = yellow.bgb; // Assign the blue channel of Yellow (0) to red and blue channels 
  
  vec3 color = mix(blue, green, uCylY/(uIters*10.0));

  gl_FragColor = vec4( color.rgb, 1.0 );

}