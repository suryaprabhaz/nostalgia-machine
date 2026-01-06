/**
 * ------------------------------------------------------------------
 * 3D ENGINE
 * ------------------------------------------------------------------
 */
const Engine = (() => {
    let scene, camera, renderer, machineGroup;
    let gears = []; // { mesh, baseSpeed, currentMult }
    let particles;
    let rafId;
    let lastTime = 0;

    const init = () => {
        if (!window.WebGLRenderingContext) {
            UI.showFallback();
            return;
        }

        try {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x111111);
            scene.fog = new THREE.FogExp2(0x111111, 0.08);

            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.set(0, 0, 9);

            renderer = new THREE.WebGLRenderer({ antialias: !CONFIG.IS_MOBILE, alpha: false });
            renderer.setSize(window.innerWidth, window.innerHeight);
            // PERFORMANCE: Cap pixel ratio
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.IS_MOBILE ? 1.5 : 2));
            renderer.shadowMap.enabled = !CONFIG.IS_MOBILE; // PERFORMANCE: No shadows on mobile
            if (!CONFIG.IS_MOBILE) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.2;

            document.getElementById('canvas-container').appendChild(renderer.domElement);

            createLighting();
            createMachine();
            // PERFORMANCE: Reduce/Kill particles on mobile
            if (!CONFIG.IS_MOBILE && !CONFIG.REDUCED_MOTION) {
                createParticles();
            }

            // Initial Enter Animation
            gsap.from(machineGroup.position, { y: -15, duration: 2.5, ease: "power4.out" });
            gsap.from(machineGroup.rotation, { y: Math.PI, duration: 2.5, ease: "power4.out" });

            // Hide Loader
            document.getElementById('loading-overlay').style.display = 'none';

            // Start Loop
            lastTime = performance.now();
            animate(lastTime);

            window.addEventListener('resize', onResize);
            // Interaction for parallax
            if (!CONFIG.IS_MOBILE) {
                window.addEventListener('mousemove', onMouseMove);
            }

        } catch (e) {
            console.error("WebGL Init Failed", e);
            UI.showFallback();
        }
    };

    const createLighting = () => {
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambient);

        const spotFixed = new THREE.SpotLight(0xffaa55, 2);
        spotFixed.position.set(5, 8, 8);
        spotFixed.angle = Math.PI / 4;
        if (!CONFIG.IS_MOBILE) {
            spotFixed.castShadow = true;
            spotFixed.shadow.mapSize.width = 1024;
            spotFixed.shadow.mapSize.height = 1024;
        }
        scene.add(spotFixed);

        const rimBlue = new THREE.SpotLight(0x4455ff, 2);
        rimBlue.position.set(-5, 0, -5);
        scene.add(rimBlue);
    };

    const createMachine = () => {
        machineGroup = new THREE.Group();

        const ironMat = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.iron, roughness: 0.4, metalness: 0.8 });
        const brassMat = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.brass, roughness: 0.3, metalness: 0.9 });
        const copperMat = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.copper, roughness: 0.5, metalness: 0.7 });

        // Body
        const baseGeom = new THREE.BoxGeometry(3, 4.5, 2);
        const base = new THREE.Mesh(baseGeom, ironMat);
        if (!CONFIG.IS_MOBILE) base.castShadow = true;
        base.receiveShadow = true;
        machineGroup.add(base);

        // Dome
        const dome = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), ironMat);
        dome.position.y = 2.25;
        machineGroup.add(dome);

        // Gears (Procedural)
        // SAFE GEAR ADDITION: Store in array with baseSpeed
        addGear(0.8, 16, brassMat, 0, 0.5, 1.1, 0.5);
        addGear(0.5, 10, copperMat, 1.1, 1.2, 1.1, -0.8);
        addGear(1.2, 24, ironMat, -1.2, -1, 1.15, 0.2);

        // Dial Needle
        const needle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.02), new THREE.MeshStandardMaterial({ color: 0xcc0000 }));
        needle.position.set(0, 1.35, 1.25); // Approximate visual placement
        machineGroup.add(needle);
        machineGroup.userData.needle = needle;

        // Coin Slot
        const slot = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.3), brassMat);
        slot.position.set(1.2, -1.5, 1);
        slot.rotation.z = 0.2;
        machineGroup.add(slot);

        scene.add(machineGroup);
    };

    const addGear = (radius, teeth, mat, x, y, z, speed) => {
        const g = new THREE.Group();
        const disk = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.2, teeth * 2), mat);
        disk.rotation.x = Math.PI / 2;
        g.add(disk);

        // PERFORMANCE: Low poly teeth for safety
        if (!CONFIG.IS_MOBILE) {
            const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.2), mat);
            for (let i = 0; i < teeth; i++) {
                const t = tooth.clone();
                const ang = (i / teeth) * Math.PI * 2;
                t.position.set(Math.cos(ang) * radius, Math.sin(ang) * radius, 0);
                t.rotation.z = ang;
                g.add(t);
            }
        }

        g.position.set(x, y, z);
        machineGroup.add(g);

        gears.push({
            mesh: g,
            baseSpeed: speed,
            currentMult: 1 // Mutate this for speed up
        });
    };

    const createParticles = () => {
        const count = 100;
        const geom = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 15;
        geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ color: 0xffaa00, size: 0.05, opacity: 0.6, transparent: true, blending: THREE.AdditiveBlending });
        particles = new THREE.Points(geom, mat);
        scene.add(particles);
    };

    const animate = (time) => {
        rafId = requestAnimationFrame(animate);
        const dt = Math.min((time - lastTime) / 1000, 0.1); // Cap delta to prevent huge jumps
        lastTime = time;

        // 1. Safe Gear Rotation
        gears.forEach(g => {
            g.mesh.rotation.z += g.baseSpeed * g.currentMult * dt;
        });

        // 2. Machine Idle Float
        if (machineGroup && !CONFIG.REDUCED_MOTION) {
            machineGroup.position.y = Math.sin(time * 0.0005) * 0.1;
            machineGroup.rotation.y = Math.sin(time * 0.0002) * 0.05;
        }

        if (particles) {
            particles.rotation.y = time * 0.00005;
        }

        renderer.render(scene, camera);
    };

    const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onMouseMove = (e) => {
        if (STATE.isProcessing) return;
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        gsap.to(machineGroup.rotation, {
            x: y * 0.3, y: x * 0.5, duration: 1, ease: 'power2.out'
        });
    };

    // Public API
    const zoomToSlot = () => {
        gsap.to(camera.position, { z: 6, y: -0.5, duration: 1.5, ease: "power2.inOut" });
    };

    const resetCamera = () => {
        gsap.to(camera.position, { x: 0, y: 0, z: 9, duration: 1.5 });
    };

    const processAnimation = (onFinish) => {
        const timeline = gsap.timeline();
        const needle = machineGroup.userData.needle;

        // Speed up gears
        timeline.to(gears.map(g => g), { currentMult: 40, duration: 2, ease: "power2.in" }, 0);

        // Shake
        timeline.to(machineGroup.position, { x: 0.05, yoyo: true, repeat: 20, duration: 0.05 }, 0);

        // Needle swing
        timeline.to(needle.rotation, { z: -Math.PI / 1.5, duration: 0.5 }, 0);

        timeline.call(() => AudioController.tick(), null, 0.5);

        timeline.to(gears.map(g => g), { currentMult: 1, duration: 2, ease: "power2.out" }, 2.5);
        timeline.to(needle.rotation, { z: Math.PI / 2, duration: 1.5, ease: "elastic.out(1, 0.3)" }, 2.5);

        timeline.call(() => {
            AudioController.chime();
            onFinish();
        }, null, 3.5);
    };

    return { init, zoomToSlot, resetCamera, processAnimation };
})();
