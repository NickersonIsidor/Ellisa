// Player.cpp
#include "Player.hpp"
#include "InputComponent.hpp"
#include "TextureComponent.hpp"

Player::Player(SDL_Renderer* renderer) {
    mRenderable = true;

    // Create transform component first
    auto transform = std::make_shared<TransformComponent>();
    AddComponent(ComponentType::TransformComponent, transform);
    
    // Set initial transform size - important for rendering!
    transform->SetX(350.0f);
    transform->SetY(500.0f);
    transform->SetW(40.0f); // Make sure to set width and height
    transform->SetH(40.0f);
    
    std::cout << "Player transform initialized at: " << transform->GetX() << ", " << transform->GetY() 
              << " with size: " << transform->GetW() << "x" << transform->GetH() << std::endl;

    // Create texture component
    auto texture = std::make_shared<TextureComponent>();
    texture->CreateTextureComponent(renderer, "Assets/Spaceship.bmp");
    AddComponent(ComponentType::TextureComponent, std::static_pointer_cast<Component>(texture));

    // Create projectile
    auto projectile = std::make_shared<Projectile>();
    
    // Create transform for projectile
    auto projTransform = std::make_shared<TransformComponent>();
    projTransform->SetW(6.0f);  // Set width and height
    projTransform->SetH(20.0f);
    projectile->AddComponent(ComponentType::TransformComponent, projTransform);
    
    // Create texture for projectile
    auto projTexture = std::make_shared<TextureComponent>();
    projTexture->CreateTextureComponent(renderer, "Assets/Projectile.bmp");
    projectile->AddComponent(ComponentType::TextureComponent, std::static_pointer_cast<Component>(projTexture));

    mProjectile = projectile;
}

Player::~Player() {}

void Player::Input(float deltaTime) {
    for (auto& [_, component] : mComponents) {
        component->Input(deltaTime);
    }
}

void Player::Update(float deltaTime) {
    for (auto& [_, component] : mComponents) {
        component->Update(deltaTime);
    }

    mProjectile->Update(deltaTime);
}

void Player::Render(SDL_Renderer* renderer) {
    if (!mRenderable) return;

    for (auto& [_, component] : mComponents) {
        component->Render(renderer);
    }

    mProjectile->Render(renderer);
}

std::shared_ptr<Projectile> Player::GetProjectile() {
    return mProjectile;
}