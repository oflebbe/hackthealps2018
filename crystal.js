var container, scene, camera, renderer, group;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;


var crystal_width;
var crystal_height;

var crystal_params = [];

var hexShape;

function crystal_init(definitions) {
    container = document.createElement('div');
    $('#tamagochi').append(container);

    scene = new THREE.Scene();

    hexShape = new THREE.Shape();
    hexShape.moveTo(0, 0.8);
    hexShape.lineTo(0.4, 0.5);
    hexShape.lineTo(0.3, 0);
    hexShape.lineTo(-0.3, 0);
    hexShape.lineTo(-0.4, 0.5);
    hexShape.lineTo(0, 0.8);

    crystal_width = container.offsetWidth;
    crystal_height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(50, crystal_width / crystal_height, 1, 1000);
    camera.position.z = 750;
    scene.add(camera);

    var light = new THREE.PointLight(0xffffff, 0.8);
    camera.add(light);

    group = new THREE.Group();
    group.position.y = 50;

    init_crystal_params(definitions);

    update_crystal(group, definitions)

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0x12d2d3);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(crystal_width, crystal_height);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function update_single_crystal_param(definition) {
    var s = scaleit(definition);
    var new_number = Math.floor( s);
    for (var j = definition.crystal_params.length; j < new_number; j++) {
        param = {
            color: definition.color,
            rx: Math.random() * 2 * Math.PI,
            ry: Math.random() * 2 * Math.PI,
            rz: Math.random() * 2 * Math.PI,
            length: s,
        }
        definition.crystal_params.push( param)
    }
}

function init_crystal_params(definitions) {
    for (var i = 0; i < definitions.length; i++) {
        definitions[i].crystal_params = [];
        update_single_crystal_param( definitions[i]);
    }
}

function update_crystal( group, definitions) {
    var childs = group.children;
    for (var k = 0; childs.length; k++) {
        group.remove( childs[k]);
    }

    for (var i = 0; i < definitions.length; i++) {
        update_single_crystal_param( definitions[i]);
        for (var j = 0; j < definitions[i].crystal_params.length; j++) {
            var spike = create_spike( definitions[i].crystal_params[j]);
            group.add(spike);
        }
    }
}


// Create a single spike with parans
function create_spike(param) {

    var extrudeSettings = {
        amount: param.length,  // Length
        bevelEnabled: true, // Top
        bevelSegments: 1,
        steps: 1,
        bevelSize: 20, // diameter
        bevelThickness: 35 //length of top
    };

    var geometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);

    var meshMaterial = new THREE.MeshStandardMaterial({color: param.color});
    var mesh = new THREE.Mesh(geometry, meshMaterial);

    mesh.position.set(0, 0, 0);
    mesh.rotation.set(param.rx, param.ry, param.rz);
   // mesh.scale(1, 1, 1);
    return mesh;
}

function scaleit(definition) {
    return Math.log10(definition.value + 1) * definition.xscale + definition.yoff
}

function onWindowResize() {

    crystal_width = container.offsetWidth;
    crystal_height = window.innerHeight;

    camera.aspect = crystal_width / crystal_height;
    camera.updateProjectionMatrix();

    renderer.setSize(crystal_width, crystal_height);
}

function crystal_animate() {
    targetRotation = 0.03;
    requestAnimationFrame(crystal_animate);

    group.rotation.y += targetRotation;
    group.rotation.z += 0.005;
    renderer.render(scene, camera);
}