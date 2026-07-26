import { useNavigate } from "react-router-dom"
import Starfield from "../components/Starfield"
import CodeBlock from "../components/codeblock"

type Section = {
  title: string
  content: string
  code?: {
    filename: string
    language: string
    snippet: string
  }
}

const sections: Section[] = [
  {
    title: "Introduction",
    content:
      "I came across a breakcore video on TikTok where the editor drew lines connecting fingertips and had filters clipped inside the shape. It looked sick but it was all post-production editing, frame by frame. I thought it would be way cooler if it worked in real time on a live camera feed, so I decided to recreate it with code.",
  },
  {
    title: "How it works",
    content:
      "MediaPipe Hand Landmarker gives you 21 landmarks per hand in real time. Each fingertip has an ID (4=thumb, 8=index, 12=middle, 16=ring, 20=pinky) and a corresponding joint below it. To check if a finger is extended, you compare the fingertip position to its joint. For the thumb you check the distance from the wrist since it moves sideways.",
    code: {
      filename: "handtrack.py",
      language: "python",
      snippet: `def is_finger_extended(hand_landmarks, tip_id, pip_id):
    tip = hand_landmarks[tip_id]
    pip = hand_landmarks[pip_id]
    if tip_id == 4:
        wrist = hand_landmarks[0]
        tip_dist = ((tip.x - wrist.x)**2 + (tip.y - wrist.y)**2) ** 0.5
        pip_dist = ((pip.x - wrist.x)**2 + (pip.y - wrist.y)**2) ** 0.5
        return tip_dist > pip_dist
    else:
        return tip.y < pip.y`,
    },
  },
  {
    title: "Drawing the shapes",
    content:
      "Once you have the active fingertip positions, you feed them into cv2.convexHull() to get the correct perimeter order. This prevents lines from criss-crossing when fingers are in weird positions. Then cv2.polylines() draws the closed shape. I also added a white glow effect behind the shape line to make it look cleaner.",
    code: {
      filename: "handtrack.py",
      language: "python",
      snippet: `pts = np.array(active_tips, dtype=np.int32).reshape((-1, 1, 2))
hull = cv2.convexHull(pts)

mask = np.zeros((h, w), dtype=np.uint8)
cv2.fillConvexPoly(mask, hull, 255)

cv2.polylines(frame, [hull], True, (255, 255, 255), 1, cv2.LINE_AA)`,
    },
  },
  {
    title: "Two hands, one shape",
    content:
      "Instead of drawing separate shapes per hand, I collect all extended fingertips from both hands into a single list first. So if you hold up 2 fingers on the left and 2 on the right, it draws one quadrilateral spanning across both hands. The convex hull handles the rest.",
  },
  {
    title: "Filters inside the shape",
    content:
      "I added filters that only apply inside the shape boundary. The trick is creating a mask from the convex hull polygon, applying the filter to the full frame, then masking it so only the inside of the shape shows the effect. You cycle through them with N and P keys.",
    code: {
      filename: "handtrack.py",
      language: "python",
      snippet: `mask = np.zeros((h, w), dtype=np.uint8)
cv2.fillConvexPoly(mask, hull, 255)

filter_name, filter_fn = FILTERS[filter_idx]
if filter_fn is not None:
    filtered = filter_fn(frame, mask)
    bg = cv2.bitwise_and(frame, frame, mask=cv2.bitwise_not(mask))
    frame = cv2.add(bg, filtered)`,
    },
  },
  {
    title: "Getting the phone camera working",
    content:
      "My laptop webcam is 720p which is decent, but tracking was still inconsistent with two hands. I tried using my phone as a camera through USB. IP Webcam crashed on my POCO phone, USB Camera apps didn't work either. Eventually I installed DroidCam with a custom v4l2loopback kernel module that creates a virtual webcam device at /dev/video2. Phone camera through USB with zero latency.",
  },
  {
    title: "Performance",
    content:
      "MediaPipe inference is the bottleneck. I skip every other frame for detection and reuse the last result on skipped frames. It's not perfect but it keeps things responsive. The detection runs on CPU since my laptop doesn't have GPU support for MediaPipe.",
  },
  {
    title: "MediaPipe tasks API",
    content:
      "MediaPipe 0.10.33 dropped the old solutions API entirely. The new tasks API requires a .task model file downloaded separately and uses HandLandmarker instead of Hands. The API is different but the concept is the same.",
    code: {
      filename: "handtrack.py",
      language: "python",
      snippet: `from mediapipe.tasks.python import vision, BaseOptions

base_options = BaseOptions(model_asset_path="hand_landmarker.task")
options = vision.HandLandmarkerOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.VIDEO,
    num_hands=2,
    min_hand_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)
detector = vision.HandLandmarker.create_from_options(options)`,
    },
  },
  {
    title: "Shortcuts",
    content:
      "N = next filter, P = previous filter, H = toggle hand skeleton nodes on/off, Q = quit.",
  },
  {
    title: "What I Learned",
    content:
      "How MediaPipe hand landmarks work and how to interpret them. Using cv2.convexHull and cv2.polylines for shape drawing. Masking techniques for applying effects to specific regions. How v4l2loopback works for creating virtual webcam devices. That the MediaPipe tasks API is quite different from the old solutions API. And that phone cameras over USB through DroidCam is way better than most laptop webcams.",
  },
  {
    title: "Note on camera quality",
    content:
      "If you want to try this yourself, use a good camera. Seriously. I spent hours debugging why the tracking was inaccurate and janky, turns out my laptop webcam sensor is just bad. Bad contrast, bad low-light performance, noisy image. MediaPipe needs clear edges and contrast to detect hands reliably. A phone camera through DroidCam over USB gave way better results than any amount of preprocessing I threw at the laptop webcam. If you can, use your phone camera. Also, MediaPipe has a GPU delegate that can speed up inference significantly, but it uses OpenGL ES under the hood and on my NVIDIA laptop it fell back to software rendering (llvmpipe) instead of using the actual GPU. If you're on an AMD GPU or a system where EGL works properly, the GPU delegate is worth trying.",
  },
]

export default function Handtrack() {
  const navigate = useNavigate()

  return (
    <div className="bg-black min-h-screen text-white">
      <Starfield />

      <div
        className="max-w-7xl mx-auto py-16 px-4 relative page-enter"
        style={{ zIndex: 1 }}
      >
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 border border-white/20 rounded hover:border-white/60 transition-all duration-300 hover:scale-[1.1] hover:shadow-[0_0_20px_rgba(100,200,255,0.1)]"
        >
          ← back
        </button>

        <h1 className="text-4xl font-bold mt-8">
          Fingertip Shape Tracker<span className="caret">_</span>
        </h1>
        <p className="text-white/70 mt-4 font-light">
          Drawing shapes with your fingers using MediaPipe and OpenCV.
        </p>

        <div className="border border-white/20 rounded-xl p-6 mt-8 bg-black/20">
          <p className="text-white/50 font-mono">// handtrack</p>
          <h2 className="text-2xl font-bold mt-2">
            Python · MediaPipe · OpenCV
          </h2>
          <p className="text-white/70 mt-2">Real-time hand tracking with shape drawing</p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8 mt-12">
          {sections.map((item) => (
            <div
              key={item.title}
              className="p-6 border-b border-white/10 last:border-none"
            >
              <h2 className="text-white text-2xl font-bold mb-2">
                {item.title}
              </h2>
              <p className="text-white/80 font-light text-lg leading-relaxed">
                {item.content || " "}
              </p>

              {item.code && (
                <CodeBlock
                  filename={item.code.filename}
                  language={item.code.language}
                  snippet={item.code.snippet}
                />
              )}
            </div>
          ))}
        </div>

        <footer className="border-t border-white/20 text-white/40 text-sm text-center py-6 mt-16">
          © 2026 Lemondeft. Made with useless tinkering.
        </footer>
      </div>
    </div>
  )
}