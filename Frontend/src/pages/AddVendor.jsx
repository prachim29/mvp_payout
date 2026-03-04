import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const UPI_REGEX = /^[\w.-]+@[\w.-]+$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

function AddVendor() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Vendor name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Vendor name must be at least 2 characters";
    }
    if (upi.trim() && !UPI_REGEX.test(upi)) {
      newErrors.upi = "Invalid UPI ID format (e.g. name@bank)";
    }
    if (ifsc.trim() && !IFSC_REGEX.test(ifsc.toUpperCase())) {
      newErrors.ifsc = "IFSC must be 11 characters (e.g. SBIN0001234)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/vendors", {
        name: name.trim(),
        upi_id: upi.trim() || undefined,
        bank_account: bank.trim() || undefined,
        ifsc: ifsc.trim().toUpperCase() || undefined,
      });
      navigate("/vendors");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">
        <i className="bi bi-person-plus me-2"></i>Add Vendor
      </h2>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card">
            <div className="card-body p-4">
              {submitError && (
                <div className="alert alert-danger alert-dismissible fade show">
                  <i className="bi bi-exclamation-triangle me-2"></i>{submitError}
                  <button type="button" className="btn-close" onClick={() => setSubmitError("")}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-medium">Vendor Name <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="Enter vendor name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                    />
                  </div>
                  {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">UPI ID</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-phone"></i></span>
                    <input
                      className={`form-control ${errors.upi ? "is-invalid" : ""}`}
                      placeholder="name@bank (optional)"
                      value={upi}
                      onChange={(e) => {
                        setUpi(e.target.value);
                        if (errors.upi) setErrors((prev) => ({ ...prev, upi: "" }));
                      }}
                    />
                  </div>
                  {errors.upi && <div className="invalid-feedback d-block">{errors.upi}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Bank Account</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-bank"></i></span>
                    <input
                      className="form-control"
                      placeholder="Bank account number (optional)"
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">IFSC Code</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-upc"></i></span>
                    <input
                      className={`form-control ${errors.ifsc ? "is-invalid" : ""}`}
                      placeholder="e.g. SBIN0001234 (optional)"
                      value={ifsc}
                      onChange={(e) => {
                        setIfsc(e.target.value.toUpperCase());
                        if (errors.ifsc) setErrors((prev) => ({ ...prev, ifsc: "" }));
                      }}
                      maxLength={11}
                    />
                  </div>
                  {errors.ifsc && <div className="invalid-feedback d-block">{errors.ifsc}</div>}
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm me-1"></span> : null}
                    Create Vendor
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/vendors")}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddVendor;
