import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__label">AI Workspace</div>
      <h1 className="header-title">Chat Companion</h1>
      <p className="header-subtitle">
        PDF <span>•</span> Link <span>•</span> Text <span>•</span> RAG
      </p>
    </header>
  );
}

export default Header;
