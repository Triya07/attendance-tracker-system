const SelectField = ({ label, value, onChange, options }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
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

      <select
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          height: "44px",
          padding: "0 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "14px",
          backgroundColor: "#ffffff",
        }}
      >
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
