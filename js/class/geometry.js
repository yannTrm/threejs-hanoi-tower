import * as THREE from 'three';


/**
 * Class representing a disk with a hole in the center.
 */
export class Disk {
  /**
   * Create a disk with a hole.
   * @param {number} radius - The radius of the disk.
   * @param {number} holeRadius - The hole radius of the disk (default 0.5).
   * @param {number} height - The height of the disk (default 0.5).
   * @param {string} texturePath - The file path for the disk texture image.
   * @param {number} mass - The mass of the disk (default 1).
   */
  constructor(radius, holeRadius = 0.1, height = 0.1, texturePath, mass = 1) {
    this.radius = radius;
    this.holeRadius = holeRadius;
    this.height = height;
    this.texturePath = texturePath;
    this.mass = 1;
    this.createDisk();
    this.setDefaultPosition();
  }

  /**
   * Create the geometry and material for the disk.
   */
  createDisk() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(this.texturePath);

    // Create the geometry of the disk
    const diskShape = new THREE.Shape();
    diskShape.moveTo(0, 0);
    diskShape.absarc(0, 0, this.radius, 0, Math.PI * 2, false);

    // Create the geometry of the hole
    const holeShape = new THREE.Path();
    holeShape.moveTo(0, 0);
    holeShape.absarc(0, 0, this.holeRadius, 0, Math.PI * 2, true);

    // Subtract the hole from the disk geometry
    diskShape.holes.push(holeShape);

    // Use ExtrudeGeometry to create the extruded geometry
    const extrudeSettings = {
      depth: this.height, // Extrusion thickness
      bevelEnabled: false, // No bevel to get a flat shape
    };

    const diskGeometry = new THREE.ExtrudeGeometry(diskShape, extrudeSettings);

    // Create the material with the texture
    const diskMaterial = new THREE.MeshBasicMaterial({ map: texture });

    // Create the mesh
    this.mesh = new THREE.Mesh(diskGeometry, diskMaterial);
    this.mesh.userData.physics = { mass: this.mass };

    // Add edges with a line material
    const edgesGeometry = new THREE.EdgesGeometry(diskGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

    // Add the edges to the main mesh
    //this.mesh.add(edges);
  }

  setDefaultPosition() {
    this.mesh.rotation.x = -Math.PI / 2; // -90° rotation X axis
    this.mesh.position.set(0, 0, 0);
  }

  /**
   * Set the position of the disk.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {number} z - The z-coordinate.
   */
  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  /**
   * Set the rotation of the disk.
   * @param {number} x - The rotation around the x-axis in radians.
   * @param {number} y - The rotation around the y-axis in radians.
   * @param {number} z - The rotation around the z-axis in radians.
   */
  setRotation(x, y, z) {
    this.mesh.rotation.set(x, y, z);
  }

  /**
   * Get the height of the disk.
   * @returns {number} The height of the disk.
   */
  getHeightDisk() {
    return this.height ;
  }

}


export class MainStructure {
  /**
   * Create the main structure with a base rectangle and three cylinders on top.
   * @param {number} baseWidth - The width of the base rectangle.
   * @param {number} baseDepth - The depth of the base rectangle.
   * @param {number} baseHeight - The height of the base rectangle.
   * @param {number} cylinderRadius - The radius of the cylinders.
   * @param {number} cylinderHeight - The height of the cylinders.
   * @param {string} baseTexturePath - The file path for the base texture image.
   * @param {string} cylinderTexturePath - The file path for the cylinder texture image.
   */
  constructor(baseWidth, baseDepth, baseHeight, cylinderRadius, cylinderHeight, baseTexturePath, cylinderTexturePath) {
    this.baseWidth = baseWidth;
    this.baseDepth = baseDepth;
    this.baseHeight = baseHeight;
    this.cylinderRadius = cylinderRadius;
    this.cylinderHeight = cylinderHeight;
    this.baseTexturePath = baseTexturePath;
    this.cylinderTexturePath = cylinderTexturePath;

    this.createMainStructure();
    this.setDefaultPosition();
  }

  /**
  * Create the geometry and material for the main structure.
  */
  createMainStructure() {
    const loader = new THREE.TextureLoader();

    // Calculate the extended width of the base rectangle
    const extendedWidth = this.baseWidth + 2 * this.cylinderRadius;

    // Calculate the width of each section
    const sectionWidth = this.baseWidth / 3;

    // Load textures
    const baseTexture = loader.load(this.baseTexturePath);
    const cylinderTexture = loader.load(this.cylinderTexturePath);

    // Create the base rectangle geometry with extended sides
    const baseGeometry = new THREE.BoxGeometry(extendedWidth, this.baseHeight, this.baseDepth);
    const baseMaterial = new THREE.MeshBasicMaterial({ map: baseTexture });
    this.baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    this.baseMesh.userData.physics = { mass: 1 }; // Set mass for the base

    // Create the cylinder geometry
    const cylinderGeometry = new THREE.CylinderGeometry(this.cylinderRadius, this.cylinderRadius, this.cylinderHeight, 32);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ map: cylinderTexture });

    // Create cylinders and position them in the middle of each section
    this.cylinder1 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    this.cylinder1.position.set(-extendedWidth / 2 + this.cylinderRadius + sectionWidth / 2, this.baseHeight / 2 + this.cylinderHeight / 2, 0);
    this.cylinder1.userData.physics = { mass: 1 }; // Set mass for the cylinder

    this.cylinder2 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    this.cylinder2.position.set(-extendedWidth / 2 + this.cylinderRadius + sectionWidth + sectionWidth / 2, this.baseHeight / 2 + this.cylinderHeight / 2, 0);
    this.cylinder2.userData.physics = { mass: 1 }; // Set mass for the cylinder

    this.cylinder3 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    this.cylinder3.position.set(-extendedWidth / 2 + this.cylinderRadius + 2 * sectionWidth + sectionWidth / 2, this.baseHeight / 2 + this.cylinderHeight / 2, 0);
    this.cylinder3.userData.physics = { mass: 1 }; // Set mass for the cylinder

    // Create a group to hold all the objects
    this.mainStructure = new THREE.Group();
    this.mainStructure.add(this.baseMesh);
    this.mainStructure.add(this.cylinder1);
    this.mainStructure.add(this.cylinder2);
    this.mainStructure.add(this.cylinder3);
  }

  setDefaultPosition() {
    this.mainStructure.position.set(0, 0, 0);
  }

  /**
   * Set the position of the main structure.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {number} z - The z-coordinate.
   */
  setPosition(x, y, z) {
    this.mainStructure.position.set(x, y, z);
  }

  /**
   * Set the rotation of the main structure.
   * @param {number} x - The rotation around the x-axis in radians.
   * @param {number} y - The rotation around the y-axis in radians.
   * @param {number} z - The rotation around the z-axis in radians.
   */
  setRotation(x, y, z) {
    this.mainStructure.rotation.set(x, y, z);
  }

  /**
   * Get the position of the left cylinder.
   * @returns {THREE.Vector3} The position of the left cylinder.
   */
  getLeftCylinderPosition() {
    return this.cylinder1.position.clone();
  }

  /**
   * Get the position of the center cylinder.
   * @returns {THREE.Vector3} The position of the center cylinder.
   */
  getCenterCylinderPosition() {
    return this.cylinder2.position.clone();
  }

  /**
   * Get the position of the right cylinder.
   * @returns {THREE.Vector3} The position of the right cylinder.
   */
  getRightCylinderPosition() {
    return this.cylinder3.position.clone();
  }
  /**
   * Get the height of the base.
   * @returns {number} The height of the base.
   */
  getHeightBase() {
    return this.baseHeight;
  }

}

