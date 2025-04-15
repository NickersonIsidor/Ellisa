#include "Projectile.hpp"
#include <iostream>

Projectile::Projectile() {
    mRenderable = false;
    timeSinceLastLaunch = SDL_GetTicks64();
}

Projectile::~Projectile() {}

void Projectile::Launch(float x, float y, bool direction, float minLaunchTime) {
    Uint64 now = SDL_GetTicks64();
    if (now - timeSinceLastLaunch < minLaunchTime) return;

    // Get transform component
    auto transform = GetTransform();
    if (!transform) {
        std::cerr << "Projectile::Launch - No transform component!" << std::endl;
        return;
    }

    // Set position
    transform->SetX(x);
    transform->SetY(y);
    
    // Make sure width and height are set
    if (transform->GetW() <= 0) transform->SetW(6.0f);
    if (transform->GetH() <= 0) transform->SetH(20.0f);
    
    std::cout << "Projectile launched at: " << x << ", " << y 
              << " with size: " << transform->GetW() << "x" << transform->GetH() 
              << " direction: " << (direction ? "up" : "down") << std::endl;
    
    firingUp = direction;
    mRenderable = true;
    timeSinceLastLaunch = now;
}

void Projectile::Update(float deltaTime) {
    if (!mRenderable) return;

    // Update all components first
    for (auto& [_, component] : mComponents) {
        component->Update(deltaTime);
    }

    // Then handle projectile-specific movement
    auto transform = GetTransform();
    if (!transform) {
        std::cerr << "Projectile::Update - No transform component!" << std::endl;
        return;
    }

    float dy = firingUp ? -mSpeed : mSpeed;
    transform->Move(0.0f, dy * deltaTime);

    float y = transform->GetY();
    if (y < 0 || y > 600) {
        std::cout << "Projectile went off screen at y=" << y << ", setting not renderable" << std::endl;
        mRenderable = false;
    }
}


void Projectile::Input(float deltaTime) {
    // Forward input to components
    for (auto& [_, component] : mComponents) {
        component->Input(deltaTime);
    }
    // Projectiles don't handle direct input themselves
}

void Projectile::Render(SDL_Renderer* renderer) {
    if (!mRenderable) return;

    std::cout << "Rendering projectile" << std::endl;
    
    // Add extra debug rendering to make sure projectile is visible
    auto transform = GetTransform();
    if (transform) {
        SDL_FRect rect = transform->GetRectangle();
        
        // Draw a bright outline around the projectile for debugging
        SDL_SetRenderDrawColor(renderer, 255, 255, 0, 255); // Bright yellow
        SDL_RenderDrawRectF(renderer, &rect);
    }

    // Render all components
    for (auto& [_, component] : mComponents) {
        component->Render(renderer);
    }
}