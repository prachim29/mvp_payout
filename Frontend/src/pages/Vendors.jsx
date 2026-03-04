import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/vendors");
      setVendors(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">
          <i className="bi bi-people me-2"></i>Vendor List
        </h2>
        <Link to="/add-vendor" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>Add Vendor
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="spinner-overlay">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox" style={{ fontSize: "3rem" }}></i>
              <p className="mt-2 mb-0">No vendors yet. Add your first vendor to get started.</p>
              <Link to="/add-vendor" className="btn btn-outline-primary mt-3">Add Vendor</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>UPI ID</th>
                    <th>Bank Account</th>
                    <th>IFSC</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v._id}>
                      <td className="fw-medium">{v.name}</td>
                      <td>{v.upi_id || "-"}</td>
                      <td>{v.bank_account || "-"}</td>
                      <td>{v.ifsc || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vendors;
