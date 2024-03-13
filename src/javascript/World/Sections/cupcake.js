
// variable for  mesh object
var renderer, camera, scene;
var sphere;
var cone;
var cones = [];
var cupcakes = [];
var coneGroup = new THREE.Group();	
var targetRotation = 0;
var mouseX = 0;
var mouseY= 0;

init();

function init(scene){
	// set up ortho camera
	// camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 2000, 1000 );
	// camera.zoom = 1.5;
	// camera.updateProjectionMatrix();

	// create scene
	// scene = new THREE.Scene();

	// add light 
	var ambientLight = new THREE.AmbientLight(0xffffbb, .6);
	scene.add(ambientLight);

	var light = new THREE.PointLight( 0xffffff, 1.5, 1500);
	light.position.set( 0, 500, 500 ); 
	scene.add( light );
	var lightTwo = new THREE.PointLight( 0xffffff, 1.5, 1500);
	lightTwo.position.set( 500, 500, 500 );
	scene.add( lightTwo );

	// create renderer
	// renderer = new THREE.WebGLRenderer({alpha: true});
	// renderer.setSize(window.innerWidth, window.innerHeight);
 
	// append it to the DOM
	// document.body.appendChild(renderer.domElement);

	// load Blender mesh - cupcake
  var loader = new THREE.JSONLoader();
  loader.load('https://raw.githubusercontent.com/ellenprobst/sugar-3D/master/cupcake-lowpoly.json', generateMesh );
  
};


// generate cupcake mesh 
function generateMesh(geometry, material){
	geometry.computeVertexNormals();
    var cupcake = new THREE.Mesh(geometry, material);
    
		cupcake.position.y = 0;
		cupcake.position.z = 0;
		cupcake.rotation.z = randBetween(.0, .25);
		
		cupcake.scale.x = cupcake.scale.y = cupcake.scale.z = 70;
    cupcake.geometry.center();

		scene.add(cupcake);
		cupcakes.push( cupcake )
}

// create chocolate ice
var ice_choc = function(group) {

		var material = new THREE.MeshPhongMaterial({
			color: 0x3e1c12,
			specular: 0x3e3535
			});

		var geometry = new THREE.SphereGeometry(25,16,16);
		choc = new THREE.Mesh( geometry, material );
		choc.position.y = 25;
		choc.castShadow = true

		group.add( choc );
}


// create strawberry ice
var ice_straw = function(group) {
    var material = new THREE.MeshLambertMaterial({
        color: 0xf58acf
    });

		var geometry = new THREE.SphereGeometry(25,16,16);
		sphere = new THREE.Mesh( geometry, material );
		sphere.position.y = 25;
		sphere.castShadow = true

		group.add( sphere );	
}

// create cone 
var cone = function(group){	
    var material = new THREE.MeshLambertMaterial({
				color: 0xd77218
		});
  
		var geometry = new THREE.ConeGeometry( 26, 90, 16 );
		
    coneMesh = new THREE.Mesh(geometry, material);
		coneMesh.position.y = -20;
		coneMesh.rotation.x = ( Math.PI );

		group.add(coneMesh);
}

function randBetween(min, max) {
	return (Math.random() * (max - min)) + min;
}

// group cone and ice cream
function createGroup(ice) {
	var group = new THREE.Group();	
	var x = randBetween(-520,500),
		y = randBetween(-320,320),
		z = randBetween(-1000,-300);

	group.position.set(x,y,z);
	group.castShadow = true;
	group.scale.x = group.scale.y = group.scale.z = .5;
	
	ice(group);	
	cone(group);
	
	//randomize the rotation speed 
    group.rotateAt = randBetween(0.01, 0.03);	
    cones.push(group);
    coneGroup.add(group);
    scene.add( coneGroup );
}

for (var i = 0; i <= 25; i++) {
	createGroup(ice_straw);
	createGroup(ice_choc);
} 

// add eventlistener
document.addEventListener('mousemove', onMouseMove, false);

// Follows the mouse event
function onMouseMove(event) {
  event.preventDefault();
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = - (event.clientY / window.innerHeight) * 2 + 1;
};
 
function render(){
	requestAnimationFrame( render );
	cones.forEach((mesh)=>{
		mesh.rotation.x += mesh.rotateAt;
		mesh.rotation.y += mesh.rotateAt;
		mesh.rotation.z += mesh.rotateAt;
	});
	
	cupcakes.forEach((mesh)=>{
		mesh.rotation.y = mouseX * 2;
		mesh.rotation.x = mouseY * 2;
	});
  
	renderer.render( scene,camera );
}

render();


