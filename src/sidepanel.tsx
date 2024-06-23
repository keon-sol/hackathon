import { useState } from "react"

function IndexSidePanel() {
  const [data, setData] = useState("")
  const MODEL_ENDPOINT = "http://127.0.0.1:5000/analyze" // model is hosted locally

  async function handleSubmit() {
    alert(data)

    try {
      const analysisResponse = await fetch(MODEL_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: data
        })
      })

      const analysisResult = await analysisResponse
        .json()
        .then(function (json) {
          alert(json)
        })
      //alert(analysisResult.result)
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
        padding: 16
      }}>
      <h2>
        Welcome to your
        <a
          href="https://www.plasmo.com"
          target="_blank"
          rel="noopener noreferrer">
          {" "}
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}>
        <input
          type="text"
          onChange={(e) => setData(e.target.value)}
          value={data}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default IndexSidePanel
