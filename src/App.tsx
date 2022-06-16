import React, { useEffect } from 'react';
import { useState } from 'react';
import spinner from './spinner.svg'
import './App.css';
import { useDallEMini } from './use-dall-e-mini';
import useCollapse from 'react-collapsed';
import { FunctionComponent} from 'react';


type ImageSet = {
  created: Date,
  decode: string,
  data: string[]
}

function App() {

  const [prompt, setPrompt] = useState("");
  const [getDallEMiniImages, imageStrings, loading, attempts] = useDallEMini();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [imageSets, setImageSets] = useState<ImageSet[]>([]);

  useEffect(() => {
    const id = setInterval(() => setElapsedSeconds((elapsedSeconds) => elapsedSeconds + 1), 1000);
    return () => {
      clearInterval(id);
    };

  }, []);

  useEffect(() => {
    if(imageStrings.length > 0) {

      const imageSet: ImageSet = {created: new Date(), decode: prompt, data: imageStrings}
      imageSets.push(imageSet);

      localStorage.setItem("ImageSetList", JSON.stringify(imageSets));
    }
  }, [imageStrings])


  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {

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
          <button onClick={handleSubmit} disabled={loading || prompt === ""}>Generate</button>
        </form>

        {loading?
        <>
          <img src={spinner} alt="Loading ..." />
          <br />
          Attempts: {attempts}<br />
          Elapsed Time: {fmtMSS(elapsedSeconds)}
        </> 
        : 
        <>
          {imageStrings.length > 0 &&
          <div className='Images' >
            {imageStrings.map((imageString, index) =>  <img key={index} className='Image' src={"data:image/png;base64, " + imageString} alt={index.toString()}/>)}
          </div>}

          <ImageSetList imageSets={imageSets} setImageSets={setImageSets} />
        </>}
      </div>

      <footer className='Footer'>
        <button onClick={handleClickDeleteImages}>Delete Saved Images</button><br/>
        <a href="https://huggingface.co/spaces/dalle-mini/dalle-mini" target="_blank" rel="noreferrer noopener">Original DALL-E mini website</a><br />
        If this is causing trouble, <a href="mailto:jamessturgesiii@gmail.com">email me</a>
      </footer>
    </div>
  );
}

//https://stackoverflow.com/a/37770048
function fmtMSS(s: number){return(s-(s%=60))/60+(9<s?':':':0')+s};

interface ImageSetContainerProps {
  imageSet: ImageSet
};

const ImageSetContainer: FunctionComponent<ImageSetContainerProps> = ({imageSet}) => {
  const {getCollapseProps, getToggleProps, isExpanded} = useCollapse()

  return (
    <div key={imageSet.created.toString()} className="ImageSetContainer" {...getToggleProps()}>
      <div className="ImageSetContainerLabel">
        {imageSet.decode} 
      </div>

      <div {...getCollapseProps()} >
        <div className='Images'>
          {imageSet.data.map((imageData, index) => {
            return(<img key={index} 
                        className="Image" 
                        alt={imageSet.decode} 
                        src={"data:image/png;base64, " + imageData}/>)
          })}
        </div>
      </div>
    </div>
  );
};

interface ImageSetListProps {
    imageSets: ImageSet[],
    setImageSets: React.Dispatch<React.SetStateAction<ImageSet[]>>
};

const ImageSetList: FunctionComponent<ImageSetListProps> = ({imageSets, setImageSets}) => {

  useEffect(() => {
    let imageSetListData = localStorage.getItem("ImageSetList");
    if(imageSetListData) {
      const imageSets = JSON.parse(imageSetListData);
      removeOldData(imageSets);
      setImageSets(imageSets);
    }

  }, [])

  return (
    <div>
      {imageSets && imageSets.sort((a, b) => a.created > b.created ? -1 : 1)
                              .map(imageSet => <ImageSetContainer imageSet={imageSet} />)}
    </div>
  )

      };

  const removeOldData = (imageSetList: ImageSet[]) => {
    if(imageSetList.some(imageSet => imageSet.hasOwnProperty("id"))) {
      localStorage.removeItem("ImageSetList");
    }
  }

export default App;
