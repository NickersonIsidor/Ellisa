#pragma once

#include <SDL2/SDL.h>
#include "TextureComponent.hpp"
#include "GameEntity.hpp"
#include "Player.hpp"
#include "Enemy.hpp"
#include <vector>
#include <iostream>

class Application {
    public:
        Application(int argc, char* argv[]);

        ~Application();

        void StartUp(char* argv[]);

        void Input(float deltaTime);

        /**
         * @brief Updates the game state, including enemy and player logic.
         * This includes checking collision.
         * 
         * @param deltaTime Time elapsed since the last frame.
         */
        void Update(float deltaTime);

        /**
         * @brief Renders the game objects to the screen.
         */
        void Render();

        /**
         * @brief Main application loop that handles input, updates, and rendering.
         * 
         * @param targetFPS Target frames per second.
         */
        void Loop(float targetFPS);

        void ShutDown();

    private:
        std::shared_ptr<Player> mMainCharacter;
        std::vector<std::shared_ptr<Enemy>> mEnemies;
        SDL_Window* mWindow = nullptr;
        SDL_Renderer* mRenderer = nullptr;
        bool mRun;
        float mFramesElapsed;
        float mEnemySpeed = 100.0f; // shared horizontal movement for all enemies
        bool mEnemiesShouldReverse = false; // flag to tell them to flip next frame
};