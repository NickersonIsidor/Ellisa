#pragma once

#include "Component.hpp"
#include "ComponentType.hpp"
#include <SDL2/SDL.h>
#include "Collision2DComponent.hpp"


class Collision2DComponent : public Component {
public:
    Collision2DComponent();
    ~Collision2DComponent();

    ComponentType GetType() override { return ComponentType::Collision2DComponent; }

    void Input(float deltaTime) override {}
    void Update(float deltaTime) override;
    void Render(SDL_Renderer* renderer) override;

    void Move(float dx, float dy);
    
    float GetX() const;
    float GetY() const;
    float GetW() const;
    float GetH() const;

    void SetX(float x);
    void SetY(float y);
    void SetW(float w);
    void SetH(float h);

    SDL_FRect& GetRectangle();

private:
    SDL_FRect mRectangle;
};

template std::shared_ptr<Collision2DComponent> GameEntity::GetComponent<Collision2DComponent>(ComponentType);