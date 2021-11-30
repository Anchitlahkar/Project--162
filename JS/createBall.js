AFRAME.registerComponent("create-ball", {
  schema: {},

  init: function () {
    // Do something when component first attached.
    this.throwBall();
  },

  throwBall: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "v") {
        var ball = document.createElement("a-entity");

        ball.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.4,
        });

        ball.setAttribute("material", "color", "black");

        var cam = document.querySelector("#camera");

        pos = cam.getAttribute("position");

        ball.setAttribute("position", {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        });
        ball.setAttribute("dynamic-body", {
          mass: 20,
        });

        ball.addEventListener("collide", this.removeBall);

        var camera = document.querySelector("#camera").object3D;

        //get the camera direction as Three.js vector
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        ball.setAttribute("velocity", direction.multiplyScalar(-10));

        var scene = document.querySelector("#scene");

        scene.appendChild(ball);
      }
    });
  },

  removeBall: function (e) {
    collideEl = e.detail.target.el;
    collideWith = e.detail.body.el;

    if (collideWith.id.includes("strike")) {
      collideEl.removeEventListener("collide", this.createBall);

      console.log("strike")

      var scene = document.querySelector("#scene");
      scene.removeChild(collideEl);
    }

    if (collideWith.id.includes("bowllingPin")) {
      var impulse = new CANNON.Vec3(-0.05, 0.02, 0.1);
      var worldPoint = new CANNON.Vec3().copy(
        collideWith.getAttribute("position")
      );
      collideWith.body.applyImpulse(impulse, worldPoint);
    }
  },
});
