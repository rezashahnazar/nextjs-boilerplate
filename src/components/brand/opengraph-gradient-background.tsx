export function GradientBackground() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(125deg, #000000 0%, #1a1a1a 100%)",
          position: "relative",
          display: "flex",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "60%",
            height: "60%",
            background:
              "radial-gradient(circle, rgba(0, 112, 243, 0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            right: "-10%",
            width: "70%",
            height: "70%",
            background:
              "radial-gradient(circle, rgba(0, 112, 243, 0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }