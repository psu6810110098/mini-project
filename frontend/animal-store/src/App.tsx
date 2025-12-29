import { useState } from 'react'
import './App.css'

// กำหนด URL ของ Backend (ต้องตรงกับ Port ที่ NestJS รันอยู่ ปกติคือ 3000)
const API_URL = 'http://localhost:3000'; 

function App() {
  // State: สลับหน้า Login (true) / Register (false)
  const [isLoginView, setIsLoginView] = useState(true);

  // State: เก็บข้อมูลฟอร์ม
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ฟังก์ชัน: จัดการเมื่อกดปุ่ม Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บ Refresh เอง

    const endpoint = isLoginView ? '/auth/login' : '/auth/register';
    
    try {
      // 1. เชื่อมต่อ API (Connect API)
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginView) {
          // 2. ถ้า Login สำเร็จ -> เก็บ Token ลง Local Storage
          localStorage.setItem('token', data.accessToken); 
          alert('เข้าสู่ระบบสำเร็จ! (Token ถูกเก็บแล้ว)');
          console.log('Token:', data.accessToken);
        } else {
          // ถ้า Register สำเร็จ -> ให้สลับไปหน้า Login
          alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
          setIsLoginView(true);
        }
      } else {
        // กรณี Error จาก Backend
        alert(`เกิดข้อผิดพลาด: ${data.message || 'Unknown Error'}`);
      }

    } catch (error) {
      console.error('Connection Error:', error);
      alert('ไม่สามารถเชื่อมต่อกับ Server ได้ (อย่าลืมรัน NestJS นะ!)');
    }
  };

  return (
    <div className="container">
      <h1>🐶 Animal Store 🐱</h1>
      
      <div className="card">
        <h2>{isLoginView ? 'เข้าสู่ระบบ' : 'สมัครสมาชิกใหม่'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '10px' }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px' }}
            />
          </div>

          <button type="submit">
            {isLoginView ? 'Login' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '20px' }}>
          {isLoginView ? "ยังไม่มีบัญชี? " : "มีบัญชีอยู่แล้ว? "}
          <button 
            onClick={() => setIsLoginView(!isLoginView)}
            style={{ background: 'none', border: 'none', color: '#646cff', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {isLoginView ? "สมัครสมาชิกที่นี่" : "เข้าสู่ระบบเลย"}
          </button>
        </p>

        {/* ปุ่มทดสอบดู Token ในเครื่อง (สำหรับ Debug) */}
        <div style={{ marginTop: '30px', borderTop: '1px solid #444', paddingTop: '10px' }}>
          <button onClick={() => alert(localStorage.getItem('token') || 'ไม่มี Token')}>
            เช็ค Token ใน LocalStorage
          </button>
          <button onClick={() => { localStorage.removeItem('token'); alert('ลบ Token แล้ว'); }} style={{ marginLeft: '10px', backgroundColor: '#d33' }}>
            Logout (ลบ Token)
          </button>
        </div>

      </div>
    </div>
  )
}

export default App