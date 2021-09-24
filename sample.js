let modelNames = this["models"]
let modelNumber = 0;

// for A-Frame
//let cameraRig;
AFRAME.registerComponent('handler', {
    init: function () {
        console.log("A-Frame handler init...")
        //let marker = this.el;
        //let marker = this.el.sceneEl;

        document.querySelector("a-scene").renderer.gammaOutput=true;
        document.querySelector("a-scene").renderer.outputEncoding = THREE.sRGBEncoding

        // cameraRig = document.getElementById("camRig");

        // Set room model
        modelNumber = 1;
        createModel(modelNumber);
    }
});

let clock;
let stats;
window.onload = function() {
    console.log("window loaded...");

    // Init stats.js
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    Object.assign(stats.dom.style, {
        'position': 'fixed',
        'height': 'max-content',
        'left': 'auto',
        'right': 0,
    });
    document.body.appendChild( stats.dom );

    // Prevent the browser from expanding by double tapping
    document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });

    let selectBtnModel = document.getElementById("modelNumber");
    // Init select box info
    modelNames.forEach(function(name, index) {
        let option = document.createElement('option');
        option.setAttribute('value', index);
        option.innerHTML = name;
        selectBtnModel.appendChild(option);
    });
    // Init select box event
    selectBtnModel.onchange = function (ev) {
        modelNumber = parseInt(document.getElementById("modelNumber").value, 10) + 1;
        console.log("Changed model: ", modelNumber)
        removeModel(modelNumber);
        createModel(modelNumber);
    }
    // Prevents unexpected room changes due to the focus remaining in the select box
    selectBtnModel.onkeydown = function (e) {
        if (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "ArrowLeft" || e.key == "ArrowRight") {
            e.preventDefault();
        }
    }

    clock = new THREE.Clock();

    function render() {
        //demo.updatePosition();  
        requestAnimationFrame(render);

        // stats.begin();

        // stats.end();
    }
    render();
};

// window.addEventListener("keydown",keydown);
// function keydown(event){
//     if(event.keyCode==38){ // ArrowUp
//         console.log("ArrowUp")
//     }
// }

// window.addEventListener("keyup",keyup);
// function keyup(event){
//     if(event.keyCode==38 || event.keyCode==40 || event.keyCode==37 || event.keyCode==39){
//         console.log("KeyUp...");
//     }
// }

let model;
function createModel(modelNr){
    console.log("createModel: ", modelNr);

    let scene = document.querySelector('a-scene').object3D;

    //let model = null;
    const loader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('./libs/draco/');
    loader.setDRACOLoader( dracoLoader );
    loader.load(
        // resource URL
        "./model/" + modelNames[modelNr-1],
        // called when the resource is loaded
        function ( gltf ){
            model = gltf.scene;
            model.name = "model"+String(modelNr);
            model.position.set(0,0,0);
            model.rotation.set(0,0,0);
            model.scale.set(1.0, 1.0, 1.0);

            model.traverse( function ( child ) {
                if ( child.isMesh ) {
                    //console.log("isMesh...");
                    child.castShadow = true;
                }
            });

            scene.add(model);
        },
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has error
        function ( error ) {
            console.log('An error happened...');
            console.log(error);
        }
    );
}

function removeModel(modelNr){
    console.log("removeModel:", modelNr);

    let scene = document.querySelector('a-scene').object3D;
    scene.remove(model);
    disposeObjects(model);
    
}

function disposeObjects(model){
    console.log("disposeObjects...");

    model.traverse(obj => {
        if(obj.material){
            if(obj.material.map){
                obj.material.map.dispose();
            }
            if(obj.material.lightMap){
                obj.material.lightMap.dispose();
            }
            if(obj.material.aoMap){
                obj.material.aoMap.dispose();
            }
            if(obj.material.emissiveMap){
                obj.material.emissiveMap.dispose();
            }
            if(obj.material.bumpMap){
                obj.material.bumpMap.dispose();
            }
            if(obj.material.normalMap){
                obj.material.normalMap.dispose();
            }
            if(obj.material.displacementMap){
                obj.material.displacementMap.dispose();
            }
            if(obj.material.roughnessMap){
                obj.material.roughnessMap.dispose();
            }
            if(obj.material.metalnessMap){
                obj.material.metalnessMap.dispose();
            }
            if(obj.material.alphaMap){
                obj.material.alphaMap.dispose();
            }
            if(obj.material.envMap){
                obj.material.envMap.dispose();
            }
            obj.material.dispose();
        }
        if(obj.geometry){
            obj.geometry.dispose();
            //console.log("obj.geometry.dispose()...");
        }
        if(obj.texture){
            obj.texture.dispose();
            //console.log("obj.texture.dispose()...");
        }
    });
}

// function resetCameraRigInfo(){
//     console.log("resetCameraRigInfo...");
//     if(cameraRig){
//         cameraRig.object3D.position.set(0, 0, 0);
//         cameraRig.object3D.rotation.set(0, 0, 0);
//     }
// }