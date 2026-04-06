// React entry point — mounts the App component into the DOM
// React 入口文件 —— 将 App 组件挂载到 index.html 的 #root 元素
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
