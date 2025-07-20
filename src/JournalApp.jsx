import { useState, useEffect } from "react";

export default function JournalApp() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [entries, setEntries] = useState([]);
  const [memories, setMemories] = useState([]);
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "https://timemachine-production-xxxx.up.railway.app";

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/entries`);
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/memory-options`);
      const data = await res.json();
      setMemories(data.memories);
    } catch (error) {
      console.error("Error fetching memories:", error);
    } finally {
      setLoading(false);
    }
  };

  const postEntry = async () => {
    if (!text.trim()) return;
    
    try {
      setLoading(true);
      await fetch(`${API_BASE_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mood }),
      });
      setText("");
      setMood("");
      fetchEntries();
    } catch (error) {
      console.error("Error posting entry:", error);
    } finally {
      setLoading(false);
    }
  };

  const reflectOnMemory = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/reflect-memory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memory_id: id }),
      });
      const data = await res.json();
      setReflection(data.reflection);
    } catch (error) {
      console.error("Error reflecting on memory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        📝 Mementote - Your AI Journaling Assistant
      </h1>

      {/* New Entry Form */}
      <div style={{ 
        border: "1px solid #ddd", 
        borderRadius: "8px", 
        padding: "20px", 
        marginBottom: "30px",
        backgroundColor: "#f9f9f9"
      }}>
        <h2 style={{ marginTop: 0, color: "#555" }}>New Journal Entry</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind today?"
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "10px",
            fontFamily: "inherit"
          }}
        />
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Mood (optional)"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "10px"
          }}
        />
        <button 
          onClick={postEntry}
          disabled={loading || !text.trim()}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: loading || !text.trim() ? "not-allowed" : "pointer",
            opacity: loading || !text.trim() ? 0.6 : 1
          }}
        >
          {loading ? "Saving..." : "Save Entry"}
        </button>
      </div>

      {/* Past Entries */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#555" }}>Past Entries</h2>
        {entries.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>No entries yet. Write your first journal entry above!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: "white"
            }}>
              <p style={{ fontSize: "12px", color: "#666", margin: "0 0 10px 0" }}>
                {new Date(entry.date).toLocaleString()}
              </p>
              <p style={{ margin: "0 0 10px 0", whiteSpace: "pre-wrap" }}>{entry.text}</p>
              {entry.mood && (
                <p style={{ margin: 0, fontStyle: "italic", color: "#007bff" }}>
                  Mood: {entry.mood}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Memory Reflection */}
      {entries.length >= 3 && (
        <div>
          <button 
            onClick={fetchMemories}
            disabled={loading}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "20px",
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? "Loading..." : "Reflect on a Past Memory"}
          </button>
          
          {memories.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ color: "#555" }}>Choose a Memory to Reflect On:</h3>
              {memories.map((mem) => (
                <div 
                  key={mem.id} 
                  onClick={() => reflectOnMemory(mem.id)}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "15px",
                    marginBottom: "10px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#f0f0f0"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "white"}
                >
                  <p style={{ fontSize: "12px", color: "#666", margin: "0 0 5px 0" }}>
                    {new Date(mem.date).toLocaleString()}
                  </p>
                  <p style={{ margin: 0 }}>{mem.summary}</p>
                </div>
              ))}
            </div>
          )}

          {reflection && (
            <div style={{
              border: "1px solid #28a745",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#d4edda",
              marginTop: "20px"
            }}>
              <h3 style={{ marginTop: 0, color: "#155724" }}>🤖 Mementote's Reflection</h3>
              <p style={{ margin: 0, color: "#155724", lineHeight: "1.6" }}>{reflection}</p>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}