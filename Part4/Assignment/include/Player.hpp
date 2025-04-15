#pragma once

#include "GameEntity.hpp"
#include "Projectile.hpp"

class Player : public GameEntity {
    public:
        /**
         * @brief Constructs a Player entity with a given sprite and renderer.
         * This function should create and resize a Projectile.
         * 
         * @param renderer The SDL_Renderer used for rendering the player's projectile.
         * @param sprite The sprite representing the player.
         */
        Player(SDL_Renderer* renderer);

        ~Player();

        /**
         * @brief Handles user input for the Player entity.
         * 
         * The method listens for left, right, and spacebar key presses and moves the player or launches a projectile accordingly.
         * 
         * @param deltaTime The time elapsed since the last frame, used for frame-independent movement.
         */
        void Input(float deltaTime) override;

        /**
         * @brief Updates the Player entity and its projectile.
         * 
         * @param deltaTime The time elapsed since the last frame, used for frame-independent updates.
         */
        void Update(float deltaTime) override;

        /**
         * @brief Renders the Player and its projectile.
         * 
         * @param renderer The SDL_Renderer used to draw the player and projectile on the screen.
         */
        virtual void Render(SDL_Renderer* renderer) override;

        /**
         * @brief Retrieves the projectile associated with the player.
         * 
         * @return A shared pointer to the player's projectile.
         */
        std::shared_ptr<Projectile> GetProjectile();

    private:
        float mSpeed{100.0f}; 
        std::shared_ptr<Projectile> mProjectile;
};