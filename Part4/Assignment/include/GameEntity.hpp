#pragma once

#include "TextureComponent.hpp"
#include <map>
#include "TransformComponent.hpp"
#include "iostream"

class GameEntity : public std::enable_shared_from_this<GameEntity> {
    public:
        /**
         * @brief Handles input for the game entity.
         * 
         * @param deltaTime The time elapsed since the last frame, used for frame-independent input handling.
         */
        GameEntity();

        virtual ~GameEntity();

        virtual void Input(float deltaTime);
        virtual void Update(float deltaTime);
        virtual void Render(SDL_Renderer* renderer);

        /**
         * @brief Compares the parameter rectangle with the calling GameEntities rectangle to see if there is any overlap.
         * 
         * @param otherRect The other rectangle to compare against.
        */
        bool TestCollision(std::shared_ptr<GameEntity> enemy);

        /**
         * @brief Sets whether the entity should be rendered or not.
         * 
         * @param renderable A boolean flag indicating if the entity should be drawn.
         */
        void SetRenderable(bool renderable);

        /**
         * @brief Checks if the entity is set to be rendered.
         * 
         * @return true If the entity should be rendered.
         * @return false If the entity should not be rendered.
         */
        bool GetRenderable();


        void AddComponent(ComponentType type, std::shared_ptr<Component> component);


        template <typename T>
        std::shared_ptr<T> GetComponent(ComponentType type);

        std::shared_ptr<GameEntity> GetThisPtr();

        void AddDefaultTransform();
        
        std::shared_ptr<TransformComponent> GetTransform();

        void InitializeComponents();

    protected:
        std::map<ComponentType, std::shared_ptr<Component>> mComponents;
        bool mRenderable{true};
};
