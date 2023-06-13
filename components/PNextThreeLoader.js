import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointCloudOctree, Potree } from '@pnext/three-loader';

export default function PNextThreeLoader() {

    const mountRef = useRef(null);
    const [rendererVar, setRendererVar] = useState()
    const [cameraVar, setCameraVar] = useState()
    const [sceneVar, setSceneVar] = useState()
    const [potreeVar, setPotreeVar] = useState()

    useEffect(() => {
        var container, camera, renderer, scene, controls

        init();
        render();

        function init() {
            container = document.createElement('div');
            scene = new THREE.Scene()
            setSceneVar(scene)
            scene.background = new THREE.Color("#ffbdbd");

            // Camera
            camera = new THREE.PerspectiveCamera(45, NaN, 0.1, 1000);
            setCameraVar(camera)
            camera.position.set(0, 0, 10);

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            setRendererVar(renderer)
            renderer.setSize(window.innerWidth, window.innerHeight);
            mountRef.current.appendChild(renderer.domElement);

            // Controls
            controls = new OrbitControls(camera, renderer.domElement);
            controls.update()

            // PNext Three Loader
            const potree = new Potree()
            setPotreeVar(potree)
            potree.pointBudget = 2_000_000

            window.addEventListener('resize', onWindowResize, false);
            controls.addEventListener('change', render);
        }

        function render() {
            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            render()
        }

        const localRef = mountRef.current ? mountRef.current : null;
        return () => localRef.removeChild(renderer.domElement);
    }, []);

    useEffect(() => {
        if (sceneVar === undefined) return
        const baseUrl = "https://cdn.rawgit.com/potree/potree/develop/pointclouds/lion_takanawa/"
        potreeVar.loadPointCloud(
            'cloud.js',
            url => `${baseUrl}${url}`
        ).then(pco => {
            console.log(pco)
            sceneVar.add(pco)
            potreeVar.updatePointClouds([pco], cameraVar, rendererVar)
            rendererVar.render(sceneVar, cameraVar);
        });
    }, [sceneVar]);

    function outsideRender() {
        rendererVar.render(sceneVar, cameraVar);
    }

    return (
        <div ref={mountRef} />
    )
}