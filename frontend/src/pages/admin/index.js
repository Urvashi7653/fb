import AdminPassword from "./AdminPassword";
import axios from "axios";
import { checkPost } from "../../functions/post"
import { useEffect, useState, useReducer } from "react";
import "./style.css";
import LoginForm from "../../components/login/loginForm";

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
      //console.log(data);
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


  const getStats = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getStats`,
        {}
      );
      console.log(data);
      dispatchStats({
        type: "POSTS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatchStats({
        type: "POSTS_ERROR",
        payload: error,
      });
    }
  };

  const getStatsReducer = (state, action) => {
    switch (action.type) {
      case "POSTS_SUCCESS":
        return {
          stats: action.payload,
        };
      case "POSTS_ERROR":
        return { error: action.payload };

      default:
        return state;
    }
  }

  const [{ stats }, dispatchStats] = useReducer(getStatsReducer, {
    stats: [],
  });

  const data = Object.values(stats);

  useEffect(() => {
    getAdminPosts()
  }, [adminPosts]);


  useEffect(() => {
    getStats();
  }, []);

  useEffect(() => {
    getStats();
  }, [stats]);

  const [visible, setVisible] = useState(0);
  return (
    
     <div className="admin"> 
      {visible === 0 && (<AdminPassword visible={visible} setVisible={setVisible} />)}
      {visible === 1 ? (<><nav class="navbar">
        <div class="navbar-container container">
          <ul class="menu-items">
            <li><a href="http://localhost:3000/">Home</a></li>
            <li><a href="http://localhost:3000/admin">Log Out</a></li>
          </ul>
          <h1 class="logo">Admin</h1>
        </div>
      </nav>
        <div class="card-row">
          <div >
            <div class="card widget-content bg-midnight-bloom">
              <div class="widget-content-wrapper text-white">
                <div class="widget-content-left">
                  <div class="widget-heading">Users</div>
                  <div class="widget-subheading">Registered users</div>
                </div>
                <div class="widget-content-right">
                  <div class="widget-numbers text-white"><span>{data[0]}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div >
            <div class="card  widget-content bg-arielle-smile">
              <div class="widget-content-wrapper text-white">
                <div class="widget-content-left">
                  <div class="widget-heading">Posts</div>
                  <div class="widget-subheading">Number of posts </div>
                </div>
                <div class="widget-content-right">
                  <div class="widget-numbers text-white"><span>{data[1]}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div >
            <div class="card widget-content bg-grow-early">
              <div class="widget-content-wrapper text-white">
                <div class="widget-content-left">
                  <div class="widget-heading">Approval Rate</div>
                  <div class="widget-subheading">Genuine posts approved</div>
                </div>
                <div class="widget-content-right">
                  <div class="widget-numbers text-white"><span>{data[3]}%</span></div>
                </div>
              </div>
            </div>
          </div>
          <div >
            <div class="card widget-content bg-premium-dark">
              <div class="widget-content-wrapper text-white">
                <div class="widget-content-left">
                  <div class="widget-heading">Pending posts</div>
                  <div class="widget-subheading">Check in table below</div>
                </div>
                <div class="widget-content-right">
                  <div class="widget-numbers text-warning"><span>{data[4]}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </>) : ("")}

      {visible === 1 && adminPosts && adminPosts.length !== 0 ? (
        <div className="width">
          <div class="card-header">Pending posts
            <div class="btn-actions-pane-right">
            </div>
          </div>
          <div className="table-container table-responsive table-container">
            <table className="unfixed-table align-middle table table-borderless table-striped table-hover">
              <thead>
                <tr>
                  <th class="text-center">Username</th>
                  <th class="text-center">Text</th>
                  <th class="text-center">Images</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminPosts.map((post) => (<>
                  <tr>
                    <td>
                      <div class="widget-content p-0">
                        <div class="widget-content-wrapper">
                          <div class="widget-content-left mr-3">
                          </div>
                          <div class="widget-content-left flex2">
                            <div class="widget-heading">{post.user.username}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="text-center">{post.text ? (post.text) : ("null")}</td>
                    <td class="text-center">
                      <div>{post.images === null ? ("null") : (post.images.slice(0, 5).map((image, i) => (
                        <img src={image.url} key={i} className="image"/>)))
                      }</div>
                    </td>
                    <td class="text-center">
                      <div className="post_action hover1" >
                        <button type="button" id="PopoverCustomT-1" className="  btn btn-primary btn-sm " onClick={async () => await checkPost(post._id, true)}>Accept</button></div>

                      <div className="post_action hover1">
                        <button type="button" id="PopoverCustomT-1" className="  btn btn-primary btn-sm " style={{ background: "red" }} onClick={async () => await checkPost(post._id, false)} >Reject</button>
                      </div>
                    </td>
                  </tr>
                </>))}</tbody></table></div></div>) : ("")}
      {visible === 1 && adminPosts.length === 0 ? (<h1 className="noPosts">No pending posts!</h1>) : ("")}
    </div>
  )
}


