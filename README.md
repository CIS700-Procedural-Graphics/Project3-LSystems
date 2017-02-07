
Here is the HW submission: [mccannd.github.io/Project3-LSystems](mccannd.github.io/Project3-LSystems)

Additions to the assignment:
- Ramp shader ground plane
- Tree sways / bends on the GPU. Geometry normals also account for this bend.
- Tree mesh has noise displacement on the GPU, based on precomputed noise texture. The texture is read through a bounding box that is saved in the shader.
- Angle changes to the Turtle / stack work in local axes instead of global axes

Submitted system: a christmas tree

Axiom : MB

Rules:
X -->
10% : \[lFFX\]\[rFFX\]>FFX
10% : \[lFFX\]\[rFFX\]-FFX
10% : X
70% : \[lFFX\]\[rFFX\]FFX

B --> \[++++X\]<<<\[++++X\]<<<\[++++X\]<<<\[++++X\]<MB

M --> MF

