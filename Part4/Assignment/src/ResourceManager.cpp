#include "../include/ResourceManager.hpp"
#include <iostream>

ResourceManager* ResourceManager::mInstance = nullptr;

ResourceManager& ResourceManager::Instance() {
    if (mInstance == nullptr) {
        mInstance = new ResourceManager();
    }
    return *mInstance;
}

std::shared_ptr<SDL_Texture> ResourceManager::LoadTexture(SDL_Renderer* renderer, std::string filePath) {
    auto it = mTextures.find(filePath);
    if (it != mTextures.end()) {
        return it->second;
    }

    SDL_Surface* surface = SDL_LoadBMP(filePath.c_str());
    if (!surface) {
        std::cerr << "Failed to load surface: " << SDL_GetError() << std::endl;
        return nullptr;
    }

    SDL_Texture* texture = SDL_CreateTextureFromSurface(renderer, surface);
    SDL_FreeSurface(surface);

    if (!texture) {
        std::cerr << "Failed to create texture: " << SDL_GetError() << std::endl;
        return nullptr;
    }

    std::shared_ptr<SDL_Texture> sharedTexture(texture, SDL_DestroyTexture);
    mTextures[filePath] = sharedTexture;
    return sharedTexture;
}
