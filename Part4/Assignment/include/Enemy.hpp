#pragma once

#include "GameEntity.hpp"
#include "Projectile.hpp"

class Enemy : public GameEntity {
    public:
        /**
         * @brief Constructs an Enemy entity with a given sprite and renderer.
         * 
         * Initializes the enemy with a sprite, creates a projectile for the enemy, and
         * sets up movement and launch timings for the projectile (using Rand()).
         * 
         * @param renderer The SDL_Renderer used for rendering the enemy's projectile.
         * @param sprite The sprite representing the enemy.
         */
        Enemy(SDL_Renderer* renderer);

        ~Enemy();

        /**
         * @brief Updates the enemy's state, including movement and projectile actions.
         * 
         * The enemy moves horizontally, changing direction when reaching the offset bounds.
         * It also updates the projectile's state and launches the projectile if the enemy is renderable.
         * 
         * @param deltaTime The time elapsed since the last update, used for frame-rate independent movement.
         */
        void Update(float deltaTime) override;

        /**
         * @brief Renders the enemy and its projectile to the screen.
         * 
         * This function renders the projectile and the enemy sprite, but only if the
         * enemy is set to be rendered.
         * 
         * @param renderer The SDL_Renderer used for rendering the enemy and its projectile.
         */
        void Render(SDL_Renderer* renderer) override;

        /**
         * @brief Gets the enemy's projectile.
         * 
         * Returns the shared pointer to the projectile associated with this enemy.
         * 
         * @return A shared pointer to the enemy's projectile.
         */
        std::shared_ptr<Projectile> GetProjectile();
        
        static bool sMoveRight;

        static float sGroupSpeed;

    private:
        Uint64 nextLaunchTime;
        bool xPositiveDirection{true};
        float offset{0.0f};
        float mSpeed{100.0f}; 
        std::shared_ptr<Projectile> mProjectile;
        float minLaunchTime{5000};
        float homeX;
        

};