import { useEffect, useState } from "react";
import api from "../services/api";

function Assets() {
  const emptyForm = {
    asset_id: "",
    asset_name: "",
    serial_number: "",
    make: "",
    model: "",
    purchase_date: "",
    purchase_price: "",
    status: "IN_STOCK",
    category_id: "",
    warranty: "YES",
  };

  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    make: "",
    model: "",
    category: "",
    warranty: "",
  });

  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // Load Assets
  // =========================

  const loadAssets = async () => {
    try {
      const response = await api.get("/api/assets");

      if (response.data.success) {
        setAssets(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // Load Categories
  // =========================

  const loadCategories = async () => {
    try {
      const response = await api.get("/api/categories");

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAssets();
    loadCategories();
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
  // Save Asset
  // =========================

  const saveAsset = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editing) {
        await api.put(
          `/api/assets/${form.asset_id}`,
          form
        );
      } else {
        await api.post("/api/assets", form);
      }

      closeModal();
      await loadAssets();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Unable to save asset"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Edit Asset
  // =========================

  const editAsset = (asset) => {
    setEditing(true);

    setForm({
      asset_id: asset.asset_id,
      asset_name: asset.asset_name || "",
      serial_number: asset.serial_number || "",
      make: asset.make || "",
      model: asset.model || "",
      purchase_date: asset.purchase_date
        ? String(asset.purchase_date).substring(0, 10)
        : "",
      purchase_price: asset.purchase_price || "",
      status: asset.status || "IN_STOCK",
      category_id: asset.category_id || "",
      warranty: asset.warranty || "YES",
    });

    setShowModal(true);
  };

  // =========================
  // Delete Asset
  // =========================

  const deleteAsset = async (id) => {
    if (!window.confirm("Delete this asset?")) {
      return;
    }

    try {
      await api.delete(`/api/assets/${id}`);
      await loadAssets();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Unable to delete asset"
      );
    }
  };

  // =========================
  // Filters
  // =========================

  const filteredAssets = assets.filter((asset) => {
    return (
      (!filters.status ||
        asset.status === filters.status) &&
      (!filters.make ||
        asset.make === filters.make) &&
      (!filters.model ||
        asset.model === filters.model) &&
      (!filters.category ||
        String(asset.category_id) ===
          String(filters.category)) &&
      (!filters.warranty ||
        asset.warranty === filters.warranty)
    );
  });

  const uniqueMakes = [
    ...new Set(
      assets.map((asset) => asset.make).filter(Boolean)
    ),
  ];

  const uniqueModels = [
    ...new Set(
      assets.map((asset) => asset.model).filter(Boolean)
    ),
  ];

  return (
    <div>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Assets</h1>
          <p>Manage company assets</p>
        </div>

        <button
          className="primary-button"
          onClick={openAddModal}
        >
          + Add Asset
        </button>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="filter-bar asset-filters">
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value,
            })
          }
        >
          <option value="">All Status</option>
          <option value="IN_STOCK">IN_STOCK</option>
          <option value="ISSUED">ISSUED</option>
          <option value="REPAIR">REPAIR</option>
          <option value="SCRAPPED">SCRAPPED</option>
        </select>

        <select
          value={filters.make}
          onChange={(e) =>
            setFilters({
              ...filters,
              make: e.target.value,
            })
          }
        >
          <option value="">All Make</option>

          {uniqueMakes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>

        <select
          value={filters.model}
          onChange={(e) =>
            setFilters({
              ...filters,
              model: e.target.value,
            })
          }
        >
          <option value="">All Model</option>

          {uniqueModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({
              ...filters,
              category: e.target.value,
            })
          }
        >
          <option value="">All Category</option>

          {categories.map((category) => (
            <option
              key={category.category_id}
              value={category.category_id}
            >
              {category.category_name}
            </option>
          ))}
        </select>

        <select
          value={filters.warranty}
          onChange={(e) =>
            setFilters({
              ...filters,
              warranty: e.target.value,
            })
          }
        >
          <option value="">All Warranty</option>
          <option value="YES">YES</option>
          <option value="NO">NO</option>
        </select>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="table-panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Asset</th>
                <th>Serial</th>
                <th>Make</th>
                <th>Model</th>
                <th>Purchase Date</th>
                <th>Price</th>
                <th>Status</th>
                <th>Category</th>
                <th>Warranty</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.asset_id}>
                  <td>{asset.asset_id}</td>
                  <td>{asset.asset_name}</td>
                  <td>{asset.serial_number}</td>
                  <td>{asset.make}</td>
                  <td>{asset.model}</td>
                  <td>{asset.purchase_date}</td>
                  <td>{asset.purchase_price}</td>

                  <td>
                    <span className="status-badge">
                      {asset.status}
                    </span>
                  </td>

                  <td>{asset.category_id}</td>
                  <td>{asset.warranty}</td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() =>
                          editAsset(asset)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteAsset(asset.asset_id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!filteredAssets.length && (
                <tr>
                  <td
                    colSpan="11"
                    className="empty-cell"
                  >
                    No assets found.
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
          <div className="modal-container asset-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editing
                    ? "Edit Asset"
                    : "Add Asset"}
                </h2>

                <p>
                  {editing
                    ? "Update asset information"
                    : "Add a new company asset"}
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

            <form onSubmit={saveAsset}>
              <div className="form-grid">
                <div>
                  <label>Asset Name</label>

                  <input
                    name="asset_name"
                    value={form.asset_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Serial Number</label>

                  <input
                    name="serial_number"
                    value={form.serial_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Make</label>

                  <input
                    name="make"
                    value={form.make}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Model</label>

                  <input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Purchase Date</label>

                  <input
                    type="date"
                    name="purchase_date"
                    value={form.purchase_date}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Purchase Price</label>

                  <input
                    type="number"
                    name="purchase_price"
                    value={form.purchase_price}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Warranty</label>

                  <select
                    name="warranty"
                    value={form.warranty}
                    onChange={handleChange}
                  >
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>

                <div>
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="IN_STOCK">
                      IN_STOCK
                    </option>
                    <option value="ISSUED">
                      ISSUED
                    </option>
                    <option value="REPAIR">
                      REPAIR
                    </option>
                    <option value="SCRAPPED">
                      SCRAPPED
                    </option>
                  </select>
                </div>

                <div>
                  <label>Category</label>

                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.category_name}
                      </option>
                    ))}
                  </select>
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
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editing
                    ? "Update Asset"
                    : "Save Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assets;