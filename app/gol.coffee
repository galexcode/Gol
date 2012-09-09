class Gol
  constructor: ->
    @projector = new THREE.Projector()
    @camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 1, 10000)
    @camera.position.set( 0, 1000, 0 )
    @scene = new THREE.Scene()
    @renderer = new THREE.WebGLRenderer()
    @renderer.setSize( window.innerWidth, window.innerHeight )
    ambientLight = new THREE.AmbientLight(0x555555)
    @scene.add(ambientLight)
    directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(1, 1, 1).normalize()
    @scene.add(directionalLight)
    document.body.appendChild( @renderer.domElement )
    @grid = @makeGrid(@gridSize, @gridSize, @gridSize)
    #document.addEventListener('mousemove', @mouseMove, false)
    document.addEventListener('click', @mouseClick, false)
    window.setInterval @nextGrid, 1000
    @win =
      w2: (window.innerWidth / 2)
      h2: (window.innerHeight / 2)

  gridSize: 15
  mouse: {}
  grid: []
  objects: [] #cache

  makeGrid: (height, width, depth) =>
    _.map(_.range(height),
      (y) => _.map(_.range(width),
        (x) => _.map(_.range(depth),
          (z) => @addCell {x,y,z}
        )))

  getCell: (x,y,z) =>
    @grid[x]?[y]?[z]

  mouseClick : (e) =>
    e.preventDefault()

    vector = new THREE.Vector3(
      ( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5
    )
    @projector.unprojectVector( vector, @camera )
    ray = new THREE.Ray(
      @camera.position, vector.subSelf( @camera.position ).normalize() )

    intersects = ray.intersectObjects( @objects )

    if intersects.length > 0
      #for point in intersects
      point = intersects[0]
      point.object.setState(true)

  addCell: (position={x:0,y:0,z:0}, state) =>
    for k,v of position
      position[k] = (v - ((@gridSize-1)/2)) * 70
    
    sphere = new THREE.SphereGeometry( 30, 16, 8 )
    material = new THREE.MeshLambertMaterial
      color: 0x000000
      ambient: 0x000000
    sphere.overdraw = true
    point = new THREE.Mesh( sphere, material )
    point.position = position
    point.state = null
    point.setState = (state) ->
      unless state == @state
        @state = state
        if state
          @material.color.setHex(0xffffff)
          @material.ambient.setHex(0xffffff)
        else
          @material.color.setHex(0x000000)
          @material.ambient.setHex(0x000000)
    
    _.bind(point.setState, point)
    @objects.push point
    @scene.add( point )
    return point
  
  countAlive: (cells) =>
    _.filter(cells, (c) ->  typeof c == 'object' && c.state == true).length

  getNeighbours: (x,y,z) =>
    neighbours = []
    for xx in _.range(x-1, x+2)
      for yy in _.range(y-1, y+2)
        for zz in _.range(z-1, z+2)
          continue if xx == x and yy == y and zz == z
          neighbours.push(@getCell(xx,yy,zz))
    neighbours

  applyRule: (x,y,z) =>
    neighbours = @getNeighbours(x,y,z)
    alive = @countAlive(neighbours)
    current = @getCell(x,y,z)
    if current
      if alive in [3,4]
        current.setState(true)
      else
        current.setState(false)
    else
      if alive == 3
        current.setState(true)
    return current

  nextGrid: =>
    range = _.range(@gridSize)
    for x in range
      for y in range
        for z in range
          @applyRule(x,y,z)

  addPattern: (pat, x=0, y=0) =>
    pat = pat.trim().split("\n")
    for line, xx in pat
      for cell, yy in line
        @grid[x+xx][y+yy][z+zz] = cell == '*'

  mouseMove: (e) =>
    @mouse.x = (e.clientX - @win.w2) * 4
    @mouse.y = (e.clientY - @win.h2) * 4
    @dirty = true

  animate: =>
    requestAnimationFrame( @animate )

    if @dirty
      @camera.position.x += ( @mouse.x || 0 - @camera.position.x ) * .05
      @camera.position.y += ( - @mouse.y || 0 - @camera.position.y ) * .05
      @dirty = false
    @camera.lookAt( @scene.position )
    timer = new Date().getTime() * 0.0005
    @camera.position.x = Math.floor(Math.cos( timer ) * 1000)
    @camera.position.z = Math.floor(Math.sin( timer ) * 1000)
    @renderer.render( @scene, @camera )

jQuery ->
  gol = new Gol()
  gol.animate()

#runit = (iterations) =>
  #_.times iterations, (i) =>
    #console.log("\f")
    #console.log("---------------------------")
    #console.log("Iteration ", i)
    #console.log("---------------------------")
    #print()
    #grid = nextGrid()

#print  = =>
  #printCell = (cell) =>
    #if cell
     #"\u2589"
    #else if cell?
      #"-"
    #else
      #" "
  #console.log(_.map(grid,
  #(line) => _.map(line, printCell).join("")).join("\n"))



#addPattern(fpentomino, 50, 50)
#addPattern(fpentomino, 20, 10)

# # Blinker
# grid[5][5] = true
# grid[5][4] = true
# grid[5][3] = true

#runit(1000)

