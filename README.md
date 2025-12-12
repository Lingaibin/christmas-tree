Here is a professional and comprehensive **README.md** file for your project. You can copy and paste this directly into your project's root directory.

***

# 🎄 Interactive AI Christmas Tree

A magical, 3D digital Christmas tree built with **React**, **Three.js**, and **TensorFlow.js**. This application uses computer vision to track your hand gestures in real-time, allowing you to interact with thousands of floating "LED" particles, trigger explosions, and take selfies that map directly onto the 3D tree.

![Demo Site](https://lingaibin.github.io/christmas-tree/)

## ✨ Features

*   **3D Particle System:** Renders 2,500+ individual "glass/LED" cards using `InstancedMesh` for high performance (60FPS).
*   **Gesture Control (AI):** Uses `TensorFlow.js` and `Handpose` to detect hand landmarks.
    *   **Parallax View:** Move your hand left/right/up/down to rotate the camera.
    *   **Explosion Effect:** Show an **Open Hand 🖐** to scatter the tree particles into a chaotic cloud.
    *   **Photo Mode:** Flash a **Peace Sign ✌️** to trigger a countdown, capture a photo from your webcam, and project it onto the particle grid.
*   **Festive Atmosphere:** Includes infinite falling snow, a spinning glowing star topper, and volumetric fog.
*   **Dynamic Shaders:** Custom WebGL shaders handle the transition between "Animal Texture Mode" and "Selfie Pixel Mode" with high-contrast glowing effects.
*   **Real-time Texture Atlas:** Asynchronously fetches high-quality animal photography from Unsplash to populate the cards.

## 🛠 Tech Stack

*   **Framework:** [React](https://reactjs.org/)
*   **3D Engine:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) (Three.js)
*   **Computer Vision:** [TensorFlow.js](https://www.tensorflow.org/js) & [Handpose Model](https://github.com/tensorflow/tfjs-models/tree/master/handpose)
*   **Webcam:** [React Webcam](https://www.npmjs.com/package/react-webcam)
*   **Styling:** CSS3

## 🚀 Getting Started

### Prerequisites

*   Node.js (v14 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-christmas-tree.git
    cd ai-christmas-tree
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *This will install `three`, `@react-three/fiber`, `@react-three/drei`, `@tensorflow/tfjs`, `@tensorflow-models/handpose`, and `react-webcam`.*

3.  **Run the application:**
    ```bash
    npm start
    ```

4.  **Allow Permissions:**
    *   Open [http://localhost:3000](http://localhost:3000) in your browser.
    *   **Allow** camera access when prompted. The app needs the webcam for gesture recognition and the selfie feature.

## 🎮 How to Interact

Once the AI Status says **"Ready"**, you can use the following gestures:

| Gesture | Action | Description |
| :--- | :--- | :--- |
| **Slide Hand** 👋 | **Rotate Camera** | Move your hand left, right, up, or down in front of the camera. The 3D scene will follow your hand movement. |
| **Open Hand** 🖐 | **Explode** | Spread all 5 fingers. The tree particles will break gravity and form a dense cloud. Close your hand to reform the tree. |
| **Peace Sign** ✌️ | **Take Photo** | Hold up your index and middle finger. A flash will trigger, and your photo will become a mosaic on the grid. |
| **Mouse** 🖱️ | **Fallback** | If no hand is detected, you can move your mouse to rotate the view. |

## 📂 Project Structure

```
src/
├── App.js          # Main logic (3D scene, AI detection, Render loop)
├── App.css         # Styling for UI overlays and canvas container
├── index.js        # Entry point
└── ...
```

### Key Components in `App.js`:

*   **`Particles`**: Manages the 2500 InstancedMesh items, custom shaders, and physics interpolation.
*   **`CameraRig`**: Handles smooth camera movement based on Hand or Mouse input.
*   **`Snow`**: Generates the background snow particles.
*   **`useRealAnimalAtlas`**: Fetches images and creates the sprite sheet canvas texture.

## ⚙️ Configuration

You can tweak the constants at the top of `src/App.js` to change performance or visuals:

```javascript
const ROWS = 50;         // Grid resolution (50x50 = 2500 particles)
const ITEM_SIZE = 0.42;  // Size of individual LED cards
```

## 🐛 Troubleshooting

*   **Black Screen?** Ensure your `App.css` has `html, body, #root { height: 100%; }`.
*   **Laggy?** Ensure hardware acceleration is enabled in your browser. The app uses WebGL heavily.
*   **Gestures not working?** Make sure your hand is well-lit and clearly visible to the camera. The AI needs to see your fingers clearly to distinguish between an open hand and a peace sign.

## 📜 License

This project is open-source. Feel free to use it for your holiday greeting cards!

---
*Created with React & Three.js* 🎅
