import "./App.css";
import { useEffect, useState, type ChangeEvent } from "react";
import Papa from "papaparse";
import allWords from "./wordfiles/unigram_freq.csv?raw";
import top_100k_words from "./wordfiles/top_100k_words.csv?raw";
import top_10k_words from "./wordfiles/top_10k_words.csv?raw";

type WordCount = {
  word: string;
  count: string;
};

function App() {
  const [currentWordlist, setCurrentWordlist] = useState<string>(allWords);
  const wordlist = Papa.parse(currentWordlist, { header: true })
    .data as WordCount[];

  const [input, setInput] = useState<string>("");
  const [slider, setSlider] = useState<number>(3);

  const [predictedWords, setPredictedWords] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [wordCount, setWordCount] = useState<string[]>([]);

  function updatePredictedWords(sliderValue: number, currentInput: string) {
    // Filter words starting with input
    const filtered = wordlist.filter((row) =>
      row.word.toLowerCase().startsWith(currentInput)
    );

    const topCounts = filtered.slice(0, sliderValue).map((row) => row.count);
    setWordCount(topCounts);

    const sum = filtered.reduce((acc, row) => acc + Number(row.count || 0), 0);
    setTotal(sum);

    // Sort by count and take top words based on slider value
    const topWords = filtered
      .sort((a, b) => Number(b.count || 0) - Number(a.count || 0))
      .slice(0, sliderValue)
      .map((row) => row.word);

    setPredictedWords(topWords);
  }

  function updateSlider(e: ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);
    setSlider(value);
    if (input === "") {
      setPredictedWords([]);
      return;
    }
    updatePredictedWords(value, input);
  }

  function updateInput(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toLowerCase();
    setInput(value);
    if (value === "") {
      setPredictedWords([]);
      return;
    }
    updatePredictedWords(slider, value);
  }

  function updateWordlist(wordlist: string) {
    setCurrentWordlist(() => wordlist);
    updatePredictedWords(slider, input);
  }

  useEffect(() => {
    if (input) {
      updatePredictedWords(slider, input);
    }
  }, [currentWordlist]);

  return (
    <>
      <div className="body">
        <div className="buttons">
          Load different wordlists
          <button onClick={() => updateWordlist(allWords)}>333k</button>
          <button onClick={() => updateWordlist(top_100k_words)}>100k</button>
          <button onClick={() => updateWordlist(top_10k_words)}>10k</button>
        </div>
        <div className="predictedwords">
          <input
            className="slider"
            type="range"
            min={1}
            max={10}
            value={slider}
            onChange={updateSlider}
          ></input>
          {predictedWords
            ? predictedWords.map((word, index) => (
                <div key={index}>
                  {word}{" "}
                  {(((wordCount[index] as any) / total) * 100).toFixed(2) + "%"}
                </div>
              ))
            : null}
        </div>

        <input
          className="input"
          placeholder="Type something"
          onChange={updateInput}
          value={input}
        />
      </div>
    </>
  );
}

export default App;
