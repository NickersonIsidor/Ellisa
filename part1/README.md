# Assignment - Render a Textured .obj model

<img align="right" src="./media/house.jpg" width="400px" alt="picture">

> A texture is worth at least a thousand words!
> 
> (See a house to the right that represents a correct output for this assignment)
  
# Resources to help

Some additional resources to help you through this lab assignment

| SDL2 related links                                    | Description                       |
| --------------------------------------------------    | --------------------------------- |
| [SDL API Wiki](https://wiki.libsdl.org/APIByCategory) | Useful guide to all things SDL2   |
| [My SDL2 Youtube Playlist](https://www.youtube.com/playlist?list=PLvv0ScY6vfd-p1gSnbQhY7vMe2rng0IL0) | My Guide for using SDL2 in video form.   |
| [Lazy Foo](http://lazyfoo.net/tutorials/SDL/)         | Great page with written tutorials for learning SDL2. Helpful setup tutorials for each platform. |
| [Lazy Foo - Handling Key Presses](https://lazyfoo.net/tutorials/SDL/04_key_presses/index.php) | Useful tutorial for learning how to handle key presses | 

| OpenGL related links                                | Description                       |
| --------------------------------------------------  | --------------------------------- |
| [My OpenGL Youtube Series](https://www.youtube.com/playlist?list=PLvv0ScY6vfd9zlZkIIqGDeG5TUWswkMox) | My video series for learning OpenGL |
| [docs.gl](http://docs.gl)                           | Excellent documentation to search for OpenGL commands with examples and description of function parameters   |
| [learnopengl.com](https://learnopengl.com)          | OpenGL 3.3+ related tutorial and main free written resource for the course   |


| C++ related links                                   | Description                       |
| --------------------------------------------------  | --------------------------------- |
| [My C++ Youtube Series](https://www.youtube.com/playlist?list=PLvv0ScY6vfd8j-tlhYVPYgiIyXduu6m-L) | My video series playlist for learning C++ |
| [cppreference](https://en.cppreference.com/w/)      | Definitive, more encyclopedic guide to C++ (less beginner focused, but excellent technically) |
| [cplusplus.com](http://www.cplusplus.com)           | Nice website with examples and tutorials geared more for beginners, reference has lots of examples, and the tutorial page is a great starting point |
| [learncpp.com](https://www.learncpp.com/)           | Handy page for learning C++ in tutorial form   |


- Assignment Related
	- http://paulbourke.net/dataformats/obj/minobj.html 
		- (I recommend reading this one first for a minimal texture example)
	- Links on the OBJ Model Format (From last assignment)
		- https://people.cs.clemson.edu/~dhouse/courses/405/docs/brief-obj-file-format.html 
			- (I recommend reading this one for more information)
		- https://www.cs.cmu.edu/~mbz/personal/graphics/obj.html
		- https://en.wikipedia.org/wiki/Wavefront_.obj_file

# Description

Previously we have drawn a solid filled color and a wireframe for a .obj model. We were able to parse the .obj file format, picking out the vertices, and then make triangles based on selecting them from an index buffer. One optimization we made use of was OpenGl's [index buffer ](http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-9-vbo-indexing/) which allowed us to *pick* the vertex data that we need to make a triangle. A final call to [glDrawElements](http://docs.gl/gl3/glDrawElements) was finally used to render the model to the screen for the amount of indices we had (which was some multiple of 3). 

For this assignment we are going to add more detail to our loader by adding the ability to texture our model using an image. In our scene, we will also add a perspective camera transformation so we can more properly convey depth in our 3D graphics scene. By the end of this assignment you will have made use of what you learned in previous assignments: The PPM Loader for loading a texture file and the infrastructure for your obj loader. 

### Assignment Strategy

This assignment requires some amount of thinking. The actual amount of lines of code is potentially small (ballpark of 100 or less) if you are building this assignment from our previous lab and object loader. 

Here are my recommendations if you are unsure of where to start:

1. Make use of our previous assignment(s) regarding how to load a texture as starter code so that you know you have a BufferLayout that supports vertex and texture data.
	- That is, the vertex layout will take in positions, normals, and texture coordinates.
	- Consider adding to the assignments 'Object.hpp' class the functionality to load .obj models **or** to your previous assignment the ability to load in texture data. 

## Task 1 - Object-Oriented Programming Strategies (C++ refresh)

I want to continue to give a little bit more background on C++ and thinking about data. There is no deliverable for task 1, but it will be useful to at the very least think about and understand these concepts.

### Program arguments

In order to speed up iteration time, it can be useful to read in a data from program arguments. For our .obj loader, this is what we will do. Here is an example of reading in program arguments in C++

```cpp
// clang++ args.cpp -o args
// ./args "./../../common/objects/capsule/capsule.obj"

#include <iostream>

int main(int argc, char** argv){

    std::cout << "My argument is: " << argv[1] << "\n";

    return 0;
}
```

### Structs

structs in C++ while functionally the same as a class (except for the default access modifier level) are typically used as plain old datatypes--i.e. a way to create a composite data type.

Shown below is an example of a struct in C++
```cpp

struct VertexData{
	float x,y,z; // position of vertex
	float s,t;   // Texture coordinate
};

```
It is further important to note the order of our variables in the VertexData struct. In memory, they will be arranged as x,y,z,s,t in that order. This is potentially convenient as in our current buffer data strategy we have been laying out values of the first vertices x,y,z,s,t,etc. in a specific order defined by our vertex layout.

It may further be useful to add a constructor to our struct for convenience.

```cpp

struct VertexData{
	float x,y,z;
	float s,t;

	// Our constructor.
	// Note: The below is using an 'initializer list' to set the value of 'x' to '_x' . z
	//       This is equivalent to also just doing x = _x; in the body of the constructor.
	VertexData(float _x, float _y, float _z, float _s, float _t): x(_x),y(_y),z(_z),s(_s),t(_t) { }
};

```

Often with structs, because they are a datatype, it can be helpful to define mathematical operators with them. Below a test showing how to test for equality is done.

```cpp

struct VertexData{
	float x,y,z;
	float s,t;

	VertexData(float _x, float _y, float _z, float _s, float _t): x(_x),y(_y),z(_z),s(_s),t(_t) { }
	
	// Tests if two VertexData are equal
	bool operator== (const VertexData &rhs){
		if( (x == rhs.x) && (y == rhs.y) && (z == rhs.z) && (s == rhs.s) && (t == rhs.t) ){
			return true;
		}
		return false;
	}
};

```

More information on structs can be found here: 
- http://www.cplusplus.com/doc/tutorial/structures/
- https://www.learncpp.com/cpp-tutorial/47-structs/

## Task 2 - Rendering a Textured Model (.obj and Texture Coordinates)

<img src="./media/textured.gif" width="400px" align="right" alt="Spinning textured house">

For this assignment you are going to render a single textured 3D model. Several are provided in the [objects](./../../common/objects) folder. I have personally tested with the 'house' model for most of my iterations, so I recommend you do the same.

The tasks for rendering in this assignment are the following:
1. Make sure you can parse the .obj file format and associated material file. 
	- read in the vertex (v), vertex texture (vt) and face(f) information.
2. The .obj file should be read in from the command line arguments
	- e.g. `./prog "./../../common/objects/capsule/capsule.obj"`

### OBJ Format -- continued

<img src="./media/capsule.JPG " width="400px" align="right" alt="Textured Capsule in Blender3D">

The models that you will be loading are in the .obj format. This format stores the vertices, texture coordinates, normals, and faces of an object (and potentially other information as well). One way to become familiar with the OBJ file format is to investigate a simple model by opening it in a text editor. Below is a capsule in the .obj file format that was exported from the free tool [Blender3D](https://www.blender.org/). It may also be worth exploring models in 3D modeling and animation tools like Blender3D as well.

### Parsing Texture Coordinates and the Material Files(.mtl)

For this assignment, now we will also make use of the .mtl file that is also generated with .obj files. Let's first take a look at one of the provided .obj files "windmill"

### Windmill .obj

What you will notice below, is that the file looks largely the same. However, there are a few new changes we want to pay attention to.

1. There is something called a **mtllib** that specifies which file to use to find material information.
	- In our case, it is in a file called windmill.mtl that will be described in the next section.
2. There are individual **vt** listings for vertex coordinates that follow the long list of (**v**) vertex listings.
3. Within the face data (lines starting with **f**), there is now vertex texture coordinates for each face.
	- i.e. A face needs a vertex, vertex texture, and vertex normal index.
	- (We are still ignoring normals at this point, though it may be of value to store them)
	- Note that the order they are listed in the file, v's followed by vt's followed by vn's means a face is a series of f v/vt/vn v/vt/vn v/vt/vn, etc.
	
```
# Blender v2.79 (sub 0) OBJ File: ''
# www.blender.org
mtllib windmill.mtl
o WindMill
v -0.553154 1.064796 -0.746740
v -0.553154 1.064796 0.653572
v -0.555058 2.789091 0.648866
v -0.555058 2.789091 -0.742033
# More vertices ..
vt 0.579430 0.005116
vt 0.786357 0.005169
vt 0.785661 0.284613
vt 0.579768 0.284582
vt 0.100437 0.383934
vt 0.009483 0.283401
# ... more data continued
f 1/1/1 2/2/1 3/3/1
f 4/4/2 5/5/2 6/6/2
f 7/7/3 8/8/3 6/6/3
f 9/9/4 10/10/4 11/11/4
f 12/12/5 13/13/5 14/14/5
# ... yet more data continued
```

### Windmill Material File

```
# Blender MTL File: 'None'
# Material Count: 1

newmtl blinn1SG
Ns 0.000000
Ka 0.100000 0.100000 0.100000
Kd 0.000000 0.000000 0.000000
Ks 0.000000 0.000000 0.000000
Ke 0.000000 0.000000 0.000000
Ni 1.500000
d 1.000000
illum 2
map_Kd windmill_diffuse.ppm
map_Bump windmill_normal.ppm
map_Ks windmill_spec.ppm
```

The windmill material(.mtl) file contains some additional data. The first line specifies what the material name is ("blinn1SG"). This is the line that will be referred to within the .obj file. The most important piece of information otherwise is the 'map_Kd' which says where the 'diffuse color' map file is. This is the image where we sample colors from and apply them to triangles.

**Note:** You may assume every .obj model only has one texture per model for this assignment (In games however, it is not uncommon to have a completely separate texture for the characters face for example, so that the body can be the same, but a different 'face' can signify a different character). 

A few of the additional fields are specified in [Paul Burke's guide](http://paulbourke.net/dataformats/obj/minobj.html) {[archived link](./archive/burke.pdf)}, which are primarily used for rendering a scene. For now, we are only interested in the diffuse color map.

### Something fishy about our index buffer strategy

`f 5/5/2 3/6/2 6/7/2`

Taking a closer look at one of the lines, I notice that all of the numbers are not the same. `3/6/2` for instance, is not nicely packed together with the same vertex, vertex texture, and vertex normal. So how does this work with our previous index buffer strategy?

http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-9-vbo-indexing/ provides a nice little algorithm I have referenced below: 

> For each input vertex
>
> &nbsp;&nbsp;Try to find a similar ( = same for all attributes ) vertex between all those we already output
>
> &nbsp;&nbsp;&nbsp;&nbsp;If found :
>
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; A similar vertex is already in the VBO, use it instead !
>
> &nbsp;&nbsp;&nbsp;&nbsp;If not found :
>
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No similar vertex found, add it to the VBO

I will provide my explanation of the algorithm, but you will need to think about why this makes sense.

1. Let us take these values `5/5/2`, `3/6/2`, and `6/7/2`
	- The first one `5/5/2` needs the 5th vertex (remember the format v/vt/vn). That means lookup in some data structure, our fifth vertex (a set of x,y,z).
	- We then repeat this process and pick up the fifth texture data, a pair of (s,t) values.
	- ( For this assignment, you can ignore the vertex normal, but I recommend just doing things properly and using it as you'll need it for the next assignment)
2. We can then think of the tuple(5,5,2) as x5,y5,z5,s5,t5. It is a set of unique values, and they may be repeated.
3. This would be different than the tuple (5,6,2) for instance, which is the five floating point numbers numbers x5,y5,z5,s6,t6.
4. So in my vertex buffer data between (5,5,2) and (5,6,2) I have the following data all packed together:
	- x5,y5,z5,s5,t5,x5,y5,z5,s6,t6
	- My 0th index in my index buffer would pull out the values: x5,y5,z5,s5,t5
	- My 1st index in my index buffer would pull out the values: x5,y5,z5,s6,t6
5. Reason about this and think before jumping straight into code.
6. Also understand you can print out the values and compare them with what you see in the actual .obj file (open up the .obj in a text editor).
	- Also, as demonstrated in the first portion of this readme, defining a custom vertexData struct and overloading the operator== can be useful for testing for equality when determining whether or not you need to create a new index, or can otherwise reuse one.

### glDrawArrays

Note: For handling textures with the glDrawArrays strategy, handling each vertex becomes relatively trivial. We effectively just need to iterate through the face information (i.e. f 3/5/2) and populate the vertex buffer object appropriately with the indices.

### Loading your own models for this assignment

It is totally fine to provide your own school appropriate Textured 3D .obj files for this assignment. Some notes that may save you time debugging:

- Make sure you push the model, texture(s), and material file to the repository.
- If you use blender3D to export your own .obj model, make sure to scale it to about the size of a unit cube in Blender3D. This will save you time from moving the camera around a lot.
- Triangulate the faces within the blender3D (there is an option when you export)
- Check your material file to make sure it is loading .ppm images which we know how to handle. Use a program like [GIMP](https://www.gimp.org/) to convert them to ASCII format .ppm images otherwise.
- The .ppm image may be 'mirrored', meaning you have to flip it horizontally for the actual texture coordinates to line up with the appropriate vertices.

### Task 3 - Interactive Graphics

- Pressing the <kbd>tab</kbd> key draws your object in wireframe mode (By default when you start the application it will show the model in filled).
- Pressing the <kbd>esc</kbd> key exits the application.
- Pressing the <kbd>w</kbd> and <kbd>s</kbd> key move your camera forward and backwrds

A resource for performing keyboard input with SDL is provided here: http://lazyfoo.net/tutorials/SDL/04_key_presses/index.php

### Task 4 - Perspective Camera

Make sure your scene is being rendered in perspective. Make modifications to the vert.glsl as needed. This should be similar to what you have done in a previous assignment.

### More Assignment strategy 

My suggested strategy for this project is:

* You can use any of the code from the previous assignments that you may find useful.
	* In fact, I highly recommend it!
* Have a special C++ class(in a .hpp and .cpp file) for loading OBJ models--not doing so is bad style!
	* Utilize any data structure you like in the STL (e.g. std::vector or std::map)
  	* You may assume all faces are triangles (though if you download any test .obj files from the web that may not be the case)
* **Use the textured cube** in ./common/objects/textured_cube/cube.obj to test.
* Think about how you can load a line of text and then split it into individual tokens.
  	* A resource loading files (Filo I/O) in C++ can be found here: http://www.cplusplus.com/doc/tutorial/files/
  	* The reference on strings may be useful: http://www.cplusplus.com/reference/string/string/
    		* Some ideas on string splitting: http://www.martinbroadhurst.com/how-to-split-a-string-in-c.html
* You do not need to use any complex shaders. In fact, I recommend using the most basic ones for this assignment.
* I recommend using this webpage for help with OpenGL: http://docs.gl/gl3/glPolygonMode

## How to run your program

Your solution should compile using the [build.py](./build.py) file. That is, we will run your program by typing [python3 build.py](./build.py) and it should just work.

Your program should then run by typing in: `./prog "./../../common/objects/chapel/chapel_obj.obj"`

Note: The 'house' or 'chapel' are the objects we will test on.

# Submission/Deliverables

### Submission

- Commit all of your files to github, including any additional files you create.
- Do not commit any binary files unless told to do so.
- Do not commit any 'data' files generated when executing a binary.

### Deliverables

- You should be able to display a triangulated .obj 3D textured model (several are provided).
	- If you would like you can make it spin, move around, or load multiple models. Please just document this in this readme.

* You need to commit your code to this repository.
* You need to use the build.py script provided. Anything else used is at your own risk--and you should provide complete documentation. If your program does not compile and run, you get a zero!


# F.A.Q. (Instructor Anticipated Questions)

* Q: Why the obj format?
  * A: It is a standard data format understood by most programs.
* Q: Can I load my own models that I have made to show off?
  * A: Sure -- just make sure they are added to the repository (Including the texture)
* Q: Why are my texture coordinates messed up? The geometry looks right?
  * A: Try a different model first to confirm.
  * Then you may have to flip the texture in a modeling program or within your .ppm loader depending on how the coordinates were assigned.
  	* Image files are normally flipped on the x-axis (meaning y values need to be inverted). On occasion an image may be flipped on both axis.
  * Make sure the path to your texture is correct (are you loading 'some_image.ppm' or ../../common/image.ppm") -- verify the file exists.
* Q: My faces are pointing inwards strangely?
  * A: Maybe try playing with 'glEnable' and the Depth test. 
* Q: What other common errors/debugging can I do?
	1. Try to output (i.e. saveObj(std::string filename) the .obj file and ensure that it matches the file that you are loading
	2. Most of the problems tend to be not allocating enough memory when creating the buffer (i.e. passing in wrong values in CreateBufferTextureLayout() as you have mentioned). Try printing out the size of indices and vertices. And make sure if you are using vectors, you are doing .size() and not sizeof(myVector) as sizeof only describes the data structure size, not the actual amount of elements and bytes needed. To get total bytes of information (i.e. our vertices) we would use vertices.size()*sizeof(GLFloat) for example.
	3. Another common mistake is to pass in the 'vertices' vector when we want to pass in the data. To do that, we should use: vertices.data() to get access to the raw array.

* Q: My geometry looks like it is off by 1
	* A: The purpose of the assignment is to be able to parse unique collections of x,y,z and s,t (and the normals) of data. You are essentially building the 'vbo' object, and then indexing into your own collection of xyzst data.
* Q: My object is inside out?
	* A: Did you enable the z-buffer? (`glEnable(GL_DEPTH_TEST);`)
* Q: M1 Mac Error: "UNSUPPORTED (log once): POSSIBLE ISSUE: unit 2 GLD_TEXTURE_INDEX_2D is unloadable and bound to sampler type (Float)"
  	* A: Might be missing mip map (glGenerateMipmap), or otherwise your texture does not exist (binding to wrong uniform, or the image was never generated (perhaps a missing .ppm image file)).
  
# Found a bug?

If you found a mistake (big or small, including spelling mistakes) in this lab, kindly send me an e-mail. It is not seen as nitpicky, but appreciated! (Or rather, future generations of students will appreciate it!)

- Fun fact: The famous computer scientist Donald Knuth would pay folks one $2.56 for errors in his published works. [[source](https://en.wikipedia.org/wiki/Knuth_reward_check)]
- Unfortunately, there is no monetary reward in this course :)
