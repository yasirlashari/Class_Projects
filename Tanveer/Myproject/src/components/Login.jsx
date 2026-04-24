import React from "react";

function Login() {
  return (
    <section className="login">
      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button className="btn">Login</button>
      </form>
    </section>
  );
}

export default Login;
