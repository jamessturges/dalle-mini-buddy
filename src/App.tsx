import React from 'react';
import { useState } from 'react';
import spinner from './spinner.svg'
import './App.css';
import { useDallEMini } from './use-dall-e-mini';

function App() {

  const [prompt, setPrompt] = useState("")
  const [getDallEMiniImages, imageStrings, loading, attempts] = useDallEMini()

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {

    event.preventDefault();

    if(prompt !== "") {
      getDallEMiniImages(prompt);
    }
  }


  return (
    <div className="App">
      <header className="Header">
        <h1>DALL-E Mini Buddy</h1>
        <h2>Auto-retries! No more traffic issues!</h2>
      </header>

      <body>
        <form className="Prompt">
          Enter a prompt:
          <input className="prompt" onChange={e => setPrompt(e.target.value)} />
          <button className="submit" onClick={handleSubmit} disabled={loading || prompt === ""}>Generate Images</button>
        </form>

        {loading && 
        <>
          <img src={spinner} alt="Loading ..." />
          <br />
          Attempts: {attempts}
        </>}

        {imageStrings.length > 0 &&
        <div className='Images' >
          {imageStrings.map((imageString, index) => <img src={"data:image/png;base64, " + imageString} alt={index.toString()}/>)}
        </div>}
      </body>

      <footer className='Footer'>
        <a href="https://huggingface.co/spaces/dalle-mini/dalle-mini" target="_blank" rel="noreferrer noopener">Original DALL-E Mini website</a><br />
        If this is causing trouble, <a href="mailto:jamessturgesiii@gmail.com">email me</a>
      </footer>
    </div>
  );
}

export default App;
