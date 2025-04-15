#pragma once

#include "TextureComponent.hpp"
#include "GameEntity.hpp"

class Projectile : public GameEntity, public std::enable_shared_from_this<Projectile> {
    public:
        /**
         * @brief Sets the time since last launch and mRenderable to false.
        */
        Projectile();

        ~Projectile() override;

        /**
         * @brief Launches the projectile from a specified position if enough time has passed since the last launch.
         * Calculate how much time has passed since the projectile was last launched.
         * Set firing to true.
         * Set the yDirection
         * Move the projectile.
         * 
         * @param x The x-coordinate from which the projectile will be launched.
         * @param y The y-coordinate from which the projectile will be launched.
         * @param yDirectionUp Boolean indicating whether the projectile moves upwards (true (player)) or downwards (false (enemy)).
         * @param minLaunchTime The minimum time (in milliseconds) required between launches.
         */
        void Launch(float x, float y, bool direction, float minLaunchTime=1000);

        /**
         * @brief Updates the projectile's position over time if it is currently firing.
         * Make sure to check whether the projectile has left the screen to flip the mIsFiring.
         * 
         * @param deltaTime The time elapsed since the last update, used for smooth movement calculations.
         */
        void Update(float deltaTime) override;

        /**
         * @brief Renders the projectile to the screen IF it is currently renderable.
         * 
         * @param renderer The SDL renderer used to draw the projectile.
         */
        void Render(SDL_Renderer* renderer) override;


        void Input(float deltaTime) override;
        
    private:
        bool mIsFiring{false};
        bool mYDirectionUp{true};
        Uint64 timeSinceLastLaunch;
        float mSpeed{200.0f};
        bool firingUp = true;
};
