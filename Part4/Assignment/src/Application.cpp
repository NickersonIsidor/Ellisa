// Application.cpp
#include "../include/Application.hpp"
#include "../include/ResourceManager.hpp"
#include <chrono>
#include "InputComponent.hpp"

Application::Application(int argc, char* argv[])
    : mWindow(nullptr), mRenderer(nullptr), mRun(true), mFramesElapsed(0.0f) {}

Application::~Application() {
    ShutDown();
}

void Application::StartUp(char* argv[]) {
    SDL_Init(SDL_INIT_VIDEO);

    mWindow = SDL_CreateWindow("Space Game", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 800, 600, SDL_WINDOW_SHOWN);
    mRenderer = SDL_CreateRenderer(mWindow, -1, SDL_RENDERER_ACCELERATED);

    // Create player and initialize components
    mMainCharacter = std::make_shared<Player>(mRenderer);
    
    // Add collision component to player
    auto playerCollision = std::make_shared<Collision2DComponent>();
    mMainCharacter->AddComponent(ComponentType::Collision2DComponent, playerCollision);
    
    // Initialize all components
    mMainCharacter->InitializeComponents();
    
    // Add input component
    auto input = std::make_shared<InputComponent>();
    mMainCharacter->AddComponent(ComponentType::InputComponent, input);
    
    // Initialize player projectile and add collision to it
    if (mMainCharacter->GetProjectile()) {
        auto projCollision = std::make_shared<Collision2DComponent>();
        mMainCharacter->GetProjectile()->AddComponent(ComponentType::Collision2DComponent, projCollision);
        mMainCharacter->GetProjectile()->InitializeComponents();
    }

    // Create enemies
    for (int row = 0; row < 3; ++row) {
        for (int col = 0; col < 8; ++col) {
            // Create enemy
            std::shared_ptr<Enemy> enemy = std::make_shared<Enemy>(mRenderer);
            
            // Add collision component to enemy
            auto enemyCollision = std::make_shared<Collision2DComponent>();
            enemy->AddComponent(ComponentType::Collision2DComponent, enemyCollision);
            
            // Initialize all components
            enemy->InitializeComponents();
            
            // Position the enemy
            float x = 60.0f + col * 80.0f;
            float y = 60.0f + row * 60.0f;
            
            auto transform = enemy->GetTransform();
            if (transform) {
                transform->SetX(x);
                transform->SetY(y);
            }
            
            // Add collision to enemy projectile and initialize
            if (enemy->GetProjectile()) {
                auto projCollision = std::make_shared<Collision2DComponent>();
                enemy->GetProjectile()->AddComponent(ComponentType::Collision2DComponent, projCollision);
                enemy->GetProjectile()->InitializeComponents();
            }
            
            mEnemies.push_back(enemy);
        }
    }    
}

void Application::Input(float deltaTime) {
    SDL_Event e;
    const Uint8* keyState = SDL_GetKeyboardState(NULL);

    while (SDL_PollEvent(&e)) {
        if (e.type == SDL_QUIT) {
            mRun = false;
        }
    }

    mMainCharacter->Input(deltaTime);
}

void Application::Update(float deltaTime) {
    // Update player first
    mMainCharacter->Update(deltaTime);

    // Then update all enemies
    for (auto& enemy : mEnemies) {
        enemy->Update(deltaTime);
    }

    // Group bounce detection - check if ANY enemy has reached the edge
    bool shouldReverse = false;
    for (auto& enemy : mEnemies) {
        if (!enemy->GetRenderable()) continue;
        
        auto transform = enemy->GetTransform();
        if (!transform) continue;

        float x = transform->GetX();
        float w = transform->GetW();
        
        if (x < 10.0f || x + w > 790.0f) {
            std::cout << "Enemy at edge: x=" << x << ", w=" << w << ", right edge=" << (x + w) << std::endl;
            shouldReverse = true;
            break;
        }
    }

    // If any enemy has reached the edge, reverse direction for all
    if (shouldReverse) {
        std::cout << "REVERSING ENEMY DIRECTION - was moving " 
                 << (Enemy::sMoveRight ? "right" : "left") << std::endl;
        Enemy::sMoveRight = !Enemy::sMoveRight;
        
        // Move enemies down when they reverse direction
        for (auto& enemy : mEnemies) {
            if (!enemy->GetRenderable()) continue;
            auto transform = enemy->GetTransform();
            if (transform) {
                transform->Move(0.0f, 10.0f); // Move down 10 pixels
            }
        }
    }

    // Collision detection using Collision2DComponent
    std::shared_ptr<Projectile> playerProj = mMainCharacter->GetProjectile();
    if (playerProj->GetRenderable()) {
        for (auto& enemy : mEnemies) {
            if (enemy->GetRenderable() &&
                playerProj->TestCollision(enemy)) {
                std::cout << "Collision detected! Removing enemy.\n";
                enemy->SetRenderable(false);
                playerProj->SetRenderable(false);
                break;
            }
        }
    }
    
    for (auto& enemy : mEnemies) {
        std::shared_ptr<Projectile> enemyProj = enemy->GetProjectile();
        if (enemyProj->GetRenderable() &&
            enemyProj->TestCollision(mMainCharacter)) {
            mMainCharacter->SetRenderable(false);
            enemyProj->SetRenderable(false);
        }
    }
}

void Application::Render() {
    SDL_SetRenderDrawColor(mRenderer, 0, 0, 0, 255);
    SDL_RenderClear(mRenderer);

    mMainCharacter->Render(mRenderer);

    for (auto& enemy : mEnemies) {
        enemy->Render(mRenderer);
    }

    SDL_RenderPresent(mRenderer);
}

void Application::Loop(float targetFPS) {
    float targetFrameTime = 1.0f / targetFPS;
    auto lastTime = std::chrono::high_resolution_clock::now();

    while (mRun) {
        auto currentTime = std::chrono::high_resolution_clock::now();
        float deltaTime = std::chrono::duration<float>(currentTime - lastTime).count();
        lastTime = currentTime;

        Input(deltaTime);
        Update(deltaTime);
        Render();

        float frameTime = std::chrono::duration<float>(
            std::chrono::high_resolution_clock::now() - currentTime).count();

        if (frameTime < targetFrameTime) {
            SDL_Delay(static_cast<Uint32>((targetFrameTime - frameTime) * 1000.0f));
        }
    }
}

void Application::ShutDown() {
    SDL_DestroyRenderer(mRenderer);
    SDL_DestroyWindow(mWindow);
    SDL_Quit();
}