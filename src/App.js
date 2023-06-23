import React, { useEffect, useState } from "react";
import FileSendingForm from "./components/Filesendingform";
import Gallery from "./components/Gallery";
// import Navbar from "./components/Navbar";
function App() {

  return (
    <div className="App">
      {/* <Navbar /> */}
      <FileSendingForm />
      <Gallery />
    </div>
  );
}

export default App;
