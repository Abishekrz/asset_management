import { useEffect, useState } from "react";
import api from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
    loadCategories();
  }, []);

  // =========================
  // Open Add Modal
  // =========================

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setShowModal(true);
  };

  // =========================
  // Close Modal
  // =========================

  const closeModal = () => {
    setEditingId(null);
    setName("");
    setShowModal(false);
  };

  // =========================
  // Save Category
  // =========================

  const saveCategory = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/api/categories/${editingId}`, {
          category_name: name.trim(),
        });
      } else {
        await api.post("/api/categories", {
          category_name: name.trim(),
        });
      }

      closeModal();
      await loadCategories();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Unable to save category"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Edit Category
  // =========================

  const editCategory = (category) => {
    setEditingId(category.category_id);
    setName(category.category_name);
    setShowModal(true);
  };

  // =========================
  // Delete Category
  // =========================

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    try {
      await api.delete(`/api/categories/${id}`);
      await loadCategories();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Unable to delete category"
      );
    }
  };

  return (
    <div>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Manage asset categories</p>
        </div>

        <button
          className="primary-button"
          onClick={openAddModal}
        >
          + Add Category
        </button>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="table-panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Category Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.category_id}>
                  <td>{category.category_id}</td>

                  <td>{category.category_name}</td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() =>
                          editCategory(category)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteCategory(
                            category.category_id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!categories.length && (
                <tr>
                  <td
                    colSpan="3"
                    className="empty-cell"
                  >
                    No categories found.
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
          <div className="modal-container category-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p>
                  {editingId
                    ? "Update category information"
                    : "Create a new asset category"}
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

            <form onSubmit={saveCategory}>
              <div>
                <label>Category Name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter category name"
                  required
                  autoFocus
                />
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
                    : editingId
                    ? "Update Category"
                    : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;