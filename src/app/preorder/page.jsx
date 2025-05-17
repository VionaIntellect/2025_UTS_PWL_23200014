"use client";
import styles from './PreorderPage.module.css';
import { useState, useEffect } from 'react';

export default function PreorderPageDynamic() {
  const [formVisible, setFormVisible] = useState(false);
  const [order_date, setOrderDate] = useState('');
  const [order_by, setOrderBy] = useState('');
  const [selected_package, setSelectedPackage] = useState('');
  const [qty, setQty] = useState('');
  const [status, setStatus] = useState('');
  const [dataList, setDataList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [packageOptions, setPackageOptions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('dataList');
    if (saved) {
      setDataList(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const packages = localStorage.getItem('packageData');
    if (packages) {
      try {
        const parsed = JSON.parse(packages);
        setPackageOptions(parsed);
      } catch {
        setPackageOptions([]);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!order_date || !order_by || !selected_package || !qty || !status) return;

    const newData = { order_date, order_by, selected_package, qty, status };
    let updatedList = [...dataList];

    if (editIndex !== null) {
      updatedList[editIndex] = newData;
      setEditIndex(null);
    } else {
      updatedList.push(newData);
    }

    localStorage.setItem('dataList', JSON.stringify(updatedList));
    setDataList(updatedList);

    setOrderDate('');
    setOrderBy('');
    setSelectedPackage('');
    setQty('');
    setStatus('');
    setFormVisible(false);
  };

  const handleDelete = (index) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const updated = [...dataList];
      updated.splice(index, 1);
      setDataList(updated);
      localStorage.setItem('dataList', JSON.stringify(updated));
    }
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
              <label>Tanggal Pesanan</label>
              <input
                type="date"
                value={order_date}
                onChange={(e) => setOrderDate(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nama Pemesan</label>
              <input
                type="text"
                value={order_by}
                onChange={(e) => setOrderBy(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Paket</label>
              <select
                value={selected_package}
                onChange={(e) => setSelectedPackage(e.target.value)}
                required
              >
                <option value="">Pilih Paket</option>
                {packageOptions.length === 0 && (
                  <>
                    <option disabled>-- Tidak ada paket tersedia --</option>
                  </>
                )}
                {packageOptions.map((pkg, i) => (
                  <option key={i} value={pkg.nama}>
                    {pkg.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Jumlah</label>
              <input
                type="text"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <label>
                <input
                  type="radio"
                  value="Lunas"
                  checked={status === 'Lunas'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Lunas
              </label>
              <label>
                <input
                  type="radio"
                  value="Belum Lunas"
                  checked={status === 'Belum Lunas'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Belum Lunas
              </label>
            </div>
            <button type="submit">{editIndex !== null ? 'Perbarui' : 'Simpan'}</button>
          </form>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Pemesan</th>
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
                  <button onClick={() => handleDelete(index)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
