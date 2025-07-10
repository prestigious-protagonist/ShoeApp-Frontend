/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth0 } from '@auth0/auth0-react';
import 'react-toastify/dist/ReactToastify.css';

const statesList = [
  'Andhra Pradesh', 'Bihar', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'
];

const AddressForm = ({ userEmail, onAddressChange }) => {
  const [formData, setFormData] = useState({
    state: '',
    phone: '',
    flatNumber: '',
    locality: '',
    city: '',
    email: ''
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(true); // controls field freeze/edit
const [shippingAddress, setShippingAddress] = useState(null);

  const { getAccessTokenSilently, user } = useAuth0();

useEffect(() => {
    if (isVerified && onAddressChange) {
      onAddressChange(formData);
    }
  }, [isVerified, formData, onAddressChange]);
    useEffect(() => {
      const saved = localStorage.getItem('addressData');
  const verifiedFlag = localStorage.getItem('isEmailVerified');

if (saved) {
  const parsed = JSON.parse(saved);
  setFormData({...parsed, email: user.email});
  setIsVerified(verifiedFlag === 'true');  // ✅ fix
  setIsEditing(!(verifiedFlag === 'true')); // freeze if verified
}

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendOtp = async () => {
    const token = await getAccessTokenSilently();
    try {
      await axios.post(
        'http://localhost:3010/verificationService/api/get-otp',
        { email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error('Failed to send OTP to email');
    }
  };

  const verifyOtp = async () => {
  const token = await getAccessTokenSilently();
  try {
    const res = await axios.post(
      'http://localhost:3010/verificationService/api/verify-otp',
      {
        email: user.email,
        otp,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("OTP Verify Response:", res.data); // 🔍 Debug

    if (res.data.success === true) { // ✅ Match this with actual key returned
      setIsVerified(true);
setIsEditing(false);
localStorage.setItem('addressData', JSON.stringify(formData));
localStorage.setItem('isEmailVerified', 'true'); // ✅ add this

      toast.success('Email verified and address saved!');
    } else {
      toast.error(res.data.message || 'Invalid OTP');
    }
  } catch (err) {
    toast.error('Email verification failed');
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isVerified) {
      toast.warning('Please verify your email before submitting');
      return;
    }
    toast.success('Address submitted successfully!');
    localStorage.setItem('addressData', JSON.stringify(formData));
    setIsEditing(false);
  };

  const enableEdit = () => {
    setIsEditing(true);
    setIsVerified(false);
    setOtp('');
    setOtpSent(false);
    localStorage.removeItem('isEmailVerified'); // ✅ reset

    toast.info('You can now edit your address. Please verify again.');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <ToastContainer />
      <h2 style={styles.heading}>Delivery Address</h2>

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label>Email</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="email"
              value={user.email}
              disabled
              style={styles.disabledInput}
            />
            {isEditing && (
              <button type="button" onClick={sendOtp} style={styles.secondaryBtn}>
                Send OTP
              </button>
            )}
          </div>
        </div>
      </div>

      {otpSent && isEditing && (
        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label>Enter OTP</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              <button type="button" onClick={verifyOtp} style={styles.secondaryBtn}>
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter phone"
            disabled={!isEditing}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Flat / House No.</label>
          <input
            type="text"
            name="flatNumber"
            value={formData.flatNumber}
            onChange={handleChange}
            required
            placeholder="e.g. A2-101"
            disabled={!isEditing}
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label>Locality</label>
          <input
            type="text"
            name="locality"
            value={formData.locality}
            onChange={handleChange}
            required
            placeholder="e.g. Green Park"
            disabled={!isEditing}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="e.g. Mumbai"
            disabled={!isEditing}
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label>State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            disabled={!isEditing}
          >
            <option value="">-- Select State --</option>
            {statesList.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {isEditing && (
        <button type="submit" style={styles.button}>Submit</button>
      )}

      {!isEditing && (
        <div style={styles.bottomRight}>
          <button type="button" onClick={enableEdit} style={styles.secondaryBtn}>
            Change Address
          </button>
        </div>
      )}
    </form>
  );
};

const styles = {
  form: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '30px',
    fontFamily: 'Segoe UI, sans-serif',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 12px rgba(0,0,0,0.05)',
    position: 'relative',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333',
    fontWeight: '600',
  },
  row: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  inputGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  disabledInput: {
    backgroundColor: '#efefef',
    cursor: 'not-allowed',
    color: '#555',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    marginTop: '20px',
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '8px 12px',
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
  },
  bottomRight: {
    position: 'absolute',
    bottom: '20px',
    right: '30px',
  },
};

export default AddressForm;
