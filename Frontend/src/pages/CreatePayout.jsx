import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function CreatePayout() {
  const [vendors, setVendors] = useState([]);
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("UPI");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await api.get("/vendors");
      setVendors(res.data);
    } catch (err) {
      setSubmitError("Failed to load vendors");
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!vendor) {
      newErrors.vendor = "Please select a vendor";
    }
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt)) {
      newErrors.amount = "Amount is required";
    } else if (amt <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (amt > 999999999) {
      newErrors.amount = "Amount is too large";
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
      await api.post("/payouts", {
        vendor_id: vendor,
        amount: parseFloat(amount),
        mode,
        note: note.trim() || undefined,
      });
      navigate("/payouts");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to create payout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">
        <i className="bi bi-plus-circle me-2"></i>Create Payout
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
                  <label className="form-label fw-medium">Vendor <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${errors.vendor ? "is-invalid" : ""}`}
                    value={vendor}
                    onChange={(e) => {
                      setVendor(e.target.value);
                      if (errors.vendor) setErrors((prev) => ({ ...prev, vendor: "" }));
                    }}
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((v) => (
                      <option key={v._id} value={v._id}>{v.name}</option>
                    ))}
                  </select>
                  {errors.vendor && <div className="invalid-feedback d-block">{errors.vendor}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Amount (₹) <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-currency-rupee"></i></span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
                      }}
                    />
                  </div>
                  {errors.amount && <div className="invalid-feedback d-block">{errors.amount}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Payment Mode</label>
                  <select className="form-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="UPI">UPI</option>
                    <option value="IMPS">IMPS</option>
                    <option value="NEFT">NEFT</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">Note</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Optional note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm me-1"></span> : null}
                    Create Payout
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/payouts")}>
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

export default CreatePayout;
