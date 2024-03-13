import * as THREE from 'three'

export default class CrossroadsSection
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.resources = _options.resources
        this.objects = _options.objects
        this.areas = _options.areas
        this.tiles = _options.tiles
        this.debug = _options.debug
        this.x = _options.x
        this.y = _options.y

        // Set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        this.setStatic()
        this.setTiles()
    }

    setStatic()
    {
        // this.objects.add({
        //     base: this.resources.items.crossroadsStaticBase.scene,
        //     collision: this.resources.items.crossroadsStaticCollision.scene,
        //     floorShadowTexture: this.resources.items.crossroadsStaticFloorShadowTexture,
        //     offset: new THREE.Vector3(this.x, this.y, 0),
        //     mass: 0
        // })

        const txt = 'YashaDaNagar'
        // const txt = 'यशदानगर'

        const txtgeometry = new THREE.TextGeometry( txt, {
            font: this.resources.items.font1,
            size: 2,
            height: 1,
            curveSegments: 10,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
        } );

        const scene = new THREE.Scene();

        // const geometry = new THREE.BoxGeometry( 0.7, 0.4, 2 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
        const titleMesh = new THREE.Mesh( txtgeometry, material );

        // titleMesh.name = 'ydn_center_01';
        titleMesh.name = `ydn_${txt}_${Date.now()}`;
        titleMesh.rotation.x = Math.PI / 2;
        // titleMesh.position.z = -0.5;
        // titleMesh.position.x = -0.4;
        // titleMesh.position.y = -0.2;
        // titleMesh.position.set(0, -10, 0);
        
        // titleMesh.rotation.set(new THREE.Vector3( 0, Math.PI / 2, 0));

        scene.add(titleMesh);

        // return scene;

        this.objects.add({
            base: scene,
            // collision: this.resources.items.crossroadsStaticCollision.scene,
            collision: scene,
            floorShadowTexture: this.resources.items.crossroadsStaticFloorShadowTexture,
            offset: new THREE.Vector3(this.x - 10, this.y, 1.5),
            mass: 0
        })
    }

    setTiles()
    {
        // To intro
        this.tiles.add({
            start: new THREE.Vector2(this.x, - 10),
            delta: new THREE.Vector2(0, this.y + 14)
        })

        // To projects
        this.tiles.add({
            start: new THREE.Vector2(this.x + 12.5, this.y),
            delta: new THREE.Vector2(7.5, 0)
        })

        // To projects
        this.tiles.add({
            start: new THREE.Vector2(this.x - 13, this.y),
            delta: new THREE.Vector2(- 6, 0)
        })
    }


    

}
