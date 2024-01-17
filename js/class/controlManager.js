import * as THREE from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';

export class DraggablesManager {
  constructor(objects, camera, renderer, scene) {
    this.objects = objects;
    this.dragControls = new DragControls(this.objects, camera, renderer.domElement);

    //this.dragControls.addEventListener('hoveron', this.onHoverOn.bind(this));
    //this.dragControls.addEventListener('hoveroff', this.onHoverOff.bind(this));

  }

  addObject(object) {
    this.objects.push(object);
    this.dragControls.setObjects(this.objects);
  }

  onHoverOn(event) {
    // Add your logic when hovering on an object
    const hoveredObject = event.object;
    console.log('Hovered on:', hoveredObject);
  }

  onHoverOff(event) {
    // Add your logic when hovering off an object
    const unhoveredObject = event.object;
    console.log('Hovered off:', unhoveredObject);
  }
}
