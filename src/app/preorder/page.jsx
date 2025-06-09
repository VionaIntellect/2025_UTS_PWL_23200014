"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./PreorderPage.module.css";

export default function PreorderPage() {
  const router = useRouter();

  const [formVisible, setFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [orderDate, setOrderDate] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [qty, setQty] = useState("");
  const [status, setStatus] = useState("");

  const [dataList, setDataList] = useState([]);
  const [packageOptions, setPackageOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("dataList");
    if (savedOrders) setDataList(JSON.parse(savedOrders));
  }, []);

  useEffect(() => {
    const savedPackages = localStorage.getItem("packageData");
    if (savedPackages) {
      try {
        setPackageOptions(JSON.parse(savedPackages));
      } catch {
        setPackageOptions([]);
      }
    }
  }, []);

  useEffect(() => {
    const savedCustomers = localStorage.getItem("customerData");
    if (savedCustomers) {
      try {
        setCustomerOptions(JSON.parse(savedCustomers));
      } catch {
        setCustomerOptions([]);
      }
    }
  }, []);

  const resetForm = () => {
    setOrderDate("");
    setOrderBy("");
    setSelectedPackage("");
    setQty("");
    setStatus("");
    setEditIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderDate || !orderBy || !selectedPackage || !qty || !status) return;

    const newData = {
      order_date: orderDate,
      order_by: orderBy,
      selected_package: selectedPackage,
      qty,
      status,
    };

    let updatedList = [...dataList];
    if (editIndex !== null) {
      updatedList[editIndex] = newData;
      setEditIndex(null);
    } else {
      updatedList.push(newData);
    }

    localStorage.setItem("dataList", JSON.stringify(updatedList));
    setDataList(updatedList);

    resetForm();
    setFormVisible(false);
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

  const handleDelete = (index) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      const updated = [...dataList];
      updated.splice(index, 1);
      localStorage.setItem("dataList", JSON.stringify(updated));
      setDataList(updated);
    }
  };

  const goToPackagePage = () => {
    router.push("/package");
  };

  const goToCustomerPage = () => {
    router.push("/customer");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ayam Penyet Koh Alex</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          className={styles.buttonToggle}
          onClick={goToPackagePage}
          style={{ marginRight: "15px" }}
        >
          Go to Package
        </button>

        <button
          className={styles.buttonToggle}
          onClick={goToCustomerPage}
        >
          Go to Customer
        </button>
      </div>

      <button
        className={styles.buttonToggle}
        onClick={() => {
          if (formVisible) resetForm();
          setFormVisible(!formVisible);
        }}
      >
        {formVisible ? "Tutup Form" : "Tambah Pesanan"}
      </button>

      {formVisible && (
        <div className={styles.formWrapper}>
          <h3>{editIndex !== null ? "Edit Pesanan" : "Input Pesanan Baru"}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Tanggal Pesanan</label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Nama Pemesan</label>
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                required
              >
                <option value="">Pilih Pelanggan</option>
                {customerOptions.length === 0 && (
                  <option disabled>-- Tidak ada pelanggan --</option>
                )}
                {customerOptions.map((cust) => (
                  <option key={cust.id} value={cust.name}>
                    {cust.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Paket</label>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                required
              >
                <option value="">Pilih Paket</option>
                {packageOptions.length === 0 && (
                  <option disabled>-- Tidak ada paket --</option>
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
                type="number"
                min="1"
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
                  name="status"
                  value="Lunas"
                  checked={status === "Lunas"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Lunas
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Belum Lunas"
                  checked={status === "Belum Lunas"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Belum Lunas
              </label>
            </div>

            <button type="submit" className={styles.saveButton}>
              {editIndex !== null ? "Perbarui" : "Simpan"}
            </button>
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
            {dataList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  Tidak ada data pesanan
                </td>
              </tr>
            ) : (
              dataList.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.order_date}</td>
                  <td>{item.order_by}</td>
                  <td>{item.selected_package}</td>
                  <td>{item.qty}</td>
                  <td>{item.status}</td>
                  <td>
                    <button
                      className={`${styles.actionButton}`}
                      onClick={() => handleEdit(i)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDelete(i)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
