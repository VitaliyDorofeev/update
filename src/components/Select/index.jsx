/* eslint-disable object-curly-newline */
/* eslint-disable react/no-array-index-key */
function Select({ id, value, onChange, options, placeholder, className, disabled }) {
  return (
    <select id={id} className={`custom-select ${className}`} value={value} onChange={onChange} disabled={disabled}>
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default Select;
