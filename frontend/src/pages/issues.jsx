import { useEffect, useState } from "react";
import api from "../services/api";

function Issues() {
  const emptyForm = {
    employee_id: "",
    asset_id: "",
    issue_date: "",
    expected_return_date: "",
    reason: "",
  };

  const [issues, setIssues] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // Load Data
  // =========================

  const loadData = async () => {
    try {
      const [
        issuesResponse,
        employeesResponse,
        assetsResponse,
      ] = await Promise.all([
        api.get("/api/issues"),
        api.get("/api/employees"),
        api.get("/api/assets"),
      ]);

      if (issuesResponse.data.success) {
        setIssues(issuesResponse.data.data);
      }

      if (employeesResponse.data.success) {
        setEmployees(employeesResponse.data.data);
      }

      if (assetsResponse.data.success) {
        setAssets(assetsResponse.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  // =========================
  // Form Change
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // Open Modal
  // =========================

  const openIssueModal = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  // =========================
  // Close Modal
  // =========================

  const closeModal = () => {
    setForm(emptyForm);
    setShowModal(false);
  };

  // =========================
  // Issue Asset
  // =========================

  const issueAsset = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/api/issues", form);

      closeModal();
      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Unable to issue asset"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Delete Issue
  // =========================

  const deleteIssue = async (id) => {
    if (!window.confirm("Delete this issue?")) {
      return;
    }

    try {
      await api.delete(`/api/issues/${id}`);
      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Unable to delete issue"
      );
    }
  };

  // =========================
  // Return Asset
  // =========================

  const returnAsset = async (issue) => {
    const returnDate = window.prompt(
      "Enter return date (YYYY-MM-DD)"
    );

    if (!returnDate) {
      return;
    }

    try {
      await api.post(
        `/api/issues/${issue.issue_id}/return`,
        {
          return_date: returnDate,
        }
      );

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Unable to return asset"
      );
    }
  };

  const availableAssets = assets.filter(
    (asset) => asset.status === "IN_STOCK"
  );

  return (
    <div>
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Issue History</h1>
          <p>Track issued and returned assets</p>
        </div>

        <button
          className="primary-button"
          onClick={openIssueModal}
        >
          + Issue Asset
        </button>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="table-panel">
        <h2>Issue History</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Employee</th>
                <th>Asset</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue) => (
                <tr key={issue.issue_id}>
                  <td>{issue.issue_id}</td>

                  <td>
                    {issue.Employee?.employee_name ||
                      issue.employee_name ||
                      "-"}
                  </td>

                  <td>
                    {issue.Asset?.asset_name ||
                      issue.asset_name ||
                      "-"}
                  </td>

                  <td>{issue.issue_date}</td>

                  <td>
                    {issue.return_date || "-"}
                  </td>

                  <td>{issue.reason || "-"}</td>

                  <td>
                    <div className="action-buttons">
                      {!issue.return_date && (
                        <button
                          className="warning-button"
                          onClick={() =>
                            returnAsset(issue)
                          }
                        >
                          Return
                        </button>
                      )}

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteIssue(
                            issue.issue_id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!issues.length && (
                <tr>
                  <td
                    colSpan="7"
                    className="empty-cell"
                  >
                    No issue history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          ISSUE MODAL
      ========================= */}

      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="modal-container issue-modal">
            <div className="modal-header">
              <div>
                <h2>Issue Asset</h2>

                <p>
                  Assign an available asset to an
                  employee
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={issueAsset}>
              <div className="form-grid">
                {/* Asset */}

                <div>
                  <label>Asset</label>

                  <select
                    name="asset_id"
                    value={form.asset_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Asset
                    </option>

                    {availableAssets.map((asset) => (
                      <option
                        key={asset.asset_id}
                        value={asset.asset_id}
                      >
                        {asset.asset_name}
                        {asset.serial_number
                          ? ` - ${asset.serial_number}`
                          : ""}
                      </option>
                    ))}
                  </select>

                  {!availableAssets.length && (
                    <small>
                      No available assets in stock.
                    </small>
                  )}
                </div>

                {/* Employee */}

                <div>
                  <label>Employee</label>

                  <select
                    name="employee_id"
                    value={form.employee_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Employee
                    </option>

                    {employees.map((employee) => (
                      <option
                        key={employee.employee_id}
                        value={employee.employee_id}
                      >
                        {employee.employee_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Issue Date */}

                <div>
                  <label>Issue Date</label>

                  <input
                    type="date"
                    name="issue_date"
                    value={form.issue_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Expected Return */}

                <div>
                  <label>
                    Expected Return Date
                  </label>

                  <input
                    type="date"
                    name="expected_return_date"
                    value={
                      form.expected_return_date
                    }
                    onChange={handleChange}
                  />
                </div>

                {/* Reason */}

                <div className="form-full-width">
                  <label>Reason</label>

                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter reason for issuing asset"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="success-button"
                  disabled={
                    loading ||
                    !availableAssets.length
                  }
                >
                  {loading
                    ? "Processing..."
                    : "Issue Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Issues;