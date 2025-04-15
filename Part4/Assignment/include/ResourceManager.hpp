#pragma once

#include "SDL2/SDL.h"
#include <string>
#include <unordered_map>
#include <memory>

class ResourceManager {
    public:

        /**
         * @brief Gets the singleton instance of the ResourceManager.
         * 
         * This function returns the only instance of the ResourceManager, creating it
         * if it doesn't already exist. It follows the Singleton design pattern.
         * 
         * @return The singleton instance of the ResourceManager.
         */
        static ResourceManager& Instance();

        /**
         * @brief Loads a texture from a file and returns a shared pointer to it.
         * 
         * This function checks if the texture has already been loaded. If it has, it
         * returns the existing texture. If not, it loads the texture from the provided
         * file path, creates a texture from it, and stores it in a cache for future use.
         * 
         * @param renderer The SDL_Renderer used to create the texture from the surface.
         * @param filePath The file path to the image file that needs to be loaded.
         * 
         * @return A shared pointer to the loaded texture, or nullptr if the texture 
         *         could not be loaded or created.
         */
        std::shared_ptr<SDL_Texture> LoadTexture(SDL_Renderer* renderer, std::string filePath);

    private:
        ResourceManager() {}
        static ResourceManager* mInstance;
        std::unordered_map<std::string, std::shared_ptr<SDL_Texture>> mTextures;
};