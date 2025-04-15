#pragma once
#include <SDL2/SDL.h>
#include "ComponentType.hpp"
#include <memory>

class GameEntity;


struct Component {
    Component() {}

    virtual ~Component() {}

    virtual void Input(float deltaTime) {}

    virtual void Update(float deltaTime) {}

    virtual void Render(SDL_Renderer* renderer) {}

    // Pure virtual function must be implemented.
    virtual ComponentType GetType() = 0;

    // Set and get the owning GameEntity
    void SetGameEntity(std::shared_ptr<GameEntity> entity) {
        mGameEntity = entity;
    }

    std::shared_ptr<GameEntity> GetGameEntity() const {
        return mGameEntity;
    }

protected:
    std::shared_ptr<GameEntity> mGameEntity;
};