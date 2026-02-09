const PrimaryButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}   
      style={{
        width: "100%",
        height: "46px",
        marginTop: "10px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "500",
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
