// #region PROPS
type SelectProps = {
  value: string;
  options: { label: string; value: string }[];
  onChange: (data: string) => void;
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function Select({ value, options, onChange }: SelectProps) {
  return (
    <select
      className={`rounded-md p-2 border border-info-200 hover:border-opacity-50
        outline-none focus:ring focus:ring-primary-400 focus:border-primary-400 focus:ring-opacity-10
      `}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((data, index) => (
        <option value={data.value} key={index}>
          {data.label}
        </option>
      ))}
    </select>
  );
}
// #endregion MAIN COMPONENT
