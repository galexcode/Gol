var Gol,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Gol = (function() {

  function Gol() {
    this.animate = __bind(this.animate, this);

    this.mouseMove = __bind(this.mouseMove, this);

    this.addPattern = __bind(this.addPattern, this);

    this.nextGrid = __bind(this.nextGrid, this);

    this.applyRule = __bind(this.applyRule, this);

    this.getNeighbours = __bind(this.getNeighbours, this);

    this.countAlive = __bind(this.countAlive, this);

    this.addCell = __bind(this.addCell, this);

    this.mouseClick = __bind(this.mouseClick, this);

    this.getCell = __bind(this.getCell, this);

    this.makeGrid = __bind(this.makeGrid, this);

    var ambientLight, directionalLight;
    this.projector = new THREE.Projector();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.set(0, 1000, 0);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    ambientLight = new THREE.AmbientLight(0x555555);
    this.scene.add(ambientLight);
    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);
    document.body.appendChild(this.renderer.domElement);
    this.grid = this.makeGrid(this.gridSize, this.gridSize, this.gridSize);
    document.addEventListener('click', this.mouseClick, false);
    window.setInterval(this.nextGrid, 1000);
    this.win = {
      w2: window.innerWidth / 2,
      h2: window.innerHeight / 2
    };
  }

  Gol.prototype.gridSize = 15;

  Gol.prototype.mouse = {};

  Gol.prototype.grid = [];

  Gol.prototype.objects = [];

  Gol.prototype.makeGrid = function(height, width, depth) {
    var _this = this;
    return _.map(_.range(height), function(y) {
      return _.map(_.range(width), function(x) {
        return _.map(_.range(depth), function(z) {
          return _this.addCell({
            x: x,
            y: y,
            z: z
          });
        });
      });
    });
  };

  Gol.prototype.getCell = function(x, y, z) {
    var _ref, _ref1;
    return (_ref = this.grid[x]) != null ? (_ref1 = _ref[y]) != null ? _ref1[z] : void 0 : void 0;
  };

  Gol.prototype.mouseClick = function(e) {
    var intersects, point, ray, vector;
    e.preventDefault();
    vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    this.projector.unprojectVector(vector, this.camera);
    ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
    intersects = ray.intersectObjects(this.objects);
    if (intersects.length > 0) {
      point = intersects[0];
      return point.object.setState(true);
    }
  };

  Gol.prototype.addCell = function(position, state) {
    var k, material, point, sphere, v;
    if (position == null) {
      position = {
        x: 0,
        y: 0,
        z: 0
      };
    }
    for (k in position) {
      v = position[k];
      position[k] = (v - ((this.gridSize - 1) / 2)) * 70;
    }
    sphere = new THREE.SphereGeometry(30, 16, 8);
    material = new THREE.MeshLambertMaterial({
      color: 0x000000,
      ambient: 0x000000
    });
    sphere.overdraw = true;
    point = new THREE.Mesh(sphere, material);
    point.position = position;
    point.state = null;
    point.setState = function(state) {
      if (state !== this.state) {
        this.state = state;
        if (state) {
          this.material.color.setHex(0xffffff);
          return this.material.ambient.setHex(0xffffff);
        } else {
          this.material.color.setHex(0x000000);
          return this.material.ambient.setHex(0x000000);
        }
      }
    };
    _.bind(point.setState, point);
    this.objects.push(point);
    this.scene.add(point);
    return point;
  };

  Gol.prototype.countAlive = function(cells) {
    return _.filter(cells, function(c) {
      return typeof c === 'object' && c.state === true;
    }).length;
  };

  Gol.prototype.getNeighbours = function(x, y, z) {
    var neighbours, xx, yy, zz, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    neighbours = [];
    _ref = _.range(x - 1, x + 2);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      xx = _ref[_i];
      _ref1 = _.range(y - 1, y + 2);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        yy = _ref1[_j];
        _ref2 = _.range(z - 1, z + 2);
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          zz = _ref2[_k];
          if (xx === x && yy === y && zz === z) {
            continue;
          }
          neighbours.push(this.getCell(xx, yy, zz));
        }
      }
    }
    return neighbours;
  };

  Gol.prototype.applyRule = function(x, y, z) {
    var alive, current, neighbours;
    neighbours = this.getNeighbours(x, y, z);
    alive = this.countAlive(neighbours);
    current = this.getCell(x, y, z);
    if (current) {
      if (alive === 3 || alive === 4) {
        current.setState(true);
      } else {
        current.setState(false);
      }
    } else {
      if (alive === 3) {
        current.setState(true);
      }
    }
    return current;
  };

  Gol.prototype.nextGrid = function() {
    var range, x, y, z, _i, _len, _results;
    range = _.range(this.gridSize);
    _results = [];
    for (_i = 0, _len = range.length; _i < _len; _i++) {
      x = range[_i];
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (_j = 0, _len1 = range.length; _j < _len1; _j++) {
          y = range[_j];
          _results1.push((function() {
            var _k, _len2, _results2;
            _results2 = [];
            for (_k = 0, _len2 = range.length; _k < _len2; _k++) {
              z = range[_k];
              _results2.push(this.applyRule(x, y, z));
            }
            return _results2;
          }).call(this));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Gol.prototype.addPattern = function(pat, x, y) {
    var cell, line, xx, yy, _i, _len, _results;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    pat = pat.trim().split("\n");
    _results = [];
    for (xx = _i = 0, _len = pat.length; _i < _len; xx = ++_i) {
      line = pat[xx];
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (yy = _j = 0, _len1 = line.length; _j < _len1; yy = ++_j) {
          cell = line[yy];
          _results1.push(this.grid[x + xx][y + yy][z + zz] = cell === '*');
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Gol.prototype.mouseMove = function(e) {
    this.mouse.x = (e.clientX - this.win.w2) * 4;
    this.mouse.y = (e.clientY - this.win.h2) * 4;
    return this.dirty = true;
  };

  Gol.prototype.animate = function() {
    var timer;
    requestAnimationFrame(this.animate);
    if (this.dirty) {
      this.camera.position.x += (this.mouse.x || 0 - this.camera.position.x) * .05;
      this.camera.position.y += (-this.mouse.y || 0 - this.camera.position.y) * .05;
      this.dirty = false;
    }
    this.camera.lookAt(this.scene.position);
    timer = new Date().getTime() * 0.0005;
    this.camera.position.x = Math.floor(Math.cos(timer) * 1000);
    this.camera.position.z = Math.floor(Math.sin(timer) * 1000);
    return this.renderer.render(this.scene, this.camera);
  };

  return Gol;

})();

jQuery(function() {
  var gol;
  gol = new Gol();
  return gol.animate();
});
