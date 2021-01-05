#include "space.h"

#include "app_exceptions.h"
#include <iterator>


Space::Space() :
    MODEL { 1.0f },
    m_scenes {} {}

Space::~Space() {
    ClearScenes();
}

void Space::AddScene(SceneSPtr& scene) {
    m_scenes.push_back(scene);
}

void Space::DeleteScene(size_t index) {
    if (index >= m_scenes.size()) return;

    m_scenes[index].reset();
    m_scenes.erase(std::next(m_scenes.begin(), index));
}

void Space::ClearScenes() {
    for (SceneSPtr& scene : m_scenes) {
        scene.reset();
    }

    m_scenes.clear();
}

void Space::Processing() {
    for (SceneSPtr& scene : m_scenes) {
        scene->Processing();
    }
}
