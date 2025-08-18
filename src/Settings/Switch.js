import React from "react";

const Switch = ({ checked, onChange, isDesktop }) => {
  const styles = {
    switch: {
      position: "relative",
      display: "inline-block",
      width: isDesktop ? "60px" : "50px",
      height: isDesktop ? "34px" : "28px",
    },
    switchInput: {
      opacity: 0,
      width: 0,
      height: 0
    },
    switchSlider: {
      position: "absolute",
      cursor: "pointer",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#ccc",
      transition: "0.4s",
      borderRadius: "34px"
    },
    switchSliderActive: {
      backgroundColor: "#ff7a1c"
    },
    switchHandle: {
      position: "absolute",
      content: "",
      height: isDesktop ? "26px" : "20px",
      width: isDesktop ? "26px" : "20px",
      left: "4px",
      bottom: "4px",
      backgroundColor: "white",
      transition: "0.4s",
      borderRadius: "50%",
    },
    switchHandleActive: {
      transform: isDesktop ? "translateX(26px)" : "translateX(22px)",
    },
  };

  return (
    <label style={styles.switch}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={styles.switchInput}
      />
      <span
        style={{
          ...styles.switchSlider,
          ...(checked ? styles.switchSliderActive : {})
        }}
      >
        <span
          style={{
            ...styles.switchHandle,
            ...(checked ? styles.switchHandleActive : {})
          }}
        ></span>
      </span>
    </label>
  );
};

export default Switch;