import { useEffect, useState } from "react";
import api from "../services/api";

function Employees() {
  const emptyForm = {
    employee_id: "",
    employee_name: "",
    email: "",
    department: "",
    branch: "",
    status: "ACTIVE",
    joined_at: "",
  };

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [filters, setFilters] = useState({
    status: "",
    department: "",
    branch: "",
  });

  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // Load Employees
  // =========================

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/employees");

      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error("Error loading employees:", error);

      const message =
        error.response?.data?.error ||
        "Unable to load employees.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployees();
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
  // Open Add Modal
  // =========================

  const openAddModal = () => {
    setEditing(false);
    setForm(emptyForm);
    setShowModal(true);
  };

  // =========================
  // Close Modal
  // =========================

  const closeModal = () => {
    setShowModal(false);
    setEditing(false);
    setForm(emptyForm);
  };

  // =========================
  // Save Employee
  // =========================

  const saveEmployee = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = {
        employee_name: form.employee_name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
        branch: form.branch.trim(),
        status: form.status || "ACTIVE",
        joined_at: form.joined_at || null,
      };

      if (editing) {
        await api.put(
          `/api/employees/${form.employee_id}`,
          data
        );
      } else {
        await api.post("/api/employees", data);
      }

      closeModal();

      await loadEmployees();
    } catch (error) {
      console.error("Employee save error:", error);

      const message =
        error.response?.data?.error ||
        "Unable to save employee.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Edit Employee
  // =========================

  const editEmployee = async (employee) => {
    try {
      setEditing(true);

      setForm({
        employee_id: employee.employee_id,
        employee_name: employee.employee_name || "",
        email: employee.email || "",
        department: employee.department || "",
        branch: employee.branch || "",
        status: employee.status || "ACTIVE",
        joined_at: employee.joined_at
          ? employee.joined_at.substring(0, 10)
          : "",
      });

      setShowModal(true);
    } catch (error) {
      console.error("Edit employee error:", error);
    }
  };

  // =========================
  // Change Employee Status
  // =========================

  const changeStatus = async (employee) => {
    const newStatus =
      employee.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    const confirmed = window.confirm(
      `Change ${employee.employee_name}'s status to ${newStatus}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.patch(
        `/api/employees/${employee.employee_id}/status`
      );

      await loadEmployees();
    } catch (error) {
      console.error("Status update error:", error);

      const message =
        error.response?.data?.error ||
        "Unable to update employee status.";

      alert(message);
    }
  };

  // =========================
  // Filters
  // =========================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const uniqueDepartments = [
    ...new Set(
      employees
        .map((employee) => employee.department)
        .filter(Boolean)
    ),
  ];

  const uniqueBranches = [
    ...new Set(
      employees
        .map((employee) => employee.branch)
        .filter(Boolean)
    ),
  ];

  const filteredEmployees = employees.filter((employee) => {
    return (
      (!filters.status ||
        employee.status === filters.status) &&
      (!filters.department ||
        employee.department === filters.department) &&
      (!filters.branch ||
        employee.branch === filters.branch)
    );
  });

  // =========================
  // UI
  // =========================

  return (
    <div>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p>Manage employees and their status</p>
        </div>

        <button
          className="primary-button"
          onClick={openAddModal}
        >
          + Add Employee
        </button>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="filter-bar">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">
            All Employee Status
          </option>

          <option value="ACTIVE">
            ACTIVE
          </option>

          <option value="INACTIVE">
            INACTIVE
          </option>
        </select>

        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
        >
          <option value="">
            All Department
          </option>

          {uniqueDepartments.map((department) => (
            <option
              key={department}
              value={department}
            >
              {department}
            </option>
          ))}
        </select>

        <select
          name="branch"
          value={filters.branch}
          onChange={handleFilterChange}
        >
          <option value="">
            All Branch
          </option>

          {uniqueBranches.map((branch) => (
            <option
              key={branch}
              value={branch}
            >
              {branch}
            </option>
          ))}
        </select>
      </div>

      {/* =========================
          EMPLOYEE TABLE
      ========================= */}

      <div className="table-panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Branch</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && employees.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="empty-cell"
                  >
                    Loading employees...
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.employee_id}
                  >
                    <td>
                      {employee.employee_id}
                    </td>

                    <td>
                      {employee.employee_name}
                    </td>

                    <td>
                      {employee.email}
                    </td>

                    <td>
                      {employee.department || "-"}
                    </td>

                    <td>
                      {employee.branch || "-"}
                    </td>

                    <td>
                      {employee.joined_at
                        ? new Date(
                            employee.joined_at
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          employee.status ===
                          "ACTIVE"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() =>
                            editEmployee(employee)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="status-button"
                          onClick={() =>
                            changeStatus(employee)
                          }
                        >
                          Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!loading &&
                filteredEmployees.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="empty-cell"
                    >
                      No employees found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          ADD / EDIT MODAL
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
          <div className="modal-container employee-modal">
            {/* Modal Header */}

            <div className="modal-header">
              <div>
                <h2>
                  {editing
                    ? "Edit Employee"
                    : "Add Employee"}
                </h2>

                <p>
                  {editing
                    ? "Update employee information"
                    : "Add a new employee"}
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

            {/* Modal Form */}

            <form onSubmit={saveEmployee}>
              <div className="form-grid">
                {/* Employee Name */}

                <div>
                  <label>
                    Employee Name
                  </label>

                  <input
                    type="text"
                    name="employee_name"
                    value={form.employee_name}
                    onChange={handleChange}
                    placeholder="Enter employee name"
                    required
                  />
                </div>

                {/* Email */}

                <div>
                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                {/* Department */}

                <div>
                  <label>
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Enter department"
                  />
                </div>

                {/* Branch */}

                <div>
                  <label>
                    Branch
                  </label>

                  <input
                    type="text"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    placeholder="Enter branch"
                  />
                </div>

                {/* Status */}

                <div>
                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">
                      ACTIVE
                    </option>

                    <option value="INACTIVE">
                      INACTIVE
                    </option>
                  </select>
                </div>

                {/* Joining Date */}

                <div>
                  <label>
                    Joining Date
                  </label>

                  <input
                    type="date"
                    name="joined_at"
                    value={form.joined_at}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Modal Footer */}

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
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editing
                    ? "Update Employee"
                    : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;