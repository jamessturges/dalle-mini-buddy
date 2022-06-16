import { randomInt } from "crypto";
import { useState } from "react";

export function useDallEMini(): [(prompt: string) => void, string[], boolean, number] {

    const initialValue: string[] = [];
    const [imageStrings, setImageStrings] = useState(initialValue);
    const [loading, setLoading] =  useState(false);
    const [attempts, setAttempts] = useState(1);

    function sleep(ms: number) {

        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getDallEMiniImages (prompt: string) {

        setLoading(true);
        const repsonse = keepTrying(prompt);

        repsonse.then(imageStrings => setImageStrings(imageStrings));
      }

      async function keepTrying(prompt: string) {

        let keepTrying = true;
        let imageStrings: string[] = [];

        let tryingCount = 1;
        while (keepTrying) {
            const resultPromise = await getDallEMiniImagesFromAPI(prompt);
            if(resultPromise) {
                imageStrings = resultPromise;
                keepTrying = false;
            } 
            else {
                setAttempts(tryingCount);
                const waitTime = (5 + (Math.random() * 3)) * 1000; //random time between 5 and 8 seconds. Avoids 429 rerrors
                await sleep(waitTime);
            }

            tryingCount++;
        }
        
        return imageStrings;
      }


      async function getDallEMiniImagesFromAPI(prompt: string) {

        const url = "https://bf.dallemini.ai/generate"
    
        try {
            const response = await fetch(url, {
                                        method: "POST",
                                        headers: {
                                            'Access-Control-Allow-Origin' : '*',
                                            'Access-Control-Allow-Methods':'POST,OPTIONS',
                                            "User-Agent": "request",
                                            "Content-Type": "application/json"

                                        },
                                        body: JSON.stringify({
                                            "prompt": prompt
                                        })
                                });
            if(response.status === 200) {
                const responseJSON: any = await response.json();
                const imageStrings: string[] = responseJSON.images;
            
                setLoading(false);
                return imageStrings;
            }

        }
            catch (e) {
                //No need for a catch, sometimes the API errors
            }
      }

      return [getDallEMiniImages, imageStrings, loading, attempts];
}