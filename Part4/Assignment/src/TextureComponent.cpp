#include "TextureComponent.hpp"
#include "GameEntity.hpp"

TextureComponent::TextureComponent() {}

TextureComponent::~TextureComponent() {}

void TextureComponent::CreateTextureComponent(SDL_Renderer* renderer, std::string filePath, float x, float y) {
    mTexture = ResourceManager::Instance().LoadTexture(renderer, filePath);
    
    // Instead of setting the position here, we'll set it on the transform component
    // when the game entity is fully initialized
}

ComponentType TextureComponent::GetType() {
    return ComponentType::TextureComponent;
}

void TextureComponent::Render(SDL_Renderer* renderer) {
    if (!mTexture || !mGameEntity) return;
    
    // Get the transform component from the game entity
    auto transform = mGameEntity->GetTransform();
    if (!transform) return;
    
    // Use the transform's rectangle for rendering
    SDL_FRect rect = transform->GetRectangle();
    
    if (mTexture) {
        SDL_RenderCopyF(renderer, mTexture.get(), nullptr, &rect);
    } else {
        SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
        SDL_RenderFillRectF(renderer, &rect);
    }
}

// These methods now delegate to the transform component

void TextureComponent::Move(float x, float y) {
    if (!mGameEntity) return;
    auto transform = mGameEntity->GetTransform();
    if (transform) transform->Move(x, y);
}

void TextureComponent::SetX(float x) {
    if (!mGameEntity) return;
    auto transform = mGameEntity->GetTransform();
    if (transform) transform->SetX(x);
}

void TextureComponent::SetY(float y) {
    if (!mGameEntity) return;
    auto transform = mGameEntity->GetTransform();
    if (transform) transform->SetY(y);
}

float TextureComponent::GetX() const {
    if (!mGameEntity) return 0.0f;
    auto transform = mGameEntity->GetTransform();
    return transform ? transform->GetX() : 0.0f;
}

float TextureComponent::GetY() const {
    if (!mGameEntity) return 0.0f;
    auto transform = mGameEntity->GetTransform();
    return transform ? transform->GetY() : 0.0f;
}

void TextureComponent::SetW(int w) {
    if (!mGameEntity) return;
    auto transform = mGameEntity->GetTransform();
    if (transform) transform->SetW(static_cast<float>(w));
}

void TextureComponent::SetH(int h) {
    if (!mGameEntity) return;
    auto transform = mGameEntity->GetTransform();
    if (transform) transform->SetH(static_cast<float>(h));
}

SDL_FRect TextureComponent::getRectangle() {
    if (!mGameEntity) return {0.0f, 0.0f, 0.0f, 0.0f};
    auto transform = mGameEntity->GetTransform();
    return transform ? transform->GetRectangle() : SDL_FRect{0.0f, 0.0f, 0.0f, 0.0f};
}