import React, { useState } from "react"

import "src/components/button.css"

function IndexSidePanel() {
  const [data, setData] = useState("")
  const [result, setResult] = useState(null)
  const MODEL_ENDPOINT = "http://127.0.0.1:5000/analyze" // model is hosted locally

  async function handleSubmit() {
    // var currURL = "";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currURL = tabs[0].url;
      fetchBackend(currURL);
    });
  }

  async function fetchBackend(URL) {
    try {
      const analysisResponse = await fetch(MODEL_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: data,
          currURL: URL
        })
      })

      analysisResponse.json().then((data) => {
        Object.values(data).forEach((value) => {
          alert(value)
          setResult(value)
        })
      })
    } catch (err) {
      alert(err)
      alert(err.stack)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        height: "100vh",
        backgroundColor: "#f5f5f5"
      }}>
      <h2 style={{ marginBottom: 16, textAlign: "center" }}>
        Misinformation Detector
      </h2>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%"
        }}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}>
        <input
          type="text"
          onChange={(e) => setData(e.target.value)}
          value={data}
          style={{
            marginBottom: 16,
            padding: 8,
            width: "100%",
            maxWidth: 300,
            fontSize: 16,
            boxSizing: "border-box"
          }}
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      {result && ( // Display the result if it exists
        <div
          style={{
            marginTop: 16,
            padding: 16,
            backgroundColor: "#fff",
            borderRadius: 4,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            maxWidth: 300,
            width: "100%",
            textAlign: "center"
          }}>
          <h3>Analysis Result</h3>
          <p>Most Likely {result}</p>
        </div>
      )}
    </div>
  )
}

export default IndexSidePanel
