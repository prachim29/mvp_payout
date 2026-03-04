import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

function getStatusBadgeClass(status) {
  switch (status) {
    case "Approved": return "bg-success";
    case "Rejected": return "bg-danger";
    case "Submitted": return "bg-info";
    case "Draft": return "bg-secondary";
    default: return "bg-secondary";
  }
}

function PayoutDetail() {
  const { id } = useParams();
  const [payout, setPayout] = useState(null);
  const [audit, setAudit] = useState([]);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const modalRef = useRef(null);

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchPayout();
  }, [id]);

  const fetchPayout = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/payouts/${id}`);
      setPayout(res.data.payout);
      setAudit(res.data.audit || []);
    } catch (err) {
      setPayout(null);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    setActionLoading("submit");
    try {
      await api.post(`/payouts/${id}/submit`);
      fetchPayout();
    } catch (err) {
      // handle error
    } finally {
      setActionLoading("");
    }
  };

  const approve = async () => {
    setActionLoading("approve");
    try {
      await api.post(`/payouts/${id}/approve`);
      fetchPayout();
    } catch (err) {
      // handle error
    } finally {
      setActionLoading("");
    }
  };

  const openRejectModal = () => {
    setRejectReason("");
    setRejectError("");
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };

  const reject = async () => {
    if (!rejectReason.trim()) {
      setRejectError("Please enter a rejection reason");
      return;
    }
    setActionLoading("reject");
    try {
      await api.post(`/payouts/${id}/reject`, { reason: rejectReason.trim() });
      const modal = window.bootstrap.Modal.getInstance(modalRef.current);
      modal?.hide();
      fetchPayout();
    } catch (err) {
      setRejectError(err.response?.data?.message || "Failed to reject payout");
    } finally {
      setActionLoading("");
    }
  };

  const formatAmount = (amt) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amt);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  if (loading && !payout) {
    return (
      <div className="spinner-overlay">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!payout) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>Payout not found.
        <Link to="/payouts" className="btn btn-link">Back to Payouts</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">
          <i className="bi bi-receipt me-2"></i>Payout Details
        </h2>
        <Link to="/payouts" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i>Back to Payouts
        </Link>
      </div>

      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Payout #{id.slice(-6).toUpperCase()}</span>
              <span className={`badge ${getStatusBadgeClass(payout.status)} badge-status`}>
                {payout.status}
              </span>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="text-muted small">Vendor</label>
                  <p className="mb-0 fw-medium">{payout.vendor_id?.name || "-"}</p>
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-muted small">Amount</label>
                  <p className="mb-0 fw-medium fs-5 text-primary">{formatAmount(payout.amount)}</p>
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-muted small">Payment Mode</label>
                  <p className="mb-0"><span className="badge bg-light text-dark">{payout.mode}</span></p>
                </div>
                {payout.note && (
                  <div className="col-12">
                    <label className="text-muted small">Note</label>
                    <p className="mb-0">{payout.note}</p>
                  </div>
                )}
                {payout.decision_reason && (
                  <div className="col-12">
                    <label className="text-muted small">Decision Reason</label>
                    <p className="mb-0 text-danger">{payout.decision_reason}</p>
                  </div>
                )}
              </div>

              {role === "OPS" && payout.status === "Draft" && (
                <div className="mt-4 pt-3 border-top">
                  <button
                    className="btn btn-primary"
                    onClick={submit}
                    disabled={actionLoading === "submit"}
                  >
                    {actionLoading === "submit" ? (
                      <span className="spinner-border spinner-border-sm me-1"></span>
                    ) : (
                      <i className="bi bi-send me-1"></i>
                    )}
                    Submit
                  </button>
                </div>
              )}

              {role === "FINANCE" && payout.status === "Submitted" && (
                <div className="mt-4 pt-3 border-top d-flex gap-2">
                  <button
                    className="btn btn-success"
                    onClick={approve}
                    disabled={actionLoading === "approve"}
                  >
                    {actionLoading === "approve" ? (
                      <span className="spinner-border spinner-border-sm me-1"></span>
                    ) : (
                      <i className="bi bi-check-lg me-1"></i>
                    )}
                    Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={openRejectModal}
                    disabled={actionLoading === "reject"}
                  >
                    {actionLoading === "reject" ? (
                      <span className="spinner-border spinner-border-sm me-1"></span>
                    ) : (
                      <i className="bi bi-x-lg me-1"></i>
                    )}
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-header">
              <i className="bi bi-clock-history me-2"></i>Audit Trail
            </div>
            <div className="card-body">
              {audit.length === 0 ? (
                <p className="text-muted small mb-0">No audit records yet.</p>
              ) : (
                <div className="audit-list">
                  {audit.map((a) => (
                    <div key={a._id} className="d-flex align-items-start mb-3">
                      <i className="bi bi-circle-fill text-primary me-2 mt-1" style={{ fontSize: "0.5rem" }}></i>
                      <div>
                        <span className="fw-medium">{a.action}</span>
                        <p className="small text-muted mb-0">
                          by {a.performed_by?.email || "System"} • {formatDate(a.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reject Payout</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {rejectError && (
                <div className="alert alert-danger py-2">{rejectError}</div>
              )}
              <label className="form-label fw-medium">Rejection Reason <span className="text-danger">*</span></label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Enter reason for rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={reject}
                disabled={actionLoading === "reject" || !rejectReason.trim()}
              >
                {actionLoading === "reject" ? <span className="spinner-border spinner-border-sm me-1"></span> : null}
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayoutDetail;
