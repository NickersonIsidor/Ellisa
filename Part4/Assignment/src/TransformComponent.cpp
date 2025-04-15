#include "../include/TransformComponent.hpp"
#include <iostream>

TransformComponent::TransformComponent() {
    // Initialize with reasonable default values
    mRectangle = {0.0f, 0.0f, 40.0f, 40.0f};
    std::cout << "TransformComponent created with default size: " 
              << mRectangle.w << "x" << mRectangle.h << std::endl;
}

TransformComponent::~TransformComponent() {}

void TransformComponent::Move(float dx, float dy) {
    mRectangle.x += dx;
    mRectangle.y += dy;
}

float TransformComponent::GetX() const { return mRectangle.x; }
float TransformComponent::GetY() const { return mRectangle.y; }
float TransformComponent::GetW() const { return mRectangle.w; }
float TransformComponent::GetH() const { return mRectangle.h; }

void TransformComponent::SetX(float x) { 
    mRectangle.x = x; 
    //std::cout << "Transform X set to: " << x << std::endl;
}

void TransformComponent::SetY(float y) { 
    mRectangle.y = y; 
    //std::cout << "Transform Y set to: " << y << std::endl;
}

void TransformComponent::SetW(float w) { 
    mRectangle.w = w; 
    //std::cout << "Transform W set to: " << w << std::endl;
}

void TransformComponent::SetH(float h) { 
    mRectangle.h = h; 
    //std::cout << "Transform H set to: " << h << std::endl;
}

SDL_FRect& TransformComponent::GetRectangle() {
    return mRectangle;
}
