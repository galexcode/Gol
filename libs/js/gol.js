var Gol,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Gol = (function() {

  function Gol() {
    this.animate = __bind(this.animate, this);

    this.point = __bind(this.point, this);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  Gol.prototype.point = function(state) {
    var material, mesh, point;
    point = new THREE.SphereGeometry(70, 32, 16);
    material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    mesh = new THREE.Mesh(point, material);
    return this.scene.add(mesh);
  };

  Gol.prototype.animate = function() {
    requestAnimationFrame(animate);
    return this.renderer.render(this.scene, this.camera);
  };

  return Gol;

})();
