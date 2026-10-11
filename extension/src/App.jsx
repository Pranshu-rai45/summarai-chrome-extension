import React, { useState } from "react";

import Header from "./component/Header";
import SourceSelector from "./component/SourceSelector";
import ProcessingStatus from "./component/ProcessingStatus";
import "./App.css";
import Chat from "./component/Chat";

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [lastSource, setLastSource] = useState(null);

  const handleProcess = (sourceData) => {
    console.log("Source Data:", sourceData);
    setLastSource(sourceData.type);
    setIsProcessing(true);
    setProcessed(false);

    setTimeout(() => {
      setIsProcessing(false);
      setProcessed(true);
    }, 3000);
  };

  return (
    <div className="App">
      <Header />

      <SourceSelector
        onProcess={handleProcess}
        isProcessing={isProcessing}
        lastSource={lastSource}
      />

      <ProcessingStatus
        isProcessing={isProcessing}
        processed={processed}
        lastSource={lastSource}
      />
      {processed && <Chat />}
    </div>
  );
}

export default App;



