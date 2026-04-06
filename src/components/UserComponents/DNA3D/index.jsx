import { useEffect, useRef, useState } from 'react';

function DNA3D() {
    const mountRef = useRef(null);

    const [scale, setScale] = useState(2);
    const [degree, setDegree] = useState(5);

    // 📱 responsive scale + degree
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 992) {
                setScale(1.5);
                setDegree(15); // mobile düz olsun
            } else {
                setScale(2);
                setDegree(5); // desktop rotate
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let animId;

        import('three').then((THREE) => {
            const el = mountRef.current;
            if (!el) return;

            const w = el.offsetWidth;
            const h = el.offsetHeight;

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(w, h);
            renderer.setClearColor(0x000000, 0);
            el.appendChild(renderer.domElement);

            const scene = new THREE.Scene();

            const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
            camera.position.set(0, 0, 16);

            const group = new THREE.Group();
            scene.add(group);

            const steps = 60;
            const height = 14;
            const radius = 2.5;
            const turns = 2.5;

            const pts1 = [], pts2 = [];

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const y = t * height - height / 2;
                const a = t * Math.PI * 2 * turns;

                pts1.push(new THREE.Vector3(
                    Math.cos(a) * radius,
                    y,
                    Math.sin(a) * radius
                ));

                pts2.push(new THREE.Vector3(
                    Math.cos(a + Math.PI) * radius,
                    y,
                    Math.sin(a + Math.PI) * radius
                ));
            }

            const curve1 = new THREE.CatmullRomCurve3(pts1);
            const curve2 = new THREE.CatmullRomCurve3(pts2);

            // 🎨 base color (#013778)
            const baseColor = new THREE.Color('#013778');

            const backboneColor = baseColor.clone().lerp(new THREE.Color(0xffffff), 0.25);

            const mat1 = new THREE.MeshPhongMaterial({ color: backboneColor, shininess: 100 });
            const mat2 = new THREE.MeshPhongMaterial({ color: backboneColor, shininess: 100 });
            const matR1 = new THREE.MeshPhongMaterial({ color: backboneColor, shininess: 80 });
            const matR2 = new THREE.MeshPhongMaterial({ color: backboneColor, shininess: 80 });

            group.add(new THREE.Mesh(
                new THREE.TubeGeometry(curve1, 200, 0.12, 10, false),
                mat1
            ));

            group.add(new THREE.Mesh(
                new THREE.TubeGeometry(curve2, 200, 0.12, 10, false),
                mat2
            ));

            const rungCount = 18;

            for (let i = 0; i <= rungCount; i++) {
                const t = i / rungCount;
                const y = t * height - height / 2;
                const a = t * Math.PI * 2 * turns;

                const p1 = new THREE.Vector3(
                    Math.cos(a) * radius,
                    y,
                    Math.sin(a) * radius
                );

                const p2 = new THREE.Vector3(
                    Math.cos(a + Math.PI) * radius,
                    y,
                    Math.sin(a + Math.PI) * radius
                );

                const dir = new THREE.Vector3().subVectors(p2, p1);
                const len = dir.length();
                const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

                const rMesh = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.07, 0.07, len, 8),
                    i % 2 === 0 ? matR1 : matR2
                );

                rMesh.position.copy(mid);
                rMesh.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    dir.clone().normalize()
                );

                group.add(rMesh);

                const dynamicColor = baseColor.clone()
                    .lerp(new THREE.Color(0xffffff), t * 0.65);

                const dynamicMat = new THREE.MeshPhongMaterial({
                    color: dynamicColor,
                    emissive: dynamicColor.clone().multiplyScalar(0.25),
                    shininess: 100
                });

                const altColor = baseColor.clone().multiplyScalar(0.8);

                const altMat = new THREE.MeshPhongMaterial({
                    color: altColor,
                    emissive: altColor.clone().multiplyScalar(0.2),
                    shininess: 100
                });

                const bGeo = new THREE.SphereGeometry(0.25, 16, 16);

                const isEven = i % 2 === 0;

                const b1 = new THREE.Mesh(bGeo, isEven ? dynamicMat : altMat);
                b1.position.copy(p1);

                const b2 = new THREE.Mesh(bGeo.clone(), isEven ? altMat : dynamicMat);
                b2.position.copy(p2);

                group.add(b1, b2);
            }

            scene.add(new THREE.AmbientLight(0xffffff, 0.6));

            const dl = new THREE.DirectionalLight(0xffffff, 1);
            dl.position.set(5, 10, 8);
            scene.add(dl);

            const dl2 = new THREE.DirectionalLight(0x88aaff, 0.4);
            dl2.position.set(-5, -5, -5);
            scene.add(dl2);

            const animate = () => {
                animId = requestAnimationFrame(animate);
                group.rotation.y += 0.01;
                renderer.render(scene, camera);
            };
            animate();

            const handleResize = () => {
                const nw = el.offsetWidth;
                const nh = el.offsetHeight;

                camera.aspect = nw / nh;
                camera.updateProjectionMatrix();
                renderer.setSize(nw, nh);
            };

            window.addEventListener('resize', handleResize);

            mountRef.current._cleanup = () => {
                cancelAnimationFrame(animId);
                window.removeEventListener('resize', handleResize);

                if (el.contains(renderer.domElement)) {
                    el.removeChild(renderer.domElement);
                }

                renderer.dispose();
            };
        });

        return () => {
            if (mountRef.current?._cleanup) {
                mountRef.current._cleanup();
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                width: '100%',
                height: '450px',
                transform: `scale(${scale}) rotate(${degree}deg)`,
                transition: 'transform 0.3s ease'
            }}
        />
    );
}

export default DNA3D;