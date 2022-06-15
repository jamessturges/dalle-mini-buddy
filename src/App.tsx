import React, { useEffect } from 'react';
import { useState } from 'react';
import spinner from './spinner.svg'
import './App.css';
import { useDallEMini } from './use-dall-e-mini';

function App() {

  const [prompt, setPrompt] = useState("");
  const [getDallEMiniImages, imageStrings, loading, attempts] = useDallEMini();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsedSeconds((elapsedSeconds) => elapsedSeconds + 1), 1000);
    return () => {
      clearInterval(id);
    };

  }, []);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {

    event.preventDefault();

    if(prompt !== "") {
      setElapsedSeconds(0);
      getDallEMiniImages(prompt);

    }
  }


  return (
    <div className="App">
      <header className="Header">
        <h1>DALL-E Mini Buddy</h1>
        <h2>Auto-retries! No more traffic issues!</h2>
      </header>

      <div className="Body">
        <form className="Prompt">
          <input placeholder="Enter something cool" onChange={e => setPrompt(e.target.value)} />
          <button onClick={handleSubmit} disabled={loading || prompt === ""}>Generate</button>
        </form>

        {loading && 
        <>
          <img src={spinner} alt="Loading ..." />
          <br />
          Attempts: {attempts}<br />
          Elapsed Time: {fmtMSS(elapsedSeconds)}
        </>}

        {imageStrings.length > 0 &&
        <div className='Images' >
          {imageStrings.map((imageString, index) =>  <img className='Image' src={"data:image/png;base64, " + imageString} alt={index.toString()}/>)}
        </div>}
      </div>

      <footer className='Footer'>
        <a href="https://huggingface.co/spaces/dalle-mini/dalle-mini" target="_blank" rel="noreferrer noopener">Original DALL-E Mini website</a><br />
        If this is causing trouble, <a href="mailto:jamessturgesiii@gmail.com">email me</a>
      </footer>
    </div>
  );
}

//https://stackoverflow.com/a/37770048
function fmtMSS(s: number){return(s-(s%=60))/60+(9<s?':':':0')+s}

export default App;
