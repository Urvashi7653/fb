import AdminPassword from "./AdminPassword";
import Post from "../../components/post";
import axios from "axios";
import { useEffect, useState, useReducer } from "react";

export default function Admin() {
  const adminPostsReducer = (state, action) => {
    switch (action.type) {
      case "POSTS_SUCCESS":
        return {
          adminPosts: action.payload,
        };
      case "POSTS_ERROR":
        return { error: action.payload };

      default:
        return state;
    }
  }

  useEffect(() => {
    getAdminPosts();
  }, []);

  const [{ adminPosts }, dispatchAdminPosts] = useReducer(adminPostsReducer, {
    adminPosts: [],
  });

  const getAdminPosts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getAdminPosts`,
        {}
      );
      console.log(data);
      dispatchAdminPosts({
        type: "POSTS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatchAdminPosts({
        type: "POSTS_ERROR",
        payload: error,
      });
    }
  };

  const [visible, setVisible] = useState(0);
  return (
<div>
  {visible === 0 && (<AdminPassword visible={visible} setVisible={setVisible} />)} 
  {visible === 1 && (<div>
    <div className="home home_middle">
      <div className="posts">
        {adminPosts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  </div>)} 
  </div>   
  );
}

