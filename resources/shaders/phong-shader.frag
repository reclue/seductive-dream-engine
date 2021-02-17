#version 460 core

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct DirectionalLight {
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

struct PointLight {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

const int MAX_DIRECTIONAL_LIGHTS = 4;
const int MAX_POINT_LIGHTS = 12;
const int MAX_SPOT_LIGHTS = 6;

uniform Material material;
uniform DirectionalLight directionalLights[MAX_DIRECTIONAL_LIGHTS];
uniform PointLight pointLights[MAX_POINT_LIGHTS];
uniform vec3 cameraPosition;

in vec3 FragPos;
in vec3 Normal;

out vec4 FragColor;

void ApplyDirectionalLights(inout vec3 result) {
    const vec3 NORM = normalize(Normal);

    for (int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++) {
        const DirectionalLight directionalLight = directionalLights[i];

        const vec3 ambient = directionalLight.ambient * material.ambient;

        const vec3 lightDirection = normalize(-directionalLight.direction);
        const float diff = max(dot(NORM, lightDirection), 0.0f);
        const vec3 diffuse = directionalLight.diffuse * (diff * material.diffuse);

        const vec3 viewDirection = normalize(cameraPosition - FragPos);
        // Reflection vector along the normal axis
        const vec3 reflectDirection = reflect(-lightDirection, NORM);
        const float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), material.shininess);
        const vec3 specular = directionalLight.specular * (spec * material.specular);

        result += ambient + diffuse + specular;
    }
}

void ApplyPointLights(inout vec3 result) {
    const vec3 NORM = normalize(Normal);

    for (int i = 0; i < MAX_POINT_LIGHTS; i++) {
        const PointLight pointLight = pointLights[i];

        const vec3 ambient = pointLight.ambient * material.ambient;

        const vec3 lightDirection = normalize(pointLight.position - FragPos);
        const float diff = max(dot(NORM, lightDirection), 0.0f);
        const vec3 diffuse = pointLight.diffuse * (diff * material.diffuse);

        const vec3 viewDirection = normalize(cameraPosition - FragPos);
        // Reflection vector along the normal axis
        const vec3 reflectDirection = reflect(-lightDirection, NORM);
        const float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), material.shininess);
        const vec3 specular = pointLight.specular * (spec * material.specular);

        result += ambient + diffuse + specular;
    }
}

void main() {
    vec3 result = vec3(0.0f);

    ApplyDirectionalLights(result);
    ApplyPointLights(result);

    FragColor = vec4(result, 1.0f);
}
