#include "../include/GameEntity.hpp"
#include "TextureComponent.hpp"
#include "InputComponent.hpp"
#include "TransformComponent.hpp"


GameEntity::GameEntity() : mRenderable(true) {}

GameEntity::~GameEntity() {}

void GameEntity::Input(float deltaTime) {
    // This may remain empty if not overridden in children
}

void GameEntity::Update(float deltaTime) {
    // abstract behavior - should be overridden
}

void GameEntity::Render(SDL_Renderer* renderer) {
    // abstract behavior - should be overridden
}

// Sprite GameEntity::GetSprite() {
//     return mSprite;
// }


void GameEntity::SetRenderable(bool renderable) {
    mRenderable = renderable;
}

bool GameEntity::GetRenderable() {
    return mRenderable;
}


void GameEntity::AddComponent(ComponentType type, std::shared_ptr<Component> component) {
    // Don't try to set the game entity pointer here if we're still in the constructor
    // Just add the component to the map
    mComponents[type] = component;
    
    // If we already have a shared_ptr to this object, set the game entity on the component
    try {
        if (component) {
            component->SetGameEntity(shared_from_this());
            std::cout << "[DEBUG] Successfully set GameEntity on component" << std::endl;
        }
    } catch (const std::bad_weak_ptr& e) {
        // This will happen during construction, which is expected
        // Just store the component without setting its owner yet
        std::cout << "[DEBUG] Could not set GameEntity yet (expected during construction)" << std::endl;
    }
}

template <typename T>
std::shared_ptr<T> GameEntity::GetComponent(ComponentType type) {
    auto found = mComponents.find(type);
    if (found != mComponents.end()) {
        return std::dynamic_pointer_cast<T>(found->second);
    }
    return nullptr;
}

bool GameEntity::TestCollision(std::shared_ptr<GameEntity> other) {
    auto aCollision = GetComponent<Collision2DComponent>(ComponentType::Collision2DComponent);
    auto bCollision = other->GetComponent<Collision2DComponent>(ComponentType::Collision2DComponent);
    
    if (!aCollision || !bCollision) {
        std::cerr << "TestCollision: Missing Collision2DComponent!" << std::endl;
        return false;
    }

    SDL_FRect a = aCollision->GetRectangle();
    SDL_FRect b = bCollision->GetRectangle();
    
    // Debug collision test
    std::cout << "Testing collision between entities at: " 
              << "A(" << a.x << "," << a.y << "," << a.w << "," << a.h << ") and "
              << "B(" << b.x << "," << b.y << "," << b.w << "," << b.h << ")" << std::endl;
    
    // Check for intersection
    bool collision = !(b.x + b.w <= a.x ||
                      a.x + a.w <= b.x ||
                      b.y + b.h <= a.y ||
                      a.y + a.h <= b.y);
                      
    if (collision) {
        std::cout << "COLLISION DETECTED!" << std::endl;
    }
    
    return collision;
}
void GameEntity::AddDefaultTransform() {
    std::cout << "Calling AddDefaultTransform() for " << typeid(*this).name() << " at " << this << std::endl;
    
    // Create the transform component
    auto transform = std::make_shared<TransformComponent>();
    
    // Just add it to the components map - don't try to set its owner yet
    mComponents[ComponentType::TransformComponent] = transform;
    
    // The owner relationship will be set later when InitializeComponents() is called
    std::cout << "[DEBUG] Added TransformComponent to " << typeid(*this).name() << " at " << this << "\n";
}



std::shared_ptr<TransformComponent> GameEntity::GetTransform() {
    return GetComponent<TransformComponent>(ComponentType::TransformComponent);
}

std::shared_ptr<GameEntity> GameEntity::GetThisPtr() {
    std::cout << "[DEBUG] Calling GetThisPtr() on " << typeid(*this).name() << " at " << this << std::endl;
    return shared_from_this();  // Safely returns shared_ptr to this
}

void GameEntity::InitializeComponents() {
    // Call this after the GameEntity is fully constructed and managed by a shared_ptr
    try {
        std::shared_ptr<GameEntity> thisPtr = shared_from_this();
        
        std::cout << "Initializing components for " << typeid(*this).name() << " at " << this << std::endl;
        
        for (auto& [type, component] : mComponents) {
            if (component) {
                std::cout << "  Setting GameEntity for component type " << static_cast<int>(type) << std::endl;
                component->SetGameEntity(thisPtr);
            }
        }
        
        // Specifically ensure texture component has reference to transform
        auto texture = GetComponent<TextureComponent>(ComponentType::TextureComponent);
        auto transform = GetTransform();
        
        if (texture && transform) {
            // Ensure texture dimensions match transform if not already set
            if (transform->GetW() <= 0) transform->SetW(40.0f);
            if (transform->GetH() <= 0) transform->SetH(40.0f);
            
            std::cout << "  Transform dimensions: " << transform->GetW() << "x" << transform->GetH() << std::endl;
        }
        
        std::cout << "Successfully initialized all components for " << typeid(*this).name() << std::endl;
    } catch (const std::bad_weak_ptr& e) {
        std::cerr << "[ERROR] InitializeComponents called before object is managed by shared_ptr" << std::endl;
    }
}



template std::shared_ptr<TextureComponent> GameEntity::GetComponent<TextureComponent>(ComponentType);
template std::shared_ptr<InputComponent> GameEntity::GetComponent<InputComponent>(ComponentType);
template std::shared_ptr<TransformComponent> GameEntity::GetComponent<TransformComponent>(ComponentType);
