"use client";
import styles from './PackagePage.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PackagePage() {
  const [formVisible, setFormVisible] = useState(false);
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [dataList, setDataList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [msg, setMsg] = useState('');

  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem('packageData');
    if (savedData) {
      setDataList(JSON.parse(savedData));
    }
  }, []);

  const resetForm = () => {
    setKode('');
    setNama('');
    setDeskripsi('');
    setEditIndex(null);
    setFormVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!kode || !nama || !deskripsi) {
      setMsg('Semua kolom wajib diisi!');
      return;
    }

    const newData = { kode, nama, deskripsi };
    let updatedList;

    if (editIndex !== null) {
      updatedList = [...dataList];
      updatedList[editIndex] = newData;
      setMsg('Data berhasil diperbarui!');
    } else {
      updatedList = [...dataList, newData];
    }

    localStorage.setItem('packageData', JSON.stringify(updatedList));
    setDataList(updatedList);
    resetForm();
  };

  const handleEdit = (index) => {
    const data = dataList[index];
    setKode(data.kode);
    setNama(data.nama);
    setDeskripsi(data.deskripsi);
    setFormVisible(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (!confirmed) return;

    const updatedList = [...dataList];
    updatedList.splice(index, 1);
    localStorage.setItem('packageData', JSON.stringify(updatedList));
    setDataList(updatedList);
  };

  const goToPreorderPage = () => {
    router.push('/preorder');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Paket Ayam Penyet Koh Alex</h1>

      <div style={{ marginBottom: '15px' }}>
        <button
          className={styles.buttonToggle}
          onClick={goToPreorderPage}
          style={{ display: 'block', marginBottom: '35px', width: 'auto' }}
        >
          Go to Preorder
        </button>

        <button
          className={styles.buttonToggle}
          onClick={() => {
            setFormVisible(!formVisible);
            if (formVisible) resetForm();
          }}
          style={{ display: 'block', width: 'auto' }}
        >
          {formVisible ? 'Tutup Form' : 'Tambah Paket'}
        </button>
      </div>

      {formVisible && (
        <form className={styles.formWrapper} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Kode:</label>
            <input
              type="text"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Nama:</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Deskripsi:</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              required
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
              <th>Kode</th>
              <th>Nama</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.kode}</td>
                <td>{item.nama}</td>
                <td>{item.deskripsi}</td>
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
