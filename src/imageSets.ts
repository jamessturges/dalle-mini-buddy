export type ImageSet = {
  created: Date,
  decode: string,
  data: string[]
}

export const getImageSetsFromStorage = (): ImageSet[] | undefined => {

  let imageSets: ImageSet[] | undefined;

  try {
    let imageSetsData = localStorage.getItem("ImageSetList");
    if (imageSetsData) {
      imageSets = JSON.parse(imageSetsData) as ImageSet[];
      removeOldData(imageSets);
    }
  } catch (e) {
    console.log(e);
  }

  return imageSets;
};

export const saveImageSetsToStorage = (imageSets: ImageSet[]) => {
  try {
    localStorage.setItem("ImageSetList", JSON.stringify(imageSets));
  } catch (e) {
    console.log(e);
  }
};

const removeOldData = (imageSetList: ImageSet[]) => {
  if(imageSetList.some(imageSet => imageSet.hasOwnProperty("id"))) {
    localStorage.removeItem("ImageSetList");
  }
}


