import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import Stories from "../../components/home/stories";
import Story from "../../components/home/stories/Story";
import useClickOutside from "../../helpers/clickOutside";
import ActivateForm from "./ActivateForm";
import "./style.css"

export default function Activate() {
  const { user } = useSelector((user) => ({ ...user }));
  const [success,setSuccess] = useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(true);
  const token = useParams();
  console.log(token);

  return (
    <div>
      <div className="home">
        {success && (<ActivateForm
        type= "success" header = "Account verification succeeded" text= {success}
        loading= {loading}/>)}
        {error && (<ActivateForm
        type= "success" header = "Account verification failed" text= {error}
        loading= {loading}/>)}
        <Header />
        <LeftHome user={user} />
        <div className="home_middle">
          <Stories/>
          <CreatePost/>
          </div>
      </div>
    </div>
  );
}
