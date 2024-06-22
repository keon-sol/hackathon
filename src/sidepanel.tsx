import React, { useState } from 'react';
import Groq from 'groq-sdk';

const groq = new Groq({apiKey: process.env.PLASMO_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true});

const IndexSidePanel = () => {
  const [data, setData] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const chatCompletion = await getGroqChatCompletion(data);
      setResponse(chatCompletion.choices[0]?.message?.content || "");
    } catch (err) {
      setError(err.message);
    }
  };

  const getGroqChatCompletion = async (messageContent) => {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: messageContent,
        },
      ],
      model: "llama3-8b-8192",
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 16 }}>
      <h2>
        Welcome to your{" "}
        <a href="https://www.plasmo.com" target="_blank" rel="noopener noreferrer">
          Plasmo
        </a>{" "}
        Extension!
      </h2>


      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setData(e.target.value)}
          value={data}
        />
        <button type="submit">Submit</button>
      </form>
      {response && <div>Response: {response}</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}



      <a href="https://docs.plasmo.com" target="_blank" rel="noopener noreferrer">
        View Docs
      </a>
    </div>
  );
};

export default IndexSidePanel;
