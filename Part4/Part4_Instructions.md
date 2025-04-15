# Assignment_08 - ECS (Part 4)

**Overall Objective for Assignment 8:** 

The overall objective for your final submission is to refactor your space invaders game to utilize components rather than having everything self-contained in your player and enemy game entities. This will involve refactoring our Sprite into both a Transform and Texture component, our Input (for our player) into an Input Component, and our Collision Logic into a Collision2D component.

I have included some starter code for this part of the assignment. It contains the Component Types, and the Component class. I have also provided you with some function implementations in the StarterCode src directory.

The starter code is just for reference, but your end result should be fairly similar to the provided starter code. That being said, some variation in your implementation is okay because you all have your own versions of your Space Invaders game.

After completing all parts, you will have the basics of a game engine that will allow you create different types of games, as well as add new functionality to existing games much more easily than with our original codebase.

**Objective for Part 4**

Create an Assignment Folder and copy your code from Assignment #8 into the Part4 Directory.

We will be creating a Collision2D Component. We'll also be refactoring our code base a bit.

Part4 is fairly straight forward, it just requires a little refactoring. We're going to be adding a collision component that is basically going to mimic our transform component.

Also, for this assignment it is very important to compile frequently as there will be a lot of errors when refactoring the code. It may look scary at first, but you'll handle the errors one at a time. Also, when renaming things, it is very easy to miss something, so frequent compiling will allow you to make sure things are renamed correctly before moving on.

**Section 1: Create an Collision2DComponent Class**

* We will be creating a collision component that we'll be accessing in our collision function. This will allow us to have different shapes represent our collision boundary other than just a rectangle. (Though for our Space Invaders game, it's just a rectangle.)
* You can copy over all the code in your Transform.cpp and Transform.hpp into the new Collision2DComponent class.
* The main difference will be in the Update() function.
* We want to access the GameEntity associated with the collision2D component and get its Transform Component.
* Then, we can set our Collision Component's width/height and x/y to the corresponding values from our Transform Component.
* Basically, we want our collision component to follow our transform component.
* For debugging purposes, you can have your collision components render function call : SDL_RenderDrawRectF(renderer, &mRectangle); This will render the collision component's rectangle.

**Section 2: Visiting the GameEntity Class**

* Uncomment the Explicit Template Instantiations for the Collision2DComponent.
* In the TestCollision Function, replace the TransformComponent with the Collision2DComponent.

**Section 3: Application Class**

* Create and Add a collision2Dcomponent to each enemy and the player.
* Revise the update function to update the player before the enemies if you haven't already.

**Section 4: Player and Enemy Classes**

* Create and Add a collision2Dcomponent to projectiles.

**Section 5: Projectile Class**

* The projectile is a GameEntity too. Modify the Update() function to ADD a loop through all of the Projectile's components after all of the current logic. (The same loop used in the Player Update()).

**Section 6: Launching Projectiles**

* In the Input Component.hpp you should forward declare the Player class. Then, include the Player.hpp file in the Component.cpp.
* We'll need to get the Player from the InputComponent using: std::shared_ptr<Player> player = std::static_pointer_cast<Player>(GetGameEntity());
* Now, that you have the player, get the projectile and launch it, passing in the transform's x and y.

**Section 7: Finale**

* After successfully completing your refactoring, your game should compile with no errors. Because we aren't changing the functionality of our code, the game should run exactly the same as it did before. You should be able to move your player left and right, fire, and collide with enemies and their projectiles.

* After you've completed all parts, your refactoring is complete! 

**How to compile and run your program**

Your code may compile with different commands based on your architecture, but a sample compilation command may look like: g++ -std=c++20 ./src/*.cpp `pkg-config --cflags --libs sdl2` -o prog.

**Submission**

* After completing all parts, make sure you push to GitHub, and submit the link to your repository on Canvas.