"use client";
import styles from './CustomerPage.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  

export default function CustomerPage() {
  const router = useRouter(); 

  const [formVisible, setFormVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dataList, setDataList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem('customerData');
    if (savedData) {
      setDataList(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const preorderData = localStorage.getItem('dataList');
    if (preorderData) {
      const parsed = JSON.parse(preorderData);
      const uniqueNames = [...new Set(parsed.map(item => item.order_by))];

      const existingNames = dataList.map(item => item.name);
      const newCustomers = uniqueNames
        .filter(name => !existingNames.includes(name))
        .map(name => ({
          id: Date.now() + Math.random(),
          name,
          phone: '',
          email: '',
          createdAt: new Date().toISOString(),
        }));

      if (newCustomers.length > 0) {
        const updatedList = [...dataList, ...newCustomers];
        setDataList(updatedList);
        localStorage.setItem('customerData', JSON.stringify(updatedList));
      }
    }
  }, [dataList]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setEditIndex(null);
    setFormVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !phone) {
      setMsg('Nama dan Nomor Telepon wajib diisi!');
      return;
    }

    const newData = {
      id: Date.now(),
      name,
      phone,
      email,
      createdAt: new Date().toISOString()
    };

    let updatedList;
    if (editIndex !== null) {
      updatedList = [...dataList];
      updatedList[editIndex] = newData;
      setMsg('Data pelanggan berhasil diperbarui!');
    } else {
      updatedList = [...dataList, newData];
    }

    localStorage.setItem('customerData', JSON.stringify(updatedList));
    setDataList(updatedList);
    resetForm();
  };

  const handleEdit = (index) => {
    const data = dataList[index];
    setName(data.name);
    setPhone(data.phone);
    setEmail(data.email || '');
    setFormVisible(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (!confirmed) return;

    const updatedList = [...dataList];
    updatedList.splice(index, 1);
    localStorage.setItem('customerData', JSON.stringify(updatedList));
    setDataList(updatedList);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pelanggan Ayam Penyet Koh Alex</h1>

      <div style={{ marginBottom: "20px" }}>
        <button 
          className={styles.buttonToggle} 
          onClick={() => router.push("/preorder")}
        >
          Go to Preorder
        </button>
      </div>

      <button
        className={styles.buttonToggle}
        onClick={() => {
          setFormVisible(!formVisible);
          if (formVisible) resetForm();
        }}
      >
        {formVisible ? 'Tutup Form' : 'Tambah Pelanggan'}
      </button>

      {formVisible && (
        <form className={styles.formWrapper} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nama:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>No. Telepon:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email (opsional):</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit">{editIndex !== null ? 'Perbarui' : 'Simpan'}</button>
          <p>{msg}</p>
        </form>
      )}

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Telepon</th>
              <th>Email</th>
              <th>Waktu</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.phone || '-'}</td>
                <td>{item.email || '-'}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete(index)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
