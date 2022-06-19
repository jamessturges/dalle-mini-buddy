import React, { useEffect } from 'react';
import { FunctionComponent } from 'react';
import { ImageSet as ImageSetType, getImageSetsFromStorage } from './imageSets';
import { CollapsableContainer } from './CollapsableContainer';
import { ImageSet } from "./ImageSet";

interface ImageSetListProps {
  imageSets: ImageSetType[];
  setImageSets: React.Dispatch<React.SetStateAction<ImageSetType[]>>;
}
;
export const ImageSetList: FunctionComponent<ImageSetListProps> = ({ imageSets, setImageSets }) => {

  useEffect(() => {
    const imageSets = getImageSetsFromStorage();
    if (imageSets) {
      setImageSets(imageSets);
    }

  }, []);

  return (
    <div>
      {imageSets && imageSets.sort((a, b) => a.created > b.created ? -1 : 1)
        .map(imageSet => <CollapsableContainer key={imageSet.created.toString()}
          decode={imageSet.decode}
          containerClassName="ImageSetContainer"
          decodeClassName="ImageSetContainerLabel">
          <ImageSet imageSet={imageSet} />
        </CollapsableContainer>)}
    </div>
  );

};
