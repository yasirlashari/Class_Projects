import { useState } from "react";


function Assignment(){
    const[count, setCount] = useState(0);

    const resetCount = () => {
   setCount(0);
    };
 
    return(
    <>
<h1>{count}</h1>

<button onClick={() => setCount (count + 1) }>
    Increase</button>

<button 
          onClick={()=> {
            if (count > 0){
                setCount(count - 1) 
            } else{
                alert("Niche allow nhi he")
            }
          }}
          >
Decrease
</button>

<button onClick={resetCount}>
Reset
</button>

    </>
)}


export default Assignment