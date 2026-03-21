import "../styles/auth-theme.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-shell">
      <div className="auth-layer auth-layer-grid" aria-hidden="true" />
      <div className="auth-layer auth-layer-orb auth-layer-orb-a" aria-hidden="true" />
      <div className="auth-layer auth-layer-orb auth-layer-orb-b" aria-hidden="true" />
      <div className="auth-layer auth-layer-glow" aria-hidden="true" />

      <div className="auth-card">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
