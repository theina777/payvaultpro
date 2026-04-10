import { useState, useEffect } from 'react';
import { LogOut, Users, Plus, LayoutDashboard, Receipt, IndianRupee, Award, Clock, Printer, Settings, Trash2, Pencil, X, Check } from 'lucide-react';
import { calculateGross, calculateNet, calculateTax, getOTRate } from '../lib/payrollLogic';

export default function Dashboard({ currentUser, accounts, setAccounts, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState([]);

  // Fetch synced cloud employees
  useEffect(() => {
    fetch('/api/employees')
      .then(r => r.json())
      .then(data => setEmployees(Array.isArray(data) ? data : []))
      .catch(e => console.error("Cloud payload failed", e));
  }, []);

  const saveEmployees = async (newEmployees) => {
    setEmployees(newEmployees);
    await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployees)
    }).catch(e => console.error("Sync failed", e));
  };

  // Add Employee Form state
  const [empId, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [basicPay, setBasicPay] = useState('');
  const [otHours, setOtHours] = useState('');

  // Update OT state
  const [otEmpId, setOtEmpId] = useState('');
  const [otAddHours, setOtAddHours] = useState('');

  // Payslip state
  const [payslipEmpId, setPayslipEmpId] = useState('');
  const [activePayslip, setActivePayslip] = useState(null);

  // Edit Modal state
  const [editingEmp, setEditingEmp] = useState(null);
  const [editName, setEditName] = useState('');
  const [editBasicPay, setEditBasicPay] = useState('');
  const [editOtHours, setEditOtHours] = useState('');

  // Delete confirmation state
  const [deletingEmpId, setDeletingEmpId] = useState(null);

  // Settings State
  const [targetUserReset, setTargetUserReset] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [sysUser, setSysUser] = useState('');
  const [sysPass, setSysPass] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (employees.find(emp => emp.id === empId)) {
      setErrorMsg('Employee ID must be unique'); return;
    }
    if (parseFloat(basicPay) < 0 || parseFloat(otHours) < 0) {
      setErrorMsg('Basic Pay and OT must be non-negative'); return;
    }
    saveEmployees([...employees, { id: empId, name, basicPay: parseFloat(basicPay), otHours: parseFloat(otHours) }]);
    setEmpId(''); setName(''); setBasicPay(''); setOtHours(''); setErrorMsg('');
    setSuccessMsg('Employee registered successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
    setActiveTab('list');
  };

  const handleUpdateOT = (e) => {
    e.preventDefault();
    const index = employees.findIndex(emp => emp.id === otEmpId);
    if (index === -1) { setErrorMsg('Employee ID not found'); return; }
    const newEmployees = [...employees];
    const newOt = newEmployees[index].otHours + parseFloat(otAddHours);
    if (newOt < 0) { setErrorMsg('Total OT cannot be below 0'); return; }
    newEmployees[index].otHours = newOt;
    saveEmployees(newEmployees);
    setOtEmpId(''); setOtAddHours(''); setErrorMsg('');
    setSuccessMsg('Overtime updated!');
    setTimeout(() => setSuccessMsg(''), 3000);
    setActiveTab('list');
  };

  const generatePayslip = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === payslipEmpId);
    if (!emp) { setErrorMsg('Employee ID not found'); setActivePayslip(null); return; }
    setErrorMsg(''); setActivePayslip(emp);
  };

  // -- Edit handlers --
  const openEditModal = (emp) => {
    setEditingEmp(emp);
    setEditName(emp.name);
    setEditBasicPay(emp.basicPay);
    setEditOtHours(emp.otHours);
  };

  const handleSaveEdit = () => {
    if (!editName || editBasicPay === '' || editOtHours === '') {
      setErrorMsg('All fields required for edit.'); return;
    }
    const updated = employees.map(emp =>
      emp.id === editingEmp.id
        ? { ...emp, name: editName, basicPay: parseFloat(editBasicPay), otHours: parseFloat(editOtHours) }
        : emp
    );
    saveEmployees(updated);
    setEditingEmp(null);
    setSuccessMsg('Employee updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // -- Delete handlers --
  const confirmDelete = (empId) => setDeletingEmpId(empId);

  const handleDelete = () => {
    saveEmployees(employees.filter(emp => emp.id !== deletingEmpId));
    setDeletingEmpId(null);
    setSuccessMsg('Employee deleted.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAdminChangePassword = (e) => {
    e.preventDefault();
    if (!targetUserReset) { setErrorMsg('Select a user'); return; }
    const newAccounts = accounts.map(acc => {
      if (acc.username === targetUserReset) return { ...acc, password: newPassword };
      return acc;
    });
    setAccounts(newAccounts);
    setNewPassword(''); setTargetUserReset('');
    setSuccessMsg('Account password has been forcibly reset.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (accounts.find(a => a.username === sysUser)) {
      setErrorMsg('Username already exists.'); return;
    }
    setAccounts([...accounts, { username: sysUser, password: sysPass, role: 'user' }]);
    setSysUser(''); setSysPass('');
    setSuccessMsg('New user has been registered to the cloud.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const empList = Array.isArray(employees) ? employees : [];

  return (
    <div className="app-container">

      {/* ===== EDIT MODAL ===== */}
      {editingEmp && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', width: 440, position: 'relative' }}>
            <button onClick={() => setEditingEmp(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
              <Pencil size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Edit Employee — {editingEmp.id}
            </h3>
            <div className="flex-col gap-3">
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Full Name</label>
                <input className="glass-input" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Full Name" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Basic Pay (₹)</label>
                <input className="glass-input" type="number" min="0" value={editBasicPay} onChange={e => setEditBasicPay(e.target.value)} placeholder="Basic Pay" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                  OT Hours &nbsp;
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    (Rate: ₹{editBasicPay ? getOTRate(editBasicPay).toFixed(2) : '0.00'}/hr)
                  </span>
                </label>
                <input className="glass-input" type="number" min="0" step="0.5" value={editOtHours} onChange={e => setEditOtHours(e.target.value)} placeholder="OT Hours" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button className="glass-button" style={{ flex: 1, borderColor: 'var(--success)', color: 'var(--success)' }} onClick={handleSaveEdit}>
                  <Check size={16} /> Save Changes
                </button>
                <button className="glass-button" style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => setEditingEmp(null)}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {deletingEmpId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', width: 380, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ marginBottom: '0.75rem' }}>Confirm Delete</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Are you sure you want to permanently remove employee <strong style={{ color: 'white' }}>{deletingEmpId}</strong> from the system?
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="glass-button" style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={handleDelete}>
                <Trash2 size={16} /> Delete
              </button>
              <button className="glass-button" style={{ flex: 1 }} onClick={() => setDeletingEmpId(null)}>
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="sidebar glass-panel hide-on-print" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
        <div className="sidebar-brand">
          <div style={{ background: 'var(--accent)', padding: 8, borderRadius: 8 }}><IndianRupee size={24} color="white" /></div>
          PayVaultPro
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item interactive ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => switchTab('dashboard')}><LayoutDashboard size={20} /> Dashboard</button>
          <button className={`nav-item interactive ${activeTab === 'add' ? 'active' : ''}`} onClick={() => switchTab('add')}><Plus size={20} /> Add Employee</button>
          <button className={`nav-item interactive ${activeTab === 'ot' ? 'active' : ''}`} onClick={() => switchTab('ot')}><Clock size={20} /> Update Overtime</button>
          <button className={`nav-item interactive ${activeTab === 'payslip' ? 'active' : ''}`} onClick={() => switchTab('payslip')}><Receipt size={20} /> Gen Payslip</button>
          <button className={`nav-item interactive ${activeTab === 'list' ? 'active' : ''}`} onClick={() => switchTab('list')}><Users size={20} /> All Employees</button>
          <button className={`nav-item interactive ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => switchTab('settings')}><Settings size={20} /> Settings</button>
        </nav>

        <button className="nav-item interactive" onClick={onLogout} style={{ color: 'var(--danger)', marginTop: 'auto' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="main-content">
        <header className="flex-between hide-on-print" style={{ marginBottom: '3rem' }}>
          <h1 className="heading" style={{ margin: 0 }}>
            {activeTab === 'dashboard' && 'Overview'}
            {activeTab === 'add' && 'Onboard Employee'}
            {activeTab === 'ot' && 'Overtime Management'}
            {activeTab === 'payslip' && 'Payslip Generator'}
            {activeTab === 'list' && 'Employee Directory'}
            {activeTab === 'settings' && 'System Configuration'}
          </h1>
          <div className="flex-center gap-2">
            <span style={{ color: 'var(--text-secondary)' }}>Welcome, {currentUser.username} {currentUser.role === 'admin' ? '(Admin)' : ''}</span>
            <div className="flex-center glass-panel interactive" style={{ width: 40, height: 40, borderRadius: '50%' }}>
              <Users size={20} color="var(--accent)" />
            </div>
          </div>
        </header>

        {errorMsg && <div className="glass-panel animate-fade-in hide-on-print" style={{ padding: '1rem', marginBottom: '2rem', borderColor: 'var(--danger)', color: '#fee2e2' }}>{errorMsg}</div>}
        {successMsg && <div className="glass-panel animate-fade-in hide-on-print" style={{ padding: '1rem', marginBottom: '2rem', borderColor: 'var(--success)', color: '#d1fae5' }}>{successMsg}</div>}

        {/* ===== DASHBOARD TAB ===== */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <div className="glass-panel stat-card interactive" style={{ opacity: 1 }}>
                <span className="stat-title">Total Employees</span>
                <span className="stat-value">{empList.length}</span>
              </div>
              <div className="glass-panel stat-card interactive" style={{ opacity: 1 }}>
                <span className="stat-title">Total Payout</span>
                <span className="stat-value">₹{empList.reduce((a, e) => a + calculateNet(e.basicPay || 0, e.otHours || 0), 0).toFixed(2)}</span>
              </div>
              <div className="glass-panel stat-card interactive" style={{ opacity: 1 }}>
                <span className="stat-title">Average Pay</span>
                <span className="stat-value">
                  ₹{empList.length > 0 ? (empList.reduce((a, e) => a + calculateNet(e.basicPay || 0, e.otHours || 0), 0) / empList.length).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ===== ADD EMPLOYEE TAB ===== */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddEmployee} className="glass-panel animate-fade-in" style={{ padding: '2rem', maxWidth: '600px' }}>
            <div className="flex-col gap-3">
              <input required placeholder="Employee ID" className="glass-input interactive" value={empId} onChange={e => setEmpId(e.target.value)} />
              <input required placeholder="Full Name" className="glass-input interactive" value={name} onChange={e => setName(e.target.value)} />
              <div>
                <input required placeholder="Basic Pay (₹)" type="number" min="0" className="glass-input interactive" value={basicPay} onChange={e => setBasicPay(e.target.value)} />
                {basicPay && <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: 6 }}>
                  OT Rate: ₹{getOTRate(basicPay).toFixed(2)}/hr (1.5× hourly)
                </p>}
              </div>
              <input required placeholder="Initial OT Hours" type="number" min="0" step="0.5" className="glass-input interactive" value={otHours} onChange={e => setOtHours(e.target.value)} />
              <button type="submit" className="glass-button interactive">Register Employee</button>
            </div>
          </form>
        )}

        {/* ===== UPDATE OT TAB ===== */}
        {activeTab === 'ot' && (
          <form onSubmit={handleUpdateOT} className="glass-panel animate-fade-in" style={{ padding: '2rem', maxWidth: '500px' }}>
            <div className="flex-col gap-3">
              <select required className="glass-input interactive" value={otEmpId} onChange={e => setOtEmpId(e.target.value)} style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.5)' }}>
                <option value="">Select Employee...</option>
                {empList.map(emp => <option key={emp.id} value={emp.id}>{emp.name} (ID: {emp.id}) — ₹{getOTRate(emp.basicPay).toFixed(2)}/hr</option>)}
              </select>
              <input required placeholder="Hours to Add/Subtract (e.g. -2)" type="number" step="0.5" className="glass-input interactive" value={otAddHours} onChange={e => setOtAddHours(e.target.value)} />
              <button type="submit" className="glass-button interactive">Update Overtime</button>
            </div>
          </form>
        )}

        {/* ===== EMPLOYEE LIST TAB ===== */}
        {activeTab === 'list' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
            {empList.length === 0
              ? <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem' }}>No employees found. Add one first.</p>
              : empList.map(emp => (
                <div key={emp.id} className="interactive" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 0.5rem', borderBottom: '1px solid var(--border-color)',
                  gap: '1rem', flexWrap: 'wrap'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '1rem' }}>{emp.name}</strong>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: 8, fontSize: '0.85rem' }}>(ID: {emp.id})</span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Basic: ₹{emp.basicPay.toFixed(2)} &nbsp;|&nbsp; OT: {emp.otHours}hrs @ ₹{getOTRate(emp.basicPay).toFixed(2)}/hr
                    </div>
                  </div>
                  <div style={{ color: 'var(--success)', fontWeight: 600 }}>
                    Net: ₹{calculateNet(emp.basicPay, emp.otHours).toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => openEditModal(emp)}
                      title="Edit Employee"
                      style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid var(--accent)', borderRadius: 8, padding: '6px 10px', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', transition: 'all 0.2s' }}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(emp.id)}
                      title="Delete Employee"
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid var(--danger)', borderRadius: 8, padding: '6px 10px', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', transition: 'all 0.2s' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ===== PAYSLIP TAB ===== */}
        {activeTab === 'payslip' && (
          <div>
            <form onSubmit={generatePayslip} className="glass-panel animate-fade-in hide-on-print" style={{ padding: '2rem', maxWidth: '500px', marginBottom: '2rem' }}>
              <div className="flex-col gap-3">
                <select required className="glass-input interactive" value={payslipEmpId} onChange={e => setPayslipEmpId(e.target.value)} style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.5)' }}>
                  <option value="">Select Employee...</option>
                  {empList.map(emp => <option key={emp.id} value={emp.id}>{emp.name} (ID: {emp.id})</option>)}
                </select>
                <button type="submit" className="glass-button interactive">Generate Formatted Payslip</button>
              </div>
            </form>

            {activePayslip && (
              <div className="glass-panel animate-fade-in print-area interactive" style={{ padding: '3rem', maxWidth: '500px' }}>
                <div className="flex-between hide-on-print" style={{ marginBottom: '1rem' }}>
                  <h2 style={{ margin: 0, fontWeight: 600 }}>Salary Slip</h2>
                  <button className="glass-button interactive" onClick={() => window.print()} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    <Printer size={16} /> Print Document
                  </button>
                </div>

                <h2 className="print-only" style={{ color: 'black', borderBottom: '2px solid black', paddingBottom: '1rem', marginBottom: '1rem' }}>SALARY SLIP REPORT</h2>

                <div className="payslip-grid">
                  <span style={{ color: 'var(--text-secondary)' }} className="print-text">Employee ID:</span>
                  <span style={{ textAlign: 'right', fontWeight: 500 }} className="print-text-dark">{activePayslip.id}</span>

                  <span style={{ color: 'var(--text-secondary)' }} className="print-text">Name:</span>
                  <span style={{ textAlign: 'right', fontWeight: 500 }} className="print-text-dark">{activePayslip.name}</span>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <div className="payslip-row">
                    <span className="print-text">Basic Pay</span>
                    <span className="print-text-dark">₹{activePayslip.basicPay.toFixed(2)}</span>
                  </div>
                  <div className="payslip-row">
                    <span className="print-text">OT Rate</span>
                    <span style={{ color: 'var(--text-secondary)' }} className="print-text-dark">₹{getOTRate(activePayslip.basicPay).toFixed(2)}/hr</span>
                  </div>
                  <div className="payslip-row">
                    <span className="print-text">Overtime ({activePayslip.otHours} hrs)</span>
                    <span style={{ color: 'var(--success)' }} className="print-text-dark">+ ₹{(activePayslip.otHours * getOTRate(activePayslip.basicPay)).toFixed(2)}</span>
                  </div>
                  <div className="payslip-row">
                    <span className="print-text">Gross Pay</span>
                    <span className="print-text-dark">₹{calculateGross(activePayslip.basicPay, activePayslip.otHours).toFixed(2)}</span>
                  </div>
                  <div className="payslip-row">
                    <span className="print-text">Tax Deduction</span>
                    <span style={{ color: 'var(--danger)' }} className="print-text-dark">- ₹{calculateTax(calculateGross(activePayslip.basicPay, activePayslip.otHours)).toFixed(2)}</span>
                  </div>
                  <div className="payslip-row payslip-total">
                    <span className="print-text-dark">Net Pay</span>
                    <span className="print-text-dark">₹{calculateNet(activePayslip.basicPay, activePayslip.otHours).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== SETTINGS TAB ===== */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {currentUser.role === 'admin' ? (
              <>
                <div className="glass-panel interactive" style={{ padding: '2rem', maxWidth: '600px' }}>
                  <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Admin: Override User Password</h3>
                  <form onSubmit={handleAdminChangePassword} className="flex-col gap-3">
                    <select required className="glass-input interactive" value={targetUserReset} onChange={e => setTargetUserReset(e.target.value)} style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.5)' }}>
                      <option value="">Select a user...</option>
                      {accounts.map(a => <option key={a.username} value={a.username}>{a.username} ({a.role})</option>)}
                    </select>
                    <input required type="password" placeholder="New Assigned Password" className="glass-input interactive" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    <button type="submit" className="glass-button interactive">Force Update Password</button>
                  </form>
                </div>

                <div className="glass-panel interactive" style={{ padding: '2rem', maxWidth: '600px' }}>
                  <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--success)', margin: 0 }}>Register New User</h3>
                    <Award color="var(--success)" size={24} />
                  </div>
                  <form onSubmit={handleAddUser} className="flex-col gap-3">
                    <input required type="text" placeholder="New Username" className="glass-input interactive" value={sysUser} onChange={e => setSysUser(e.target.value)} />
                    <input required type="password" placeholder="Temporary Password" className="glass-input interactive" value={sysPass} onChange={e => setSysPass(e.target.value)} />
                    <button type="submit" className="glass-button interactive" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>Register Sub-User</button>
                  </form>

                  <div style={{ marginTop: '2rem' }}>
                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active Accounts</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {accounts.map(a => (
                        <li key={a.username} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <strong>{a.username}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>({a.role})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
                <h3 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Access Denied</h3>
                <p style={{ color: 'var(--text-secondary)' }}>You do not have system administrator privileges. Contact your admin for account changes.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
