import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import SendVerification from "../../components/home/sendVerification";
import Stories from "../../components/home/stories";
import Story from "../../components/home/stories/Story";
import useClickOutside from "../../helpers/clickOutside";
import "./style.css"

export default function Home() {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <div>
      <div className="home">
        <Header />
        <LeftHome user={user} />
        <div className="home_middle">
          <Stories/>
          {user.verified ===false && <SendVerification user = {user}/>}
          <CreatePost/>
          </div>
      </div>
    </div>
  );
}
