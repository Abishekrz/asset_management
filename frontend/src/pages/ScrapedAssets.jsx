import { useEffect, useState } from "react";
import api from "../services/api";

function ScrapedAssets() {
  const emptyForm = {
    asset_id: "",
    scrape_date: "",
    reason: "",
  };

  const [scrapes, setScrapes] = useState([]);
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
        scrapeResponse,
        assetResponse,
      ] = await Promise.all([
        api.get("/api/scrapes"),
        api.get("/api/assets"),
      ]);

      if (scrapeResponse.data.success) {
        setScrapes(scrapeResponse.data.data);
      }

      if (assetResponse.data.success) {
        setAssets(assetResponse.data.data);
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

  const openAddModal = () => {
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
  // Save Scrape
  // =========================

  const saveScrape = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/api/scrapes", form);

      closeModal();
      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Unable to save scrape information"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Delete Scrape
  // =========================

  const deleteScrape = async (id) => {
    if (
      !window.confirm(
        "Delete this scrape information?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/api/scrapes/${id}`);
      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Unable to delete scrape information"
      );
    }
  };

  // =========================
  // Available Assets
  // =========================

  const availableAssets = assets.filter(
    (asset) => asset.status !== "SCRAPPED"
  );

  return (
    <div>
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Scraped Assets</h1>

          <p>
            Track assets removed from active inventory
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddModal}
        >
          + Add Scrape
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
                <th>Scrape ID</th>
                <th>Asset</th>
                <th>Scrape Date</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {scrapes.map((scrape) => (
                <tr key={scrape.scrape_id}>
                  <td>{scrape.scrape_id}</td>

                  <td>
                    {scrape.Asset?.asset_name ||
                      scrape.asset_name ||
                      "-"}
                  </td>

                  <td>{scrape.scrape_date}</td>

                  <td>
                    {scrape.reason || "-"}
                  </td>

                  <td>
                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteScrape(
                          scrape.scrape_id
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!scrapes.length && (
                <tr>
                  <td
                    colSpan="5"
                    className="empty-cell"
                  >
                    No scraped assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          ADD SCRAPE MODAL
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
          <div className="modal-container scrape-modal">
            <div className="modal-header">
              <div>
                <h2>Add Scrape Details</h2>

                <p>
                  Record an asset removed from active
                  inventory
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

            <form onSubmit={saveScrape}>
              <div className="form-grid">
                {/* Asset */}

                <div className="form-full-width">
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
                      No available assets to scrape.
                    </small>
                  )}
                </div>

                {/* Scrape Date */}

                <div>
                  <label>Scrape Date</label>

                  <input
                    type="date"
                    name="scrape_date"
                    value={form.scrape_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Reason */}

                <div className="form-full-width">
                  <label>Reason</label>

                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Enter reason for scraping this asset"
                    required
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
                    ? "Saving..."
                    : "Save Scrape"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScrapedAssets;