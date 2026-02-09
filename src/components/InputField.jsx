const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      {/* Label */}
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "14px",
          fontWeight: "500",
          color: "#1f2937",
        }}
      >
        {label}
      </label>

      {/* Input */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          height: "44px",
          padding: "0 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "14px",
          outline: "none",
        }}
      />
    </div>
  );
};

export default InputField;
