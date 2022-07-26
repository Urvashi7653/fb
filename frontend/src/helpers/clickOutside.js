import { useEffect } from "react";

export default function useClickOutside(ref, fun) {
    useEffect(() => {
        const listener = (e)=>{
            if(!ref.current || ref.current.contains(e.target)){
                return;
            }
            fun();
        };
        document.addEventListener("mousedown",listener);
        document.addEventListener("touchstart",listener);
//MouseDown occurs when the user presses the mouse button; MouseUp occurs when the user releases the mouse button.
//The touchstart event occurs when the user touches an element.Note: The touchstart event will only work on devices with a touch screen.
        return()=>{
            document.removeEventListener("mousedown",listener);
            document.removeEventListener("touchstart",listener);
        };
    }, [ref]) // ref is dependency
}