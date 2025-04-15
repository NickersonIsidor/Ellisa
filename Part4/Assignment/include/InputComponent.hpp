#pragma once

#include "Component.hpp"
#include "ComponentType.hpp"
#include <SDL2/SDL.h>

// Forward declaration
class Player;

class InputComponent : public Component {
public:
    InputComponent() = default;
    virtual ~InputComponent() = default;

    void Input(float deltaTime) override;
    void Update(float deltaTime) override {}
    void Render(SDL_Renderer* renderer) override {}

    ComponentType GetType() override { return ComponentType::InputComponent; }

private:
    float mSpeed = 300.0f; // Player speed
};