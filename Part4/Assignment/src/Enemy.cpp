#include "Enemy.hpp"
#include <cstdlib>
#include <ctime>
#include "iostream"

Enemy::Enemy(SDL_Renderer* renderer) {
    mRenderable = true;

    // Create transform component first with explicit dimensions
    auto transform = std::make_shared<TransformComponent>();
    transform->SetW(40.0f);  // Set explicit width
    transform->SetH(40.0f);  // Set explicit height
    AddComponent(ComponentType::TransformComponent, transform);
    
    std::cout << "Enemy transform initialized with size: " 
              << transform->GetW() << "x" << transform->GetH() << std::endl;

    // Create texture component
    auto texture = std::make_shared<TextureComponent>();
    texture->CreateTextureComponent(renderer, "Assets/Alien.bmp");
    AddComponent(ComponentType::TextureComponent, std::static_pointer_cast<Component>(texture));

    // Create projectile
    auto projectile = std::make_shared<Projectile>();
    
    // Create transform for projectile with explicit dimensions
    auto projTransform = std::make_shared<TransformComponent>();
    projTransform->SetW(6.0f);  // Set width
    projTransform->SetH(20.0f); // Set height
    projectile->AddComponent(ComponentType::TransformComponent, projTransform);
    
    // Create texture for projectile
    auto projTexture = std::make_shared<TextureComponent>();
    projTexture->CreateTextureComponent(renderer, "Assets/Projectile.bmp");
    projectile->AddComponent(ComponentType::TextureComponent, std::static_pointer_cast<Component>(projTexture));

    mProjectile = projectile;
    minLaunchTime = 1000 + rand() % 2000;
    nextLaunchTime = SDL_GetTicks64() + minLaunchTime;
}

Enemy::~Enemy() {}

void Enemy::Update(float deltaTime) {
    if (!mRenderable) return;

    for (auto& [_, component] : mComponents) {
        component->Update(deltaTime);
    }

    // Get both transform and texture components
    auto transform = GetTransform();
    auto texture = GetComponent<TextureComponent>(ComponentType::TextureComponent);
    
    if (!transform) return;

    // Move the enemy based on group direction
    float dx = (sMoveRight ? 1.0f : -1.0f) * mSpeed * deltaTime;
    transform->Move(dx, 0.0f);

    // Update projectile
    mProjectile->Update(deltaTime);

    // Firing logic
    Uint64 now = SDL_GetTicks64();
    if (now >= nextLaunchTime && mRenderable) {
        // Calculate projectile position based on the transform
        float projX = transform->GetX() + transform->GetW() / 2.0f - 3.0f; // Center the projectile
        float projY = transform->GetY() + transform->GetH();
        
        // Debug output
        std::cout << "Enemy firing projectile at position: " << projX << ", " << projY << std::endl;
        
        // Launch the projectile
        mProjectile->Launch(projX, projY, false, 0);
        nextLaunchTime = now + (rand() % 3000 + 1000);
    }
}


void Enemy::Render(SDL_Renderer* renderer) {
    if (!mRenderable) return;

    for (auto& [_, component] : mComponents) {
        component->Render(renderer);
    }

    mProjectile->Render(renderer);
}

float Enemy::sGroupSpeed = 100.0f;

bool Enemy::sMoveRight = true;

std::shared_ptr<Projectile> Enemy::GetProjectile() {
    return mProjectile;
}