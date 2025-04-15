#pragma once

#include "Component.hpp"
#include "ResourceManager.hpp"
#include <SDL2/SDL.h>
#include <memory>
#include <string>

class TextureComponent : public Component {
    public:
        TextureComponent();
        ~TextureComponent();
    
        void CreateTextureComponent(SDL_Renderer* renderer, std::string filePath, float x = 0.0f, float y = 0.0f);
        void Render(SDL_Renderer* renderer) override;
    
        // These methods now delegate to the transform component
        void Move(float x, float y);
        void SetX(float x);
        void SetY(float y);
        float GetX() const;
        float GetY() const;
    
        void SetW(int w);
        void SetH(int h);
        SDL_FRect getRectangle();
    
        ComponentType GetType() override;
    
    private:
        std::shared_ptr<SDL_Texture> mTexture;
        // We no longer keep a rectangle here, it's in the transform component
    };