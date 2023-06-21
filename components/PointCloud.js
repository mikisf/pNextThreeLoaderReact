import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import { PointCloudOctree, Potree } from '@pnext/three-loader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const PointCloud = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let scene, camera, renderer;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const pointClouds = []

        scene = new THREE.Scene();
        scene.background = new THREE.Color("#ffbdbd");
        camera = new THREE.PerspectiveCamera(1, width / height, 1, 100000);
        camera.position.set(100, 100, 100);
        renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        const potree = new Potree()
        potree.pointBudget = 2_000_000
        const baseUrl = "/"
        potree.loadPointCloud(
            'cloud.js',
            url => `${baseUrl}${url}`
        ).then(pco => {
            console.log(pco)
            pco.moveToOrigin()
            pco.translateZ(3);
            pco.rotateX(-Math.PI / 2);
            pointClouds.push(pco)
            scene.add(pco)

            render()
        });

        const render = () => {
            //console.log("render")
            renderer.render(scene, camera)
            potree.updatePointClouds(pointClouds, camera, renderer)
        }
        render()

        const animate = () => {
            requestAnimationFrame(animate);
            render()
        }
        animate()

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.update()
        controls.addEventListener('change', render);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            render()
        }, false);

        return () => {
            // Clean up resources
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default PointCloud;
