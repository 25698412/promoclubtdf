# Remotion Skill Demo - PROMO CLUB TDF

This demo project showcases the capabilities of the Remotion skill installed from [remotion-dev/skills](https://github.com/remotion-dev/skills).

## What is Remotion?

Remotion is a framework for creating videos programmatically using React. It allows you to:
- Create videos using React components
- Animate elements using hooks like `useCurrentFrame()` and `useVideoConfig()`
- Use spring animations, interpolations, and sequencing patterns

## Demo Components

### 🎬 DemoPromo (Main)
A promotional video for PROMO CLUB TDF featuring:
- **Spring animations** for title entrance
- **Fade-in with slide-up** for subtitle
- **Staggered feature cards** with spring animations
- **Typewriter effect** for call-to-action

### 📚 Skills Showcase

| Component | Demonstrates |
|-----------|-------------|
| `FadeInDemo` | Basic opacity interpolation with slide-up |
| `TypewriterDemo` | Character-by-character text reveal with blinking cursor |
| `SpringAnimationDemo` | Different spring configurations (smooth, snappy, bouncy) |
| `SequencingDemo` | Series pattern with multiple scenes |

## Remotion Skills Covered

This demo applies the following rules from the remotion skill:

1. **timing.md** - `interpolate()` for linear animations, `spring()` for natural motion
2. **animations.md** - Animations driven by `useCurrentFrame()`, no CSS animations
3. **sequencing.md** - `<Series>` and `<Sequence>` for timeline composition
4. **compositions.md** - `<Composition>` definitions with props
5. **text-animations.md** - Typewriter effect using string slicing

## Getting Started

```bash
# Install dependencies
cd demo-remotion
npm install

# Open Remotion Studio (interactive preview)
npm start

# Render the main promo video
npm run build
```

## Project Structure

```
demo-remotion/
├── src/
│   ├── Root.tsx                    # Composition definitions
│   ├── DemoPromo.tsx               # Main promotional video
│   └── components/
│       ├── FadeInDemo.tsx          # Fade-in animation demo
│       ├── TypewriterDemo.tsx      # Typewriter effect demo
│       ├── SpringAnimationDemo.tsx # Spring animations demo
│       └── SequencingDemo.tsx      # Series/Sequence demo
├── package.json
└── tsconfig.json
```

## Key Remotion Concepts Demonstrated

### 1. Frame-Based Animations
All animations are driven by `useCurrentFrame()` and interpolated using `interpolate()` or `spring()`.

### 2. Spring Configurations
- **Smooth** (`damping: 200`): No bounce, subtle reveals
- **Snappy** (`damping: 20, stiffness: 200`): Quick, minimal bounce
- **Bouncy** (`damping: 8`): Playful entrance animations

### 3. Sequencing
- `<Series>`: Play scenes one after another
- `<Sequence>`: Delay elements within a timeline

### 4. Composition Setup
- `width: 1920, height: 1080`: Full HD output
- `fps: 30`: Standard frame rate
- `defaultProps`: Pass data to compositions
