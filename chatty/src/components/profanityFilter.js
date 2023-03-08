import React, { useState, useEffect } from "react";
import axios from "axios";

var foundProfanity  = true;
function ProfanityFilter({ input, children }) {
  const [badWords, setBadWords] = useState([]);


  useEffect(() => {
    async function fetchBadWords() {
      try {
        const response = await axios.get(
          "https://docs.google.com/spreadsheets/d/1hIEi2YG3ydav1E06Bzf2mQbGZ12kh2fe4ISgLg_UBuM/export?format=csv"
        );
        const lines = response.data.split("\n");
        const newBadWords = lines.map((line) => line.split(",")[0]);
        setBadWords(newBadWords);
        console.log(`Loaded ${newBadWords.length} bad words to filter out`);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBadWords();
  }, []);

  function cussWordFound(input) {
    if (!input) {
      return false;
    }

    input = input
      .replace(/1/g, "i")
      .replace(/!/g, "i")
      .replace(/3/g, "e")
      .replace(/4/g, "a")
      .replace(/@/g, "a")
      .replace(/5/g, "s")
      .replace(/7/g, "t")
      .replace(/0/g, "o")
      .replace(/9/g, "g");

    const inputWords = input.toLowerCase().split(/[^a-zA-Z]/g);
    for (const inputWord of inputWords) {
      if (badWords.includes(inputWord)) {
        foundProfanity = true;
        console.log(`${inputWord} is a bad word`);
        return true;
      }
    }
    foundProfanity = false;
    console.log("Clean message.........")
    return false;
  }

  const hasBadWords = cussWordFound(input);

  if (hasBadWords) {
    return <>{children}</>;
  }
  return null;
}

export { foundProfanity } ;
export default ProfanityFilter;
