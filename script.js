// Virtual Radio Room – Three.js scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a0a1a);
scene.fog = new THREE.Fog(0x1a0a1a, 12, 35);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting
const ambient = new THREE.AmbientLight(0xffc0cb, 0.45);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xfff5ee, 0.9);
dirLight.position.set(5, 12, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
scene.add(dirLight);

const pointLight = new THREE.PointLight(0xff69b4, 0.6, 20);
pointLight.position.set(0, 4, 0);
scene.add(pointLight);

// ===== PINK FLOOR WITH GOLDEN STARS =====
const floorGeo = new THREE.PlaneGeometry(30, 30);
const floorMat = new THREE.MeshLambertMaterial({ color: 0xff69b4 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Golden stars on floor
function createStar(size) {
    const shape = new THREE.Shape();
    const spikes = 5;
    const outer = size;
    const inner = size * 0.4;
    for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = (i * Math.PI) / spikes - Math.PI / 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }
    shape.closePath();
    const geo = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffd700, emissive: 0x886600, emissiveIntensity: 0.35 });
    const star = new THREE.Mesh(geo, mat);
    star.rotation.x = -Math.PI / 2;
    return star;
}

for (let i = 0; i < 40; i++) {
    const star = createStar(0.15 + Math.random() * 0.25);
    star.position.set(
        (Math.random() - 0.5) * 26,
        0.02,
        (Math.random() - 0.5) * 26
    );
    star.rotation.z = Math.random() * Math.PI;
    scene.add(star);
}

// Walls (soft pink)
const wallMat = new THREE.MeshLambertMaterial({ color: 0xffb6c1, side: THREE.DoubleSide });
const wallH = 6;
const wallPositions = [
    { pos: [0, wallH / 2, -15], rot: [0, 0, 0], size: [30, wallH] },
    { pos: [0, wallH / 2, 15], rot: [0, Math.PI, 0], size: [30, wallH] },
    { pos: [-15, wallH / 2, 0], rot: [0, Math.PI / 2, 0], size: [30, wallH] },
    { pos: [15, wallH / 2, 0], rot: [0, -Math.PI / 2, 0], size: [30, wallH] }
];
wallPositions.forEach(w => {
    const geo = new THREE.PlaneGeometry(w.size[0], w.size[1]);
    const wall = new THREE.Mesh(geo, wallMat);
    wall.position.set(...w.pos);
    wall.rotation.set(...w.rot);
    scene.add(wall);
});

// Ceiling
const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshLambertMaterial({ color: 0xffc0cb })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = wallH;
scene.add(ceiling);

// ===== TWO SOFAS =====
function createSofa(x, z, rotY) {
    const group = new THREE.Group();
    const baseMat = new THREE.MeshLambertMaterial({ color: 0xdb7093 });
    const cushionMat = new THREE.MeshLambertMaterial({ color: 0xff85a2 });

    // Base / seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 1.4), baseMat);
    seat.position.y = 0.4;
    seat.castShadow = true;
    group.add(seat);

    // Backrest
    const back = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 0.35), baseMat);
    back.position.set(0, 1.05, -0.55);
    back.castShadow = true;
    group.add(back);

    // Armrests
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.7, 1.4), baseMat);
    armL.position.set(-1.55, 0.75, 0);
    group.add(armL);
    const armR = armL.clone();
    armR.position.x = 1.55;
    group.add(armR);

    // Cushions
    for (let i = -1; i <= 1; i++) {
        const cush = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 1.0), cushionMat);
        cush.position.set(i * 1.0, 0.7, 0.05);
        group.add(cush);
    }

    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    scene.add(group);
    return group;
}

createSofa(-6, 4, 0.3);
createSofa(6, 4, -0.3);

// ===== RADIO =====
const radioGroup = new THREE.Group();
const radioBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.0, 0.7),
    new THREE.MeshLambertMaterial({ color: 0x2f2f2f })
);
radioBody.position.y = 0.7;
radioBody.castShadow = true;
radioGroup.add(radioBody);

// Speaker grille
const grille = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.55, 0.05),
    new THREE.MeshLambertMaterial({ color: 0x444444 })
);
grille.position.set(-0.45, 0.7, 0.36);
radioGroup.add(grille);

// Display
const display = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.3, 0.05),
    new THREE.MeshLambertMaterial({ color: 0x111111, emissive: 0x003300, emissiveIntensity: 0.4 })
);
display.position.set(0.35, 0.85, 0.36);
radioGroup.add(display);

// Four buttons
const buttonColors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa29bfe];
const buttons = [];
const buttonLabels = ['Song 1', 'Song 2', 'Song 3', 'Song 4'];

for (let i = 0; i < 4; i++) {
    const btn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16),
        new THREE.MeshLambertMaterial({ color: buttonColors[i], emissive: buttonColors[i], emissiveIntensity: 0.25 })
    );
    btn.rotation.x = Math.PI / 2;
    btn.position.set(-0.5 + i * 0.35, 0.45, 0.4);
    btn.userData = { isButton: true, index: i, label: buttonLabels[i] };
    radioGroup.add(btn);
    buttons.push(btn);
}

// Legs / stand
const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.4, 0.3),
    new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
);
stand.position.y = 0.2;
radioGroup.add(stand);

radioGroup.position.set(0, 0, -8);
scene.add(radioGroup);

// Small table under radio
const table = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.15, 1.2),
    new THREE.MeshLambertMaterial({ color: 0x8b4513 })
);
table.position.set(0, 0.35, -8);
table.castShadow = true;
scene.add(table);
const tableLegGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8);
const tableLegMat = new THREE.MeshLambertMaterial({ color: 0x5c3317 });
[[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(tableLegGeo, tableLegMat);
    leg.position.set(lx, 0.175, -8 + lz);
    scene.add(leg);
});

// ===== PINK ROBOT WITH TRAY =====
const robot = new THREE.Group();

// Body
const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.4, 0.9, 16),
    new THREE.MeshLambertMaterial({ color: 0xff69b4 })
);
body.position.y = 0.85;
body.castShadow = true;
robot.add(body);

// Head
const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 16, 16),
    new THREE.MeshLambertMaterial({ color: 0xff85a2 })
);
head.position.y = 1.55;
robot.add(head);

// Eyes
const eyeMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), eyeMat);
eyeL.position.set(-0.12, 1.6, 0.28);
robot.add(eyeL);
const eyeR = eyeL.clone();
eyeR.position.x = 0.12;
robot.add(eyeR);

// Eye pupils (white glow)
const pupilMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });
const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), pupilMat);
pupilL.position.set(-0.12, 1.6, 0.34);
robot.add(pupilL);
const pupilR = pupilL.clone();
pupilR.position.x = 0.12;
robot.add(pupilR);

// Arms
const armMat = new THREE.MeshLambertMaterial({ color: 0xff69b4 });
const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 8), armMat);
armL.position.set(-0.5, 1.0, 0);
armL.rotation.z = 0.4;
robot.add(armL);
const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 8), armMat);
armR.position.set(0.5, 1.0, 0);
armR.rotation.z = -0.6;
robot.add(armR);

// Tray (held by right arm)
const tray = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.06, 0.5),
    new THREE.MeshLambertMaterial({ color: 0xc0c0c0 })
);
tray.position.set(0.75, 1.15, 0.15);
robot.add(tray);

// Cheese on tray
const cheese = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.12, 0.18),
    new THREE.MeshLambertMaterial({ color: 0xffd700 })
);
cheese.position.set(0.65, 1.24, 0.1);
robot.add(cheese);

// Wine glass / bottle
const wineBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.08, 0.08, 12),
    new THREE.MeshLambertMaterial({ color: 0x228b22 })
);
wineBase.position.set(0.9, 1.22, 0.15);
robot.add(wineBase);
const wineBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.28, 12),
    new THREE.MeshLambertMaterial({ color: 0x4b0082, transparent: true, opacity: 0.85 })
);
wineBody.position.set(0.9, 1.4, 0.15);
robot.add(wineBody);

// Wheels / base for rolling
const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 0.2, 16),
    new THREE.MeshLambertMaterial({ color: 0xff1493 })
);
base.position.y = 0.1;
robot.add(base);

robot.position.set(0, 0, 0);
scene.add(robot);

// ===== AUDIO =====
const tracks = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
];
let currentAudio = null;
const nowPlayingEl = document.getElementById('now-playing');

function playTrack(index) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    currentAudio = new Audio(tracks[index]);
    currentAudio.loop = false;
    currentAudio.volume = 0.7;
    currentAudio.play().catch(e => console.warn('Audio blocked until user interaction:', e));
    nowPlayingEl.style.display = 'block';
    nowPlayingEl.textContent = 'Now playing: ' + buttonLabels[index];
    currentAudio.onended = () => {
        nowPlayingEl.style.display = 'none';
    };
}

// ===== CONTROLS =====
const controls = new THREE.PointerLockControls(camera, document.body);
const instructions = document.getElementById('instructions');
const hud = document.getElementById('hud');

instructions.addEventListener('click', () => {
    controls.lock();
});

controls.addEventListener('lock', () => {
    instructions.style.display = 'none';
});
controls.addEventListener('unlock', () => {
    instructions.style.display = 'block';
});

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const move = { forward: false, back: false, left: false, right: false };

document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW': case 'ArrowUp': move.forward = true; break;
        case 'KeyS': case 'ArrowDown': move.back = true; break;
        case 'KeyA': case 'ArrowLeft': move.left = true; break;
        case 'KeyD': case 'ArrowRight': move.right = true; break;
    }
});
document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW': case 'ArrowUp': move.forward = false; break;
        case 'KeyS': case 'ArrowDown': move.back = false; break;
        case 'KeyA': case 'ArrowLeft': move.left = false; break;
        case 'KeyD': case 'ArrowRight': move.right = false; break;
    }
});

// Click interaction with radio buttons
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0); // center of screen for pointer lock

document.addEventListener('click', () => {
    if (!controls.isLocked) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buttons);
    if (intersects.length > 0) {
        const btn = intersects[0].object;
        // Only allow if reasonably close
        const dist = camera.position.distanceTo(radioGroup.position);
        if (dist < 4.5) {
            playTrack(btn.userData.index);
            // Visual feedback
            const orig = btn.material.emissiveIntensity;
            btn.material.emissiveIntensity = 1.2;
            setTimeout(() => { btn.material.emissiveIntensity = orig; }, 200);
        }
    }
});

// Starting position
camera.position.set(0, 1.7, 6);

// ===== ANIMATION =====
let robotAngle = 0;
const clock = new THREE.Clock();
const prevTime = performance.now();

function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = Math.min((time - prevTime) / 1000, 0.1);
    // prevTime update below

    if (controls.isLocked) {
        velocity.x -= velocity.x * 8.0 * delta;
        velocity.z -= velocity.z * 8.0 * delta;

        direction.z = Number(move.forward) - Number(move.back);
        direction.x = Number(move.right) - Number(move.left);
        direction.normalize();

        if (move.forward || move.back) velocity.z -= direction.z * 25.0 * delta;
        if (move.left || move.right) velocity.x -= direction.x * 25.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        // Keep player on floor and inside room
        camera.position.y = 1.7;
        camera.position.x = Math.max(-13.5, Math.min(13.5, camera.position.x));
        camera.position.z = Math.max(-13.5, Math.min(13.5, camera.position.z));

        // HUD for radio proximity
        const distToRadio = camera.position.distanceTo(radioGroup.position);
        hud.style.display = distToRadio < 4.5 ? 'block' : 'none';
    }

    // Robot circular path + slight left-right sway
    robotAngle += 0.4 * delta;
    const radius = 7;
    robot.position.x = Math.cos(robotAngle) * radius;
    robot.position.z = Math.sin(robotAngle) * radius;
    robot.rotation.y = -robotAngle + Math.PI / 2; // face direction of travel

    // Gentle bounce
    robot.position.y = Math.sin(time * 0.004) * 0.05;

    // Eye blink occasionally
    if (Math.sin(time * 0.002) > 0.98) {
        eyeL.scale.y = 0.2;
        eyeR.scale.y = 0.2;
        pupilL.scale.y = 0.2;
        pupilR.scale.y = 0.2;
    } else {
        eyeL.scale.y = 1;
        eyeR.scale.y = 1;
        pupilL.scale.y = 1;
        pupilR.scale.y = 1;
    }

    renderer.render(scene, camera);
    // update prevTime
    window._prevTime = time;
}

// Fix prevTime
let lastTime = performance.now();
function animateFixed() {
    requestAnimationFrame(animateFixed);
    const time = performance.now();
    const delta = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    if (controls.isLocked) {
        velocity.x -= velocity.x * 8.0 * delta;
        velocity.z -= velocity.z * 8.0 * delta;

        direction.z = Number(move.forward) - Number(move.back);
        direction.x = Number(move.right) - Number(move.left);
        direction.normalize();

        if (move.forward || move.back) velocity.z -= direction.z * 25.0 * delta;
        if (move.left || move.right) velocity.x -= direction.x * 25.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        camera.position.y = 1.7;
        camera.position.x = Math.max(-13.5, Math.min(13.5, camera.position.x));
        camera.position.z = Math.max(-13.5, Math.min(13.5, camera.position.z));

        const distToRadio = camera.position.distanceTo(radioGroup.position);
        hud.style.display = distToRadio < 4.5 ? 'block' : 'none';
    }

    robotAngle += 0.35 * delta;
    const radius = 7;
    robot.position.x = Math.cos(robotAngle) * radius;
    robot.position.z = Math.sin(robotAngle) * radius;
    robot.rotation.y = -robotAngle + Math.PI / 2;
    robot.position.y = Math.sin(time * 0.004) * 0.05;

    if (Math.sin(time * 0.002) > 0.98) {
        eyeL.scale.y = 0.15;
        eyeR.scale.y = 0.15;
        pupilL.scale.y = 0.15;
        pupilR.scale.y = 0.15;
    } else {
        eyeL.scale.y = 1;
        eyeR.scale.y = 1;
        pupilL.scale.y = 1;
        pupilR.scale.y = 1;
    }

    renderer.render(scene, camera);
}

animateFixed();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('Virtual Radio Room loaded.');
