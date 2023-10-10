import { useState } from "preact/hooks";

export default function LoginForm() { 
  const [state, setState] = useState({});

  const handleChange = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  }

  const doLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({...state}),
      })
      const data = await response.json();
      if(data.error) {
        alert(`${data.error} : Make sure you have a correct email and password`);
      } else {
        localStorage.setItem("token", data.data.token);
        alert("Successfully logged in!");
      }
    } catch (error) { 
      console.log(error);
      alert("Something went wrong!");
    }
  }

  const inputStyle = `p-4 border-2 border-purple-400 radius rounded-md flex w-9/12`;

  return (
    <div>
      <div class="pl-4 pt-4 mt-4">
        <input 
          onChange={handleChange} 
          type="email" 
          class={`${inputStyle}`} 
          placeholder="Email" 
          name="email"
        />
      </div>
      <div class="pl-4 pt-2 mt-1">
        <input 
          onChange={handleChange} 
          type="password" 
          class={`${inputStyle}`} 
          placeholder="Password" 
          name="password"
        />
      </div>
      <div class="pl-4 pt-2 mt-1">
        <button 
          onClick={doLogin} 
          class="rounded-md mt-3 border-transparent bg-purple-200 px-4 py-2"
        >
          Signin
        </button>
      </div>
    </div>
  )
}