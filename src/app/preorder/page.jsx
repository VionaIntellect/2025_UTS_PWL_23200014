"use client";
import styles from './PreorderPage.module.css';
import { useState, useEffect } from 'react';

export default function PreorderPage() {
  const [formVisible, setFormVisible] = useState(false);
  const [order_date, setOrderDate] = useState('');
  const [order_by, setOrderBy] = useState('');
  const [selected_package, setSelectedPackage] = useState('');
  const [qty, setQty] = useState('');
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');
  const [dataList, setDataList] = useState([]);
  const [editIndex, setEditIndex] = useState(null); 

  
  useEffect(() => {
    const savedData = localStorage.getItem('dataList');
    if (savedData) {
      setDataList(JSON.parse(savedData));
    }
  }, []);

  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!order_date || !order_by || !selected_package || !qty || !status) {
      setMsg('Semua kolom wajib diisi!');
      return;
    }

    const newData = {
      order_date,
      order_by,
      selected_package,
      qty,
      status,
    };

    let updatedList;
    if (editIndex !== null) {
   
      updatedList = [...dataList];
      updatedList[editIndex] = newData;
      setEditIndex(null);
      setMsg('Data berhasil diperbarui!');
    } else {
  
      updatedList = [...dataList, newData];
      setMsg('Data berhasil disimpan!');
    }

    localStorage.setItem('dataList', JSON.stringify(updatedList));

    setDataList(updatedList);

    setOrderDate('');
    setOrderBy('');
    setSelectedPackage('');
    setQty('');
    setStatus('');
  };

  const handleDelete = (index) => {
    const updatedList = [...dataList];
    updatedList.splice(index, 1);
    setDataList(updatedList);

    localStorage.setItem('dataList', JSON.stringify(updatedList));
  };

  const handleEdit = (index) => {
    const data = dataList[index];
    setOrderDate(data.order_date);
    setOrderBy(data.order_by);
    setSelectedPackage(data.selected_package);
    setQty(data.qty);
    setStatus(data.status);
    setFormVisible(true);
    setEditIndex(index);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ayam Penyet Koh Alex</h1>
      <button
        className={styles.buttonToggle}
        onClick={() => {
          setFormVisible(!formVisible);
          setEditIndex(null); 
        }}
      >
        {formVisible ? 'Tutup Form' : 'Tambah Data'}
      </button>

      {formVisible && (
        <div className={styles.formWrapper}>
          <h3>{editIndex !== null ? 'Edit Data' : 'Input Data Baru'}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <span>Tanggal Pesanan</span>
              <input
                type="date"
                value={order_date}
                onChange={(e) => setOrderDate(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <span>Nama Pemesan</span>
              <input
                type="text"
                value={order_by}
                onChange={(e) => setOrderBy(e.target.value)}
                placeholder="Masukkan Nama Pemesan"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <span>Paket</span>
              <select
                value={selected_package}
                onChange={(e) => setSelectedPackage(e.target.value)}
                required
              >
                <option value="">Pilih Paket</option>
                <option value="Paket 1">Paket 1</option>
                <option value="Paket 2">Paket 2</option>
                <option value="Paket 3">Paket 3</option>
                <option value="Paket 4">Paket 4</option>
                <option value="Paket 5">Paket 5</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <span>Jumlah</span>
              <input
                type="text"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="Input Jumlah"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <span>Status</span>
              <label>
                <input
                  type="radio"
                  value="Lunas"
                  checked={status === "Lunas"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Lunas
              </label>
              <label>
                <input
                  type="radio"
                  value="Belum Lunas"
                  checked={status === "Belum Lunas"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Belum Lunas
              </label>
            </div>
            <button type="submit">
              {editIndex !== null ? 'Perbarui' : 'Simpan'}
            </button>
            <p>{msg}</p>
          </form>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal Pesanan</th>
              <th>Nama Pemesan</th>
              <th>Paket</th>
              <th>Jumlah</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.order_date}</td>
                <td>{item.order_by}</td>
                <td>{item.selected_package}</td>
                <td>{item.qty}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
