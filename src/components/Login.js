import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [step, setStep] = useState('login'); // 'signup', 'otp'
  const [email, setEmail] = useState('Tommy@gmail.com');
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(to bottom right, #ff9966, #ffcc99)' }}>
      {/* Main Content */}
      <div className="container flex-grow-1 d-flex flex-column justify-content-center py-4 py-md-5">
        <h2 className="fw-bold mb-3 mb-md-4">LOGO</h2>
        <div className="row justify-content-center align-items-center">
          {/* Left Section - Branding */}
          <div className="col-md-6 col-lg-5 text-white text-center mb-4 mb-md-0 d-flex justify-content-center align-items-center">
            
            <h3 className="fw-bold mb-4 mb-md-5">
              Connect, share<br />and react with<br />people in your life.
            </h3>
            <div className="d-none d-md-block">
              <img
                src="/assets/images/login-img.png"
                alt="Illustration"
                className="img-fluid"
                style={{ maxHeight: '320px' }}
              />
            </div>
          </div>

          {/* Right Section - Auth Forms */}
          <div className="col-md-6 col-lg-5">
            <div className="bg-white rounded shadow p-4 mx-auto" style={{ maxWidth: '450px' }}>
              {/* Sign Up Form */}
              {step === 'signup' && (
                <>
                  <h4 className="fw-bold mb-3 text-center">Create a new account</h4>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Name" />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form-control" placeholder="E-mail" />
                  </div>
                  <div className="mb-3">
                    <input type="tel" className="form-control" placeholder="Mobile Number" />
                  </div>
                  <div className="mb-4">
                    <select className="form-select">
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <button className="btn btn-warning w-100 fw-bold mb-3">Sign Up</button>

                  <div className="text-center text-muted mb-3 position-relative">
                    <hr className="my-0" />
                    <span className="position-absolute bg-white px-2" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)' }}>Or</span>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mb-3">
                    <button className="btn btn-light border rounded-circle p-2">
                      <img src="https://cdn-icons-png.flaticon.com/512/2702/2702602.png" alt="Google" width="20" />
                    </button>
                    <button className="btn btn-light border rounded-circle p-2">
                      <img src="https://cdn-icons-png.flaticon.com/512/5968/5968873.png" alt="X" width="20" />
                    </button>
                  </div>

                  <p className="text-center text-muted mb-0">
                    Already have an account?{' '}
                    <span role="button" className="text-primary fw-medium" onClick={() => setStep('login')}>
                      Sign in
                    </span>
                  </p>
                </>
              )}

              {/* Login Form */}
              {step === 'login' && (
                <>
                  <h4 className="fw-bold mb-3 text-center">Login to your account</h4>
                  <div className="mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Email or mobile number" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button 
                    className="btn btn-warning w-100 fw-bold mb-3" 
                    onClick={() => setStep('otp')}
                  >
                    Sign in
                  </button>

                  <div className="text-center text-muted mb-3 position-relative">
                    <hr className="my-0" />
                    <span className="position-absolute bg-white px-2" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)' }}>Or</span>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mb-3">
                    <button className="btn btn-light border rounded-circle p-2">
                      <img src="https://cdn-icons-png.flaticon.com/512/2702/2702602.png" alt="Google" width="20" />
                    </button>
                    <button className="btn btn-light border rounded-circle p-2">
                      <img src="https://cdn-icons-png.flaticon.com/512/5968/5968873.png" alt="X" width="20" />
                    </button>
                  </div>

                  <p className="text-center text-muted mb-0">
                    Don't have an account?{' '}
                    <span role="button" className="text-primary fw-medium" onClick={() => setStep('signup')}>
                      Sign Up
                    </span>
                  </p>
                </>
              )}

              {/* OTP Verification */}
              {step === 'otp' && (
                <>
                  <h4 className="fw-bold mb-3 text-center">Enter OTP</h4>
                  <p className="text-muted text-center mb-4">
                    We've sent a verification code to <strong>{email}</strong>.<br />
                    Enter it below to log in.
                  </p>
                  
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i} 
                        type="text" 
                        maxLength="1" 
                        className="form-control text-center py-2" 
                        style={{ width: '50px', fontSize: '1.1rem' }}
                      />
                    ))}
                  </div>
                  
                  <small className="text-muted d-block text-center mb-4">
                    Your code will be valid for 10 minutes.{' '}
                    <span className="text-primary fw-medium" role="button">
                      Resend
                    </span>
                  </small>
                  
                  <button className="btn btn-warning w-100 fw-bold" onClick={()=>navigate('/home')}>Verify</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Account Selection */}
      <div className="bg-white border-top py-3 py-md-4">
        <div className="container">
          <div className="text-center">
            <p className="fw-bold mb-3">Login as...</p>
            
            <div className="d-flex justify-content-center gap-4 gap-md-5 mb-3 flex-wrap">
              <div className="text-center">
                <div className="mx-auto bg-light border rounded-circle d-flex align-items-center justify-content-center mb-1" 
                  style={{ width: '60px', height: '60px' }}>
                  <span className="fw-medium">PMS</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="mx-auto bg-light border rounded-circle d-flex align-items-center justify-content-center mb-1" 
                  style={{ width: '60px', height: '60px' }}>
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
      </div>
    </div>
  );
};

export default Login;