import Scene from "./class/scene";
import { PhysicsManager } from "./class/physicsManager";

const scene = new Scene();
//scene.physicsManager = new PhysicsManager(scene.scene);

function display() {
    requestAnimationFrame(display);
    scene.renderer.render(scene.scene, scene.camera);
}

display();
