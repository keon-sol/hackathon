import { useState } from "react"

function IndexSidePanel() {
  const [data, setData] = useState("")
  const MODEL_ENDPOINT = "http://127.0.0.1:5000/analyze"; // model is hosted locally

  function handleSubmit() {
    alert(data);
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
        <a href="https://www.plasmo.com" target="_blank">
          {" "}
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <form onSubmit={handleSubmit}>
        <input type = "text" onChange={(e) => setData(e.target.value)} value={data} />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default IndexSidePanel
