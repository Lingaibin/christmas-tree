import React, {
    useRef,
    useState,
    useEffect,
    useMemo,
    useLayoutEffect,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose";
import * as THREE from "three";
import "./App.css";

// --- CONFIGURATION ---
const ROWS = 50;
const COUNT = ROWS * ROWS;
const ITEM_SIZE = 0.42;

// --- SNOW ---
const Snow = () => {
    const count = 2000;
    const mesh = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 40;
            const speed = 0.02 + Math.random() * 0.05;
            temp.push({ x, y, z, speed });
        }
        return temp;
    }, []);

    useFrame(() => {
        particles.forEach((p, i) => {
            p.y -= p.speed;
            if (p.y < -20) p.y = 20;
            dummy.position.set(p.x, p.y, p.z);
            dummy.scale.setScalar(1);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="white" transparent opacity={0.8} />
        </instancedMesh>
    );
};

// --- STAR TOPPER ---
const TreeStar = () => {
    const ref = useRef();
    useFrame((state) => {
        ref.current.rotation.y += 0.01;
        ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        ref.current.scale.setScalar(scale);
    });
    return (
        <group position={[0, 6.2, 0]}>
            <pointLight color="gold" intensity={2} distance={5} />
            <mesh ref={ref}>
                <octahedronGeometry args={[0.8, 0]} />
                <meshBasicMaterial color="#FFD700" toneMapped={false} />
            </mesh>
            <mesh>
                <sphereGeometry args={[1.2, 16, 16]} />
                <meshBasicMaterial
                    color="#FFD700"
                    transparent
                    opacity={0.2}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
};

// --- ATLAS ---
const useRealAnimalAtlas = () => {
    const [texture, setTexture] = useState(null);
    useEffect(() => {
        const generateAtlas = async () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, 1024, 1024);

            // Unsplash Images
            const imageUrls = [
                "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=256&q=80", // Lion
                "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=256&q=80", // Cat
                "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=256&q=80", // Dog
                "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=256&q=80", // Panda
                "https://images.unsplash.com/photo-1579972383667-4894c883d674?w=256&q=80", // Koala
                "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=256&q=80", // Fish
                "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?w=256&q=80", // Fox
                "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=256&q=80", // Fox2
                "https://images.unsplash.com/photo-1605559911160-a3d95d213904?w=256&q=80", // Monkey
                "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=256&q=80", // Lion2
                "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=256&q=80", // Parrot
                "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=256&q=80", // Penguin
                "https://images.unsplash.com/photo-1513039763578-cf2c1c5f8750?q=80&w=256", // Lizard
                "https://images.unsplash.com/photo-1544985361-b420d7a77043?q=80&w=256", // Leopard
                "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=256&q=80", // Deer
                "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=256&q=80", // Polar Bear
            ];
            const loadImg = (url) =>
                new Promise((r) => {
                    const i = new Image();
                    i.crossOrigin = "Anonymous";
                    i.src = url;
                    i.onload = () => r(i);
                    i.onerror = () => r(null);
                });
            const images = await Promise.all(imageUrls.map(loadImg));

            const cols = 4;
            const size = 256;
            const pad = 65;

            images.forEach((img, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x = col * size;
                const y = row * size;

                // Plate
                ctx.fillStyle = "rgba(10, 20, 30, 0.5)";
                ctx.fillRect(x + 5, y + 5, size - 10, size - 10);

                // LED Border
                ctx.shadowColor = "white";
                ctx.shadowBlur = 20;
                ctx.strokeStyle = "white";
                ctx.lineWidth = 5;
                ctx.strokeRect(x + 10, y + 10, size - 20, size - 20);
                ctx.shadowBlur = 0;

                // Image
                const innerSize = size - pad * 2;
                if (img) {
                    const min = Math.min(img.width, img.height);
                    ctx.drawImage(
                        img,
                        (img.width - min) / 2,
                        (img.height - min) / 2,
                        min,
                        min,
                        x + pad,
                        y + pad,
                        innerSize,
                        innerSize
                    );
                    ctx.strokeStyle = "rgba(255,255,255,0.3)";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x + pad, y + pad, innerSize, innerSize);
                } else {
                    ctx.fillStyle = "#333";
                    ctx.fillRect(x + pad, y + pad, innerSize, innerSize);
                }
            });
            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            setTexture(tex);
        };
        generateAtlas();
    }, []);
    return texture;
};

// --- SHADER ---
const vertexShader = `
  uniform float uTime;
  attribute vec3 aColor;     
  attribute float aImgIndex; 
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vImgIndex;
  void main() {
    vUv = uv;
    vColor = aColor;
    vImgIndex = aImgIndex;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uPhotoMix;
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vImgIndex;
  void main() {
    float cols = 4.0;
    float col = mod(vImgIndex, cols);
    float row = floor(vImgIndex / cols);
    row = cols - 1.0 - row; 
    vec2 atlasUV = (vUv / cols) + vec2(col / cols, row / cols);
    vec4 texColor = texture2D(uTexture, atlasUV);
    
    vec3 animalColor = texColor.rgb * 1.5; 
    animalColor = pow(animalColor, vec3(1.1)); 
    vec3 pixelColor = vColor * 2.5;
    
    vec3 finalColor = mix(animalColor, pixelColor, uPhotoMix);
    float finalAlpha = mix(texColor.a, 1.0, uPhotoMix);

    if(uPhotoMix < 0.5 && finalAlpha < 0.9) {
       finalColor = mix(finalColor, finalColor * vColor * 2.0, 0.5);
    }
    
    if (finalAlpha < 0.1) discard;
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

// --- LAYOUTS ---
const getTreeLayout = () => {
    const data = [];
    for (let i = 0; i < COUNT; i++) {
        const p = i / COUNT;
        const height = -6 + p * 11;
        const levels = 7;
        const levelP = (p * levels) % 1;
        const rBase = (1 - p) * 7.0;
        const rTier = (1 - levelP) * 2.0;
        const radius = rBase + rTier;
        const angle = i * 0.4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const rnd = Math.random();
        let r, g, b;
        if (rnd > 0.85) {
            r = 3.0;
            g = 0.1;
            b = 0.1;
        } else if (rnd > 0.75) {
            r = 3.0;
            g = 2.0;
            b = 0.2;
        } else if (rnd > 0.7) {
            r = 2.0;
            g = 2.0;
            b = 2.5;
        } else {
            const green = 0.5 + Math.random();
            r = 0.1;
            g = green * 1.5;
            b = 0.2;
        }

        data.push({ x, y: height, z, r, g, b });
    }
    return data;
};

// --- UPDATED EXPLOSION LOGIC ---
const getExplodeLayout = () => {
    const data = [];
    for (let i = 0; i < COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        // UPDATED: Start from radius 2 instead of 15.
        // This fills the center.
        const r = 2 + Math.random() * 16;

        data.push({
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.sin(phi) * Math.sin(theta),
            z: r * Math.cos(phi),
        });
    }
    return data;
};

const getPhotoLayout = () => {
    const data = [];
    for (let i = 0; i < COUNT; i++) {
        const col = i % ROWS;
        const row = Math.floor(i / ROWS);
        data.push({
            x: (col - ROWS / 2) * (ITEM_SIZE * 1.5),
            y: -(row - ROWS / 2) * (ITEM_SIZE * 1.5),
            z: 0,
        });
    }
    return data;
};

// --- PARTICLES ---
const Particles = ({ mode, photoColors }) => {
    const meshRef = useRef();
    const materialRef = useRef();
    const atlas = useRealAnimalAtlas();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const treeData = useMemo(() => getTreeLayout(), []);
    const explodeData = useMemo(() => getExplodeLayout(), []);
    const photoData = useMemo(() => getPhotoLayout(), []);

    const imgIndices = useMemo(() => {
        const arr = new Float32Array(COUNT);
        for (let i = 0; i < COUNT; i++) arr[i] = Math.floor(Math.random() * 16);
        return arr;
    }, []);

    const positions = useMemo(() => {
        const arr = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            arr[i * 3] = treeData[i].x;
            arr[i * 3 + 1] = treeData[i].y;
            arr[i * 3 + 2] = treeData[i].z;
        }
        return arr;
    }, [treeData]);

    const initialColors = useMemo(() => {
        const arr = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            arr[i * 3] = treeData[i].r;
            arr[i * 3 + 1] = treeData[i].g;
            arr[i * 3 + 2] = treeData[i].b;
        }
        return arr;
    }, [treeData]);

    useLayoutEffect(() => {
        if (meshRef.current) {
            meshRef.current.geometry.setAttribute(
                "aImgIndex",
                new THREE.InstancedBufferAttribute(imgIndices, 1)
            );
            meshRef.current.geometry.setAttribute(
                "aColor",
                new THREE.InstancedBufferAttribute(initialColors, 3)
            );
            treeData.forEach((d, i) => {
                dummy.position.set(d.x, d.y, d.z);
                dummy.lookAt(0, d.y, 0);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            });
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [dummy, treeData, imgIndices, initialColors]);

    useFrame((state) => {
        if (!meshRef.current || !materialRef.current) return;
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        const targetMix = mode === "PHOTO" ? 1.0 : 0.0;
        materialRef.current.uniforms.uPhotoMix.value +=
            (targetMix - materialRef.current.uniforms.uPhotoMix.value) * 0.08;

        let targetLayout = treeData;
        if (mode === "EXPLODE") targetLayout = explodeData;
        if (mode === "PHOTO") targetLayout = photoData;

        const colorAttr = meshRef.current.geometry.attributes.aColor;

        for (let i = 0; i < COUNT; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;
            positions[ix] += (targetLayout[i].x - positions[ix]) * 0.1;
            positions[iy] += (targetLayout[i].y - positions[iy]) * 0.1;
            positions[iz] += (targetLayout[i].z - positions[iz]) * 0.1;

            dummy.position.set(positions[ix], positions[iy], positions[iz]);
            if (mode === "PHOTO") dummy.rotation.set(0, 0, 0);
            else dummy.lookAt(0, positions[iy], 0);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);

            let tr, tg, tb;
            if (mode === "PHOTO" && photoColors) {
                tr = photoColors[ix];
                tg = photoColors[iy];
                tb = photoColors[iz];
            } else {
                tr = treeData[i].r;
                tg = treeData[i].g;
                tb = treeData[i].b;
            }
            colorAttr.array[ix] += (tr - colorAttr.array[ix]) * 0.1;
            colorAttr.array[iy] += (tg - colorAttr.array[iy]) * 0.1;
            colorAttr.array[iz] += (tb - colorAttr.array[iz]) * 0.1;
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
        colorAttr.needsUpdate = true;
    });

    const uniforms = useMemo(
        () => ({
            uTexture: { value: null },
            uTime: { value: 0 },
            uPhotoMix: { value: 0 },
        }),
        []
    );
    useEffect(() => {
        if (atlas && materialRef.current)
            materialRef.current.uniforms.uTexture.value = atlas;
    }, [atlas]);

    return (
        <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
            <planeGeometry args={[ITEM_SIZE, ITEM_SIZE]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                side={THREE.DoubleSide}
                transparent={true}
                depthWrite={false}
                toneMapped={false}
            />
        </instancedMesh>
    );
};

// --- CAMERA RIG ---
const CameraRig = ({ handPosRef, isHandDetected }) => {
    const { camera } = useThree();
    const mouse = useRef({ x: 0, y: 0 });
    useEffect(() => {
        const handleMove = (e) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);
    useFrame(() => {
        let targetX, targetY;
        if (isHandDetected) {
            targetX = handPosRef.current.x * 14;
            targetY = handPosRef.current.y * 7;
        } else {
            targetX = mouse.current.x * 8;
            targetY = mouse.current.y * 4;
        }
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
    });
    return null;
};

// --- MAIN APP ---
export default function App() {
    const webcamRef = useRef(null);
    const [model, setModel] = useState(null);
    const [mode, setMode] = useState("TREE");
    const [photoColors, setPhotoColors] = useState(null);
    const [status, setStatus] = useState("Initializing...");
    const [flash, setFlash] = useState(false);
    const [isHandDetected, setIsHandDetected] = useState(false);
    const handPosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                await tf.setBackend("webgl");
                await tf.ready();
                const net = await handpose.load();
                setModel(net);
                setStatus("Ready");
            } catch (e) {
                setStatus("Error: " + e.message);
            }
        };
        load();
    }, []);

    useEffect(() => {
        let anim;
        const detect = async () => {
            if (model && webcamRef.current?.video?.readyState === 4) {
                const video = webcamRef.current.video;
                const preds = await model.estimateHands(video);
                if (preds.length > 0) {
                    setIsHandDetected(true);
                    const lm = preds[0].landmarks;
                    const px = lm[0][0];
                    const py = lm[0][1];
                    handPosRef.current = {
                        x: (px / video.videoWidth - 0.5) * -2,
                        y: -(py / video.videoHeight - 0.5) * 2,
                    };
                    const iUp = lm[8][1] < lm[5][1];
                    const mUp = lm[12][1] < lm[9][1];
                    const rUp = lm[16][1] < lm[13][1];
                    const pUp = lm[20][1] < lm[17][1];
                    if (iUp && mUp && !rUp && !pUp) {
                        if (mode !== "PHOTO") takePhoto();
                    } else if (iUp && mUp && rUp && pUp) {
                        if (mode !== "EXPLODE") setMode("EXPLODE");
                    } else {
                        if (mode === "EXPLODE") setMode("TREE");
                    }
                } else {
                    setIsHandDetected(false);
                    if (mode === "EXPLODE") setMode("TREE");
                }
            }
            anim = requestAnimationFrame(detect);
        };
        detect();
        return () => cancelAnimationFrame(anim);
    }, [model, mode]);

    const takePhoto = () => {
        if (!webcamRef.current) return;
        setFlash(true);
        setTimeout(() => setFlash(false), 200);
        const screenshot = webcamRef.current.getScreenshot();
        const img = new Image();
        img.src = screenshot;
        img.onload = () => {
            const cvs = document.createElement("canvas");
            const ctx = cvs.getContext("2d");
            cvs.width = ROWS;
            cvs.height = ROWS;
            ctx.drawImage(img, 0, 0, ROWS, ROWS);
            const data = ctx.getImageData(0, 0, ROWS, ROWS).data;
            const colors = new Float32Array(COUNT * 3);
            for (let i = 0; i < COUNT; i++) {
                colors[i * 3] = data[i * 4] / 255;
                colors[i * 3 + 1] = data[i * 4 + 1] / 255;
                colors[i * 3 + 2] = data[i * 4 + 2] / 255;
            }
            setPhotoColors(colors);
            setMode("PHOTO");
            setTimeout(() => {
                setMode("TREE");
                setPhotoColors(null);
            }, 6000);
        };
    };

    return (
        <div className="App">
            <div className={`flash ${flash ? "active" : ""}`} />
            <div className="canvas-container">
                <Canvas camera={{ position: [0, 0, 18], fov: 55 }}>
                    <color attach="background" args={["#000018"]} />
                    <fog attach="fog" args={["#000018", 15, 40]} />
                    <CameraRig
                        handPosRef={handPosRef}
                        isHandDetected={isHandDetected}
                    />
                    <Snow />
                    <group position={[0, -1, 0]}>
                        <Particles mode={mode} photoColors={photoColors} />
                        {mode === "TREE" && <TreeStar />}
                    </group>
                </Canvas>
            </div>
            <div className="ui-layer">
                <h3>MERRY CHRISTMAS TREE</h3>
                <p style={{ color: isHandDetected ? "#4ade80" : "#fff" }}>
                    {status}
                </p>
                <div
                    style={{
                        fontSize: "0.8em",
                        marginTop: "10px",
                        color: "#ccc",
                    }}
                >
                    <p>
                        👋 Slide Hand: <b>Rotate</b> | 🖐 Open: <b>Explode</b> |
                        ✌️ Peace: <b>Selfie</b>
                    </p>
                </div>
            </div>
            <div className="webcam-feed">
                <Webcam
                    ref={webcamRef}
                    mirrored={true}
                    screenshotFormat="image/jpeg"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>
        </div>
    );
}
