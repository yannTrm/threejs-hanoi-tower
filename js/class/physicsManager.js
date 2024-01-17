import * as THREE from 'three';
import  Ammo  from '../build/ammo.js'; 

export class PhysicsManager {
  constructor(scene) {
    this.scene = scene;
    this.physicsWorld = null;
    this.collisionConfiguration = null;
    this.dispatcher = null;
    this.broadphase = null;
    this.solver = null;

    this.initPhysics();
  }

  initPhysics() {
    // Ammo.js initialization
    Ammo().then((AmmoLib) => {
      Ammo = AmmoLib;

      this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
      this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
      this.broadphase = new Ammo.btDbvtBroadphase();
      this.solver = new Ammo.btSequentialImpulseConstraintSolver();

      this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
        this.dispatcher,
        this.broadphase,
        this.solver,
        this.collisionConfiguration
      );

      this.physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0)); // Gravité vers le bas (ajustez selon vos besoins)
    });
  
    //this.animatePhysics();
  }

  animatePhysics() {
    const fixedTimeStep = 1.0 / 60.0; // Fixe le pas de temps à 60fps
    const maxSubSteps = 10; // Nombre maximal de sous-étapes

    const animate = () => {
      requestAnimationFrame(animate);

      if (this.physicsWorld) {
        this.physicsWorld.stepSimulation(fixedTimeStep, maxSubSteps);

        // Mettez à jour la position des objets graphiques en fonction de la simulation physique
        for (let i = 0; i < this.scene.children.length; i++) {
          const obj = this.scene.children[i];
          if (obj.userData.physics) {
            const physicsBody = obj.userData.physics.body;
            if (physicsBody) {
              const transform = new Ammo.btTransform();
              physicsBody.getMotionState().getWorldTransform(transform);

              const position = transform.getOrigin();
              obj.position.set(position.x(), position.y(), position.z());

              const rotation = transform.getRotation();
              obj.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
            }
          }
        }
      }
    };

    animate();
  }

  // Méthode pour ajouter un objet physique à la simulation
  addPhysicsObject(object, mass = 1) {
    if (!this.physicsWorld) return;

    const shape = new Ammo.btBoxShape(new Ammo.btVector3(object.scale.x * 0.5, object.scale.y * 0.5, object.scale.z * 0.5));
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    const motionState = new Ammo.btDefaultMotionState(transform);
    const localInertia = new Ammo.btVector3(0, 0, 0);

    if (mass !== 0) {
      shape.calculateLocalInertia(mass, localInertia);
    }

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new Ammo.btRigidBody(rbInfo);

    object.userData.physics = { body: body };

    this.physicsWorld.addRigidBody(body);
  }
}

