import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "Draft", label: "Draft" },
  { value: "Submitted", label: "Submitted" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

function getStatusBadgeClass(status) {
  switch (status) {
    case "Approved": return "bg-success";
    case "Rejected": return "bg-danger";
    case "Submitted": return "bg-info";
    case "Draft": return "bg-secondary";
    default: return "bg-secondary";
  }
}

function formatAmount(amt) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amt);
}

function PayoutList() {
  const [payouts, setPayouts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [status, setStatus] = useState("");
  const [vendor, setVendor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    fetchPayouts();
  }, [status, vendor]);

  const fetchVendors = async () => {
    try {
      const res = await api.get("/vendors");
      setVendors(res.data);
    } catch (err) {
      setError("Failed to load vendors");
    }
  };

  const fetchPayouts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (vendor) params.append("vendor", vendor);
      const res = await api.get(`/payouts?${params}`);
      setPayouts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payouts");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h2 className="page-title mb-0">
          <i className="bi bi-credit-card-2-front me-2"></i>Payout List
        </h2>
        <Link to="/create-payout" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>Create Payout
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-header bg-white py-3 border-bottom">
          <i className="bi bi-funnel me-2"></i>Filters
        </div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small text-muted mb-1">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small text-muted mb-1">Vendor</label>
              <select
                className="form-select"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              >
                <option value="">All Vendors</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-2">
              <button className="btn btn-outline-primary w-100" onClick={fetchPayouts}>
                <i className="bi bi-arrow-clockwise me-1"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-body p-0">
          {loading ? (
            <div className="spinner-overlay">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : payouts.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox" style={{ fontSize: "3rem" }}></i>
              <p className="mt-2 mb-0">No payouts found.</p>
              <Link to="/create-payout" className="btn btn-outline-primary mt-3">Create Payout</Link>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Vendor</th>
                      <th>Amount</th>
                      <th>Mode</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <span className="fw-semibold text-dark">{p.vendor_id?.name || "-"}</span>
                        </td>
                        <td>
                          <span className="text-success fw-semibold">{formatAmount(p.amount)}</span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">{p.mode}</span>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(p.status)} badge-status`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/payout/${p._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bi bi-eye me-1"></i>View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer bg-white border-top py-2 px-3">
                <small className="text-muted">
                  <strong>{payouts.length}</strong> payout{payouts.length !== 1 ? "s" : ""}
                  {payouts.length > 0 && (
                    <span className="ms-2">
                      • Total: <strong className="text-success">{formatAmount(totalAmount)}</strong>
                    </span>
                  )}
                </small>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PayoutList;