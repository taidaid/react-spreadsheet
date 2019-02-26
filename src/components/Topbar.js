import React, { useState, useEffect } from "react";

const Topbar = props => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(props.value);
  });

  const handleChangeValue = e => {
    const newValue = e.target.value;
    setValue(newValue);
  };
  return (
    <div>
      <input type="text" value={value} onChange={e => handleChangeValue(e)} />
    </div>
  );
};

export default Topbar;
