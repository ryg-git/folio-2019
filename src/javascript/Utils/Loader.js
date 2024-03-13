import EventEmitter from "./EventEmitter.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as THREE from "three";
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export default class Resources extends EventEmitter {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.setLoaders();

        this.toLoad = 0;
        this.loaded = 0;
        this.items = {};
    }

    /**
     * Set loaders
     */
    setLoaders() {
        this.loaders = [];

        // Images
        this.loaders.push({
            extensions: ["jpg", "png"],
            action: (_resource) => {
                const image = new Image();

                image.addEventListener("load", () => {
                    this.fileLoadEnd(_resource, image);
                });

                image.addEventListener("error", () => {
                    this.fileLoadEnd(_resource, image);
                });

                image.src = _resource.source;
            },
        });

        // Draco
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("draco/");
        dracoLoader.setDecoderConfig({ type: "js" });

        this.loaders.push({
            extensions: ["drc"],
            action: (_resource) => {
                dracoLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data);

                    DRACOLoader.releaseDecoderModule();
                });
            },
        });

        // GLTF
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        this.loaders.push({
            extensions: ["glb", "gltf"],
            action: (_resource) => {
                gltfLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data);
                });
            },
        });

        // FBX
        const fbxLoader = new FBXLoader();

        this.loaders.push({
            extensions: ["fbx"],
            action: (_resource) => {
                fbxLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data);
                });
            },
        });

        // TextGeometry
        const fontLoader = new THREE.FontLoader();
        const jsonLoader = new THREE.ObjectLoader();

        this.loaders.push({
            extensions: ["json"],
            action: (_resource) => {
                if (_resource.fontname === "cupcake") {
                    jsonLoader.load(
                        _resource.source,
                        (g) => {
                            var m = 1;
                            this.generateMesh(_resource, g, m);
                        }
                    );
                } else {
                    fontLoader.load(_resource.source, (_data) => {
                        this.fontLoadEnd(_resource, _data);
                    });
                }
            },
        });
    }

    /**
     * Load
     */
    load(_resources = []) {
        for (const _resource of _resources) {
            if (
                _resource.fontname === "gentilis_bold" ||
                _resource.fontname === "cupcake"
            ) {
                this.toLoad++;
                const loader = this.loaders.find((_loader) =>
                    _loader.extensions.find(
                        (_extension) => _extension === "json"
                    )
                );
                loader.action(_resource);
            } else {
                this.toLoad++;
                const extensionMatch = _resource.source.match(/\.([a-z]+)$/);

                if (typeof extensionMatch[1] !== "undefined") {
                    const extension = extensionMatch[1];
                    const loader = this.loaders.find((_loader) =>
                        _loader.extensions.find(
                            (_extension) => _extension === extension
                        )
                    );

                    if (loader) {
                        loader.action(_resource);
                    } else {
                        console.warn(`Cannot found loader for ${_resource}`);
                    }
                } else {
                    console.warn(`Cannot found extension of ${_resource}`);
                }
            }
        }
    }

    /**
     * File load end
     */
    fileLoadEnd(_resource, _data) {
        this.loaded++;
        this.items[_resource.name] = _data;

        this.trigger("fileEnd", [_resource, _data]);

        if (this.loaded === this.toLoad) {
            this.trigger("end");
        }
    }

    /**
     * Font load end
     */
    fontLoadEnd(_resource, _data) {
        this.loaded++;
        this.items[_resource.name] = _data;

        this.trigger("fontEnd", [_resource, _data]);

        if (this.loaded === this.toLoad) {
            this.trigger("end");
        }
    }

    generateMesh(_resource, geometry, material) {
        geometry.computeVertexNormals();
        var cupcake = new THREE.Mesh(geometry, material);

        cupcake.position.y = 0;
        cupcake.position.z = 0;
        cupcake.rotation.z = randBetween(0.0, 0.25);

        cupcake.scale.x = cupcake.scale.y = cupcake.scale.z = 70;
        cupcake.geometry.center();

        this.loaded++;
        this.items[_resource.name] = cupcake;

        this.trigger("cupcakeEnd", [_resource, cupcake]);

        if (this.loaded === this.toLoad) {
            this.trigger("end");
        }

        // scene.add(cupcake);
        // cupcakes.push(cupcake);
    }
}
