import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import OtpTimer from "./OtpTimer";

const Login = () => {
  const [step, setStep] = useState("login"); // 'signup', 'loginOtp', 'signupOtp'
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  // Create refs for OTP inputs
  const otpRefs = useRef([]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (e) => {
    let value = e.target.value.trim();

    // If input is only numbers → restrict to 10 digits
    if (/^\d*$/.test(value)) {
      value = value.slice(0, 10);
    }

    setInputValue(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (emailRegex.test(value)) {
      setEmail(value);
      setMobile("");
    } else if (mobileRegex.test(value)) {
      setMobile(value);
      setEmail("");
    } else {
      setEmail("");
      setMobile("");
    }
  };

  // Handle OTP input key events
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current field is empty, move to previous field
        otpRefs.current[index - 1]?.focus();
      } else {
        // Clear current field
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste event for OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Only process if pasted data contains only digits
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 4).split("");
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 4) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    // Focus on the next empty field or last field
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      otpRefs.current[nextEmptyIndex]?.focus();
    } else {
      otpRefs.current[3]?.focus();
    }
  };

  // Reset OTP when changing steps
  const resetOtp = () => {
    setOtp(["", "", "", ""]);
  };

  // Register API call
  const handleSignUp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('https://apisocial.atozkeysolution.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          mobile,
          email,
          username,
          gender
        })
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.data.token);
        resetOtp();
        setStep("signupOtp");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP for signup
  const verifySignupOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const otpString = otp.join('');
      if (otpString.length !== 4) {
        setError("Please enter complete OTP");
        setLoading(false);
        return;
      }

      const response = await fetch('https://apisocial.atozkeysolution.com/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otpString,
          token,
        })
      });

      const data = await response.json();

      if (response.ok) {
        resetOtp();
        setStep("login");
        alert("Registration successful! Please login.");
      } else {
        setError(data.message || "OTP verification failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Login API call
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const identifier = email.includes('@') ? { email } : { mobile: inputValue };

      const response = await fetch('https://apisocial.atozkeysolution.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(identifier)
      });

      const data = await response.json();

      if (response.ok) {
        setUserId(data.data.userId);
        setToken(data.data.token);
        resetOtp();
        setStep("loginOtp");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP for login
  const verifyLoginOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const otpString = otp.join('');
      if (otpString.length !== 4) {
        setError("Please enter complete OTP");
        setLoading(false);
        return;
      }

      const response = await fetch('https://apisocial.atozkeysolution.com/api/verify-login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          otp: otpString,
          token
        })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("authToken", data.data.token);
        sessionStorage.setItem("userData", JSON.stringify(data.data));
        navigate("/home");
      } else {
        setError(data.message || "OTP verification failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(to bottom right, #ff9966, #ffcc99)",
      }}
    >
      {/* Main Content */}
      <div className="container flex-grow-1 d-flex flex-column justify-content-center py-4 py-md-5">
        {/* Logo Image */}
        <div className="text-center mb-3 mb-md-4">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ maxHeight: "60px", height: "auto" }}
            className="rounded-circle"
          />
        </div>

        <div className="row justify-content-center align-items-center">
          {/* Left Section */}
          <div className="col-md-6 col-lg-5 text-white d-flex flex-column flex-md-row align-items-center justify-content-center text-center text-md-start mb-4 mb-md-0">
            {/* Text Section */}
            <div className="d-flex flex-column justify-content-center align-items-center align-items-md-start mb-4 mb-md-0 me-md-4">
              <h3 className="fw-bold mb-3 mb-md-4">
                Connect, share <br />
                and react with <br />
                people in your life.
              </h3>
            </div>

            {/* Image Section */}
            <div className="text-center">
              <img
                src="/assets/images/login-img.png"
                alt="Illustration"
                className="img-fluid"
                style={{
                  maxHeight: "280px",
                  width: "auto",
                  borderRadius: "15px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="col-md-6 col-lg-5">
            <div
              className="bg-white rounded shadow p-4 mx-auto"
              style={{ maxWidth: "450px" }}
            >
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Sign Up Form */}
              {step === "signup" && (
                <>
                  <h4 className="fw-bold mb-3 text-center">
                    Create a new account
                  </h4>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => {
                        if (email && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
                          alert("Please enter a valid Gmail address (example@gmail.com)");
                          setEmail("");
                        }
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Mobile Number"
                      value={mobile}
                      maxLength={10}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <select
                      className="form-select"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <button
                    className="btn text-white w-100 fw-bold mb-3"
                    style={{ backgroundColor: "#ffc107" }}
                    onClick={handleSignUp}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Sign Up"}
                  </button>

                  {/* <div className="text-center text-muted mb-3 position-relative">
                    <hr className="my-0" />
                    <span
                      className="position-absolute bg-white px-2"
                      style={{
                        top: "-10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      Or
                    </span>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mb-3">
                    <button className="btn btn-light border rounded-circle p-2">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/2702/2702602.png"
                        alt="Google"
                        width="20"
                      />
                    </button>
                    <button className="btn btn-light border rounded-circle p-2">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/5968/5968873.png"
                        alt="X"
                        width="20"
                      />
                    </button>
                  </div> */}

                  <p className="text-center text-muted mb-0">
                    Already have an account?{" "}
                    <span
                      role="button"
                      className="text-primary fw-medium"
                      onClick={() => {
                        setStep("login");
                        setError("");
                      }}
                    >
                      Sign in
                    </span>
                  </p>
                </>
              )}

              {/* Login Form */}
              {step === "login" && (
                <>
                  <h4 className="fw-bold mb-3 text-center">
                    Login to your account
                  </h4>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email or mobile number"
                      value={inputValue}
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    className="btn text-white w-100 fw-bold mb-3"
                    style={{ backgroundColor: "#ffc107" }}
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Sign in"}
                  </button>

                  {/* <div className="text-center text-muted mb-3 position-relative">
                    <hr className="my-0" />
                    <span
                      className="position-absolute bg-white px-2"
                      style={{
                        top: "-10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      Or
                    </span>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mb-3">
                    <button className="btn btn-light border rounded-circle p-2">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/2702/2702602.png"
                        alt="Google"
                        width="20"
                      />
                    </button>
                    <button className="btn btn-light border rounded-circle p-2">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/5968/5968873.png"
                        alt="X"
                        width="20"
                      />
                    </button>
                  </div> */}

                  <p className="text-center text-muted mb-0">
                    Don't have an account?{" "}
                    <span
                      role="button"
                      className="text-primary fw-medium"
                      onClick={() => {
                        setStep("signup");
                        setError("");
                      }}
                    >
                      Sign Up
                    </span>
                  </p>
                </>
              )}

              {/* OTP Screen (Signup) */}
              {step === "signupOtp" && (
                <>
                  <h4 className="fw-bold mb-3 text-center">Verify Your Email</h4>
                  <p className="text-muted text-center mb-4">
                    We've sent a verification code to <strong>{email || mobile}</strong>.
                    <br />
                    Enter it below to complete registration.
                  </p>
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        className="form-control text-center py-2"
                        style={{ width: "50px", fontSize: "1.1rem" }}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        onFocus={(e) => e.target.select()}
                      />
                    ))}
                  </div>
                  <small className="text-muted d-block text-center mb-4">
                    Your code will be valid for <OtpTimer />.{" "}
                    {/* <span className="text-primary fw-medium" role="button">
                      Resend
                    </span> */}
                  </small>
                  <button
                    className="btn text-white w-100 fw-bold"
                    style={{ backgroundColor: "#ffc107" }}
                    onClick={verifySignupOtp}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify & Continue to Login"}
                  </button>
                </>
              )}

              {/* OTP Screen (Login) */}
              {step === "loginOtp" && (
                <>
                  <h4 className="fw-bold mb-3 text-center">Enter OTP</h4>
                  <p className="text-muted text-center mb-4">
                    We've sent a login code to <strong>{email || mobile}</strong>.
                    <br />
                    Enter it below to log in.
                  </p>
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        className="form-control text-center py-2"
                        style={{ width: "50px", fontSize: "1.1rem" }}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        onFocus={(e) => e.target.select()}
                      />
                    ))}
                  </div>
                  <small className="text-black d-block text-center mb-4">
                    Your code will be valid for <span className="text-success fw-bold"><OtpTimer />.</span>{" "}
                    {/* <span className="text-primary fw-medium" role="button">
                      Resend
                    </span> */}
                  </small>
                  <button
                    className="btn text-white w-100 fw-bold"
                    style={{ backgroundColor: "#ffc107" }}
                    onClick={verifyLoginOtp}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="bg-white border-top py-3 py-md-4">
        <div className="container">
          <div className="text-center">
            <p className="fw-bold mb-3">Login as...</p>
            <div className="d-flex justify-content-center gap-4 gap-md-5 mb-3 flex-wrap">
              <div className="text-center">
                <div
                  className="mx-auto bg-light border rounded-circle d-flex align-items-center justify-content-center mb-1"
                  style={{ width: "60px", height: "60px" }}
                >
                  <span className="fw-medium">PMS</span>
                </div>
              </div>
              <div className="text-center">
                <div
                  className="mx-auto bg-light border rounded-circle d-flex align-items-center justify-content-center mb-1"
                  style={{ width: "60px", height: "60px" }}
                >
                  <span className="fs-4">+</span>
                </div>
                <div>Add Account</div>
              </div>
            </div>
            <hr className="my-2 my-md-3" />
            <div className="d-flex justify-content-center flex-wrap gap-3 text-muted small">
              <span>Privacy</span>
              <span>Cookies</span>
              <span>Terms</span>
              <span>Help</span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Login;