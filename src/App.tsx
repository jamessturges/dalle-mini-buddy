import React, { useEffect } from 'react';
import { useState } from 'react';
import spinner from './spinner.svg'
import './App.css';
import { useDallEMini } from './use-dall-e-mini';
import {ImageSet as ImageSetType, saveImageSetsToStorage} from './imageSets'
import { ImageSetList } from './ImageSetList';
import { ImageSet } from './ImageSet';

function App() {

  const [prompt, setPrompt] = useState("");
  const [getDallEMiniImages, imageStrings, loading, attempts] = useDallEMini();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [imageSets, setImageSets] = useState<ImageSetType[]>([]);

  // Elapsed Time effect
  useEffect(() => {
    
    const id = setInterval(() => setElapsedSeconds((elapsedSeconds) => elapsedSeconds + 1), 1000);
    return () => {
      clearInterval(id);
    };

    // only run once when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  // Effect to save imageStrings to the imageSets prop and local storage
  useEffect(() => {
    if(imageStrings.length > 0) {

      const imageSet: ImageSetType = {created: new Date(), decode: prompt, data: imageStrings}
      imageSets.push(imageSet);
      saveImageSetsToStorage(imageSets);
    }
  }, [imageStrings])


  const handleGenerate = (event: React.MouseEvent<HTMLButtonElement>) => {

    event.preventDefault();

    if(prompt !== "") {
      setElapsedSeconds(0);
      getDallEMiniImages(prompt);
    }
  }

  const handleClickDeleteImages = (event: React.MouseEvent<HTMLButtonElement>) => {

    event.preventDefault();

    if(window.confirm("Are you sure you want to delete your images?")) {
      localStorage.removeItem("ImageSetList");
      setImageSets([]);
    }
  }

  return (
    <div className="App">
      <header className="Header">
        <h1>DALL-E mini Buddy</h1>
        <h2>Auto-retries! No more traffic issues!</h2>
      </header>

      <div className="Body">
        <form className="Prompt">
          <input className="PromptBox" placeholder="Enter something cool" onChange={e => setPrompt(e.target.value)} />
          <button onClick={handleGenerate} disabled={loading || prompt === ""}>Generate</button>
        </form>

        {loading?
        <>
          <img src={spinner} alt="Loading ..." />
          <br />
          Attempts: {attempts}<br />
          Elapsed Time: {fmtMSS(elapsedSeconds)}
          {elapsedSeconds > 60 && <><br/>This may take a while ...<br/></>}
          {elapsedSeconds > 120 && <>Still running, I promise <br/></>}
          {elapsedSeconds > 180 && <>You're really patient!<br/></>}
          {elapsedSeconds > 240 && <>Loading loading loading<br/></>}
        </> 
        : 
        <>
          {imageStrings.length > 0 &&
          <ImageSet imageSet={{created: new Date(), decode: prompt, data: imageStrings} as ImageSetType}/>}
        </>}

        <ImageSetList imageSets={imageSets} setImageSets={setImageSets} />
      </div>

      <footer className='Footer'>
        <button onClick={handleClickDeleteImages}>Delete Saved Images</button><br/>
        <a href="https://huggingface.co/spaces/dalle-mini/dalle-mini" target="_blank" rel="noreferrer noopener">Original DALL-E mini website</a><br />
        If this is causing trouble, <a href="mailto:james@sturges.dev">email me</a><br/>
        <a href="https://github.com/jamessturges/dalle-mini-buddy" target="_blank" rel="noreferrer noopener">View on GitHub</a>
      </footer>
    </div>
  );
}

//https://stackoverflow.com/a/37770048
function fmtMSS(s: number){return(s-(s%=60))/60+(9<s?':':':0')+s};

export default App;
