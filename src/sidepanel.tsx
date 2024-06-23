import React, { useState } from "react"
import axios, * as others from 'axios';
import cheerio from "cheerio";

import "src/components/button.css"

function IndexSidePanel() {
  const [data, setData] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [summary, setSummary] = useState(null)
  const MODEL_ENDPOINT = "http://127.0.0.1:5000/analyze" // model is hosted locally

  async function handleSubmit() {
    setLoading(true);
    setResult(null);
    setSummary(null);
    // var currURL = "";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currURL = tabs[0].url
      // fetchBackend(currURL)
      webScraping(currURL);
    })
  }

  async function webScraping(URL) {
      const {data} = await axios.get(URL);
      const $ = cheerio.load(data);
      const header1 = $('h1');
      const header2 = $('h1');
      const paragraphs = $('p');

      const paragraphTexts = [];
      paragraphs.each((index, element) => {
        paragraphTexts.push($(element).text().replace(/(\r\n|\n|\r)/gm, "").trim());
      })
      const header1Texts = [];
      header1.each((index, element) => {
        header1Texts.push($(element).text().replace(/(\r\n|\n|\r)/gm, "").trim());
      })
      const header2Texts = [];
      header2.each((index, element) => {
        header2Texts.push($(element).text().replace(/(\r\n|\n|\r)/gm, "").trim());
      })

      const combinedTextP = paragraphTexts.join(" ");
      const combinedTextH1 = header1Texts.join(" ");
      const combinedTextH2 = header2Texts.join(" ");
      const combinedText = combinedTextH1 + " " + combinedTextP + " " + combinedTextH2;

      fetchBackend(URL, combinedText);
  }

  async function fetchBackend(URL, combinedText) {
    try {
      const analysisResponse = await fetch(MODEL_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: combinedText,
          currURL: URL
        })
      })
      analysisResponse.json().then((data) => {
        Object.values(data).forEach((value) => {
          setSummary(data.summary)
          setResult(data.result)
        })
      })
    } catch (err) {
      alert(err)
      alert(err.stack)
    }
    setLoading(false);
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
        <button type="submit" className="submit-button">
          Analyze Webpage
        </button>
      </form>
      {isLoading ? (<p>Analyzing page content...</p>) : (<p></p>)}
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
          <h2>Likely {result}</h2>
          <p style={{textAlign:"left", fontSize:"0.85rem"}}>Learn more: <br></br><br></br>{summary}</p>
        </div>
      )}
    </div>
  )
}

export default IndexSidePanel
