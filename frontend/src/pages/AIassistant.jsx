import { useState } from "react";
import api from "../services/api";

function AIAssistant() {
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const executeCommand = async () => {
    if (!command.trim()) {
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const aiResponse = await api.post(
        "/api/ai/execute",
        {
          text: command,
        }
      );

      setResponse(aiResponse.data);
    } catch (error) {
      console.error(error);

      setResponse({
        success: false,
        error: "Unable to communicate with AI service.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>AI Assistant</h1>
          <p>
            Manage your assets using natural language
          </p>
        </div>
      </div>

      <div className="ai-container">
        <div className="ai-header">
          <div className="ai-large-icon">🤖</div>

          <div>
            <h2>AssetAI Assistant</h2>
            <p>
              Ask the assistant to manage employees,
              assets, categories and issues.
            </p>
          </div>
        </div>

        <div className="example-commands">
          <span>Try:</span>

          <button
            onClick={() =>
              setCommand("List all employees")
            }
          >
            List all employees
          </button>

          <button
            onClick={() =>
              setCommand("List all assets")
            }
          >
            List all assets
          </button>

          <button
            onClick={() =>
              setCommand("Show available assets")
            }
          >
            Show available assets
          </button>

          <button
            onClick={() =>
              setCommand("List all categories")
            }
          >
            List categories
          </button>
        </div>

        <div className="ai-input">
          <textarea
            value={command}
            onChange={(e) =>
              setCommand(e.target.value)
            }
            placeholder="Ask something like: List all available assets..."
            rows="4"
          />

          <button
            className="primary-button"
            onClick={executeCommand}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "Execute Command →"}
          </button>
        </div>

        {response && (
          <div className="ai-response">
            <div className="response-header">
              <h3>AI Response</h3>

              <span
                className={
                  response.success
                    ? "status-active"
                    : "status-inactive"
                }
              >
                {response.success
                  ? "SUCCESS"
                  : "ERROR"}
              </span>
            </div>

            <pre>
              {JSON.stringify(
                response,
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIAssistant;