// main.cpp
#include "../include/Application.hpp"

int main(int argc, char* argv[]) {
    Application app(argc, argv);
    app.StartUp(argv);
    app.Loop(60.0f);
    app.ShutDown();

    return 0;
}
