import campusBg from "../assets/campus_bg.jpeg";

const AuthLayout = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${campusBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Blur overlay */}
     <div
  style={{
    position: "absolute",
    inset: 0,
    backdropFilter: "blur(2px)",          // VERY light blur
    WebkitBackdropFilter: "blur(4px)",
    backgroundColor: "rgba(255, 255, 255, 0.03)", // 5% opacity
  }}
/>
      {/* Login Card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "460px",
          padding: "36px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
