import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#1e2a4a",
        color: "#fff",
        textAlign: "center",
        padding: "14px 0",
        marginTop: "30px",
        borderTop: "3px solid #00b4d8",
      }}
    >
      <p>© {new Date().getFullYear()} iReporter | Built with ❤️ for transparency</p>
    </footer>
  );
};

export default Footer;
