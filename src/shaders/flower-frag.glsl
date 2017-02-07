varying float lengthfromPivot;
varying vec3 pos;
varying vec3 norm;

void main() {

  vec3 basecolor;

  //all the colors that might be used in the wing
  vec3 white = vec3(1.0, 1.0, 1.0);
  vec3 pink = vec3((246.0/255.0), (156.0/255.0), (198.0/255.0));

  //interpolating based on length away from pivot of petal
  if(lengthfromPivot < 7.0)
  {
 	    basecolor = white;
  }
  else if(lengthfromPivot < 12.0)
  {
  	  float t = (lengthfromPivot-7.0)/5.0;
      basecolor = (1.0-t)*white + t*pink;
  }
  else
  {
      basecolor = pink;
  }

  //lambertian shading calculation
  vec3 lightDir = pos - vec3(10.0, 30.0, 20.0);
  float lambert = clamp(dot(normalize(norm), -1.0*normalize(lightDir)), 0.3, 1.0);

  vec3 color = lambert*basecolor;

  gl_FragColor = vec4( color.rgb, 1.0 );

}