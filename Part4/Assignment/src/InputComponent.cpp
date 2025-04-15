#include "InputComponent.hpp"
#include "GameEntity.hpp"
#include "TextureComponent.hpp"
#include "iostream"

void InputComponent::Input(float deltaTime) {
    const Uint8* keyState = SDL_GetKeyboardState(nullptr);
    
    // Handle movement
    auto transform = mGameEntity->GetTransform();
    if (!transform) return;

    float dx = 0.0f;
    if (keyState[SDL_SCANCODE_LEFT]) dx -= mSpeed;
    if (keyState[SDL_SCANCODE_RIGHT]) dx += mSpeed;

    // Move the player
    std::cout << "Transform X before: " << transform->GetX() << std::endl;
    transform->Move(dx * deltaTime, 0.0f);
    std::cout << "Transform X after: " << transform->GetX() << std::endl;
    
    // Handle firing
    if (keyState[SDL_SCANCODE_SPACE]) {
        // Cast the game entity to Player to access the projectile
        std::shared_ptr<Player> player = std::static_pointer_cast<Player>(mGameEntity);
        if (player) {
            auto projectile = player->GetProjectile();
            if (projectile) {
                float projX = transform->GetX() + transform->GetW() / 2.0f - 3.0f; // Center projectile
                float projY = transform->GetY() - 5.0f; // Slightly above player
                
                std::cout << "Firing projectile from InputComponent at: " << projX << ", " << projY << std::endl;
                projectile->Launch(projX, projY, true, 500); // Fire upward with 500ms cooldown
            }
        }
    }
}