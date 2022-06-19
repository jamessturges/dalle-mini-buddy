import { FunctionComponent } from 'react';
import { ImageSet as ImageSetType } from './imageSets';

interface ImageSetProps {
  imageSet: ImageSetType;
}

export const ImageSet: FunctionComponent<ImageSetProps> = ({ imageSet }) => {

  return (
    <div className="Images">
      {imageSet.data.map((imageData, index) => {
        return (<img key={index}
          className="Image"
          alt={imageSet.decode}
          src={"data:image/png;base64, " + imageData} />);
      })}
    </div>
  );
};
