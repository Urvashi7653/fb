import AdminPassword from "./AdminPassword";
import axios from "axios";
import { checkPost } from "../../functions/post"
import { useEffect, useState, useReducer } from "react";
import "./style.css"

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

  useEffect(() => {
    getStats();
  }, []);

  const [{ stats }, dispatchStats] = useReducer(getStatsReducer, {
    stats: [],
  });
  const data = Object.values(stats)

  useEffect(() => {
    getAdminPosts()
  }, [adminPosts]);

  const [visible, setVisible] = useState(0);
  return (
    <div className="admin">
      {visible === 0 && (<AdminPassword visible={visible} setVisible={setVisible} />)}
      {visible === 1 ? (<><nav class="navbar">
        <div class="navbar-container container">
          <ul class="menu-items">
            <li><a href="#">Log Out</a></li>
          </ul>
          <h1 class="logo">Admin</h1>
        </div>
      </nav>
        <div class="row">
          <div class="col-md-6 col-xl-4">
            <div class="card mb-3 widget-content bg-midnight-bloom">
              <div class="widget-content-wrapper text-white">
                <div class="widget-content-left">
                  <div class="widget-heading">Total Orders</div>
                  <div class="widget-subheading">Last year expenses</div>
                </div>
                <div class="widget-content-right">
                  <div class="widget-numbers text-white"><span>1896</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xl-4">
            <div class="card mb-3 widget-content bg-arielle-smile">
              <div class="widget-content-wrapper text-white">
                <div class="widget-content-left">
                  <div class="widget-heading">Clients</div>
                  <div class="widget-subheading">Total Clients Profit</div>
                </div>
                <div class="widget-content-right">
                  <div class="widget-numbers text-white"><span>$ 568</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xl-4">
            <div class="card mb-3 widget-content bg-grow-early">
              <div class="widget-content-wrapper text-white">
                <div class="widget-content-left">
                  <div class="widget-heading">Followers</div>
                  <div class="widget-subheading">People Interested</div>
                </div>
                <div class="widget-content-right">
                  <div class="widget-numbers text-white"><span>46%</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="d-xl-none d-lg-block col-md-6 col-xl-4">
            <div class="card mb-3 widget-content bg-premium-dark">
              <div class="widget-content-wrapper text-white">
                <div class="widget-content-left">
                  <div class="widget-heading">Products Sold</div>
                  <div class="widget-subheading">Revenue streams</div>
                </div>
                <div class="widget-content-right">
                  <div class="widget-numbers text-warning"><span>$14M</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="cards-list">
          <h1 class="heading">Dashboard</h1>
          <div class="card 1">
            <div class="card_image" style={{ background: "#8FE3CF" }}></div>
            <div class="card_title title-white">
              <p>Number of users : {data[0]}</p>
            </div>
          </div>

          <div class="card 2">
            <div class="card_image" style={{ background: "#F37878" }}>
            </div>
            <div class="card_title title-white">
              <p>Number of posts : {data[1]}</p>
            </div>
          </div>

          <div class="card 3">
            <div class="card_image" style={{ background: "#F9F9C5" }}>
            </div>
            <div class="card_title">
              <p>Percentage Approval: {data[3]}%</p>
            </div>
          </div>

          <div class="card 4">
            <div class="card_image" style={{ background: "#D61C4E" }}>
            </div>
            <div class="card_title title-black">
              <p>Number of pending posts: {data[4]}</p>
            </div>
          </div>

        </div> </>) : ("")}

      {visible === 1 && adminPosts && adminPosts.length !== 0 ? (<>
        
        <div className="table-container">

          <table className="unfixed-table">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Text</th>
                <th scope="col">Images</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminPosts.map((post) => (<>
                <tr>
                  <td >{post.user.username}</td>
                  <td>{post.text ? (post.text) : ("null")}</td>
                  <td>{post.images === null ? ("null") : JSON.stringify(post.images)}</td>
                  <td>
                    <div className="post_action hover1" >
                      <button className=" accept_btn  open_signup" onClick={async () => await checkPost(post._id, true)}>Accept</button></div>

                    <div className="post_action hover1">
                      <button className="reject_btn  open_signup" style={{ background: "red" }} onClick={async () => await checkPost(post._id, false)} >Reject</button>
                    </div>
                  </td>
                </tr>
              </>))}</tbody></table></div></>) : ("")}
      {visible === 1 && adminPosts.length === 0 ? (<h1>No posts</h1>) : ("")}


















    </div>
  )
}



















//         <div>
//           {adminPosts && adminPosts.length !== 0 ? (<>
//             <table class="table table-striped">
//               <thead>
//                 <tr>
//                   <th scope="col">Username</th>
//                   <th scope="col">Text</th>
//                   <th scope="col">Images</th>
//                   <th scope="col">Actions</th>
//                 </tr>
//               </thead>
//             </table>
//           </>) : (<div><h1>No posts</h1></div>)}
//           {adminPosts && adminPosts.length !== 0 ?
//             (
//               (adminPosts.map((post) => (<>
//                 <table class="table table-striped">
//                   <tbody>
//                     <tr>
//                       <td>{post.user.username}</td>
//                       <td>{post.text ? (post.text) : ("null")}</td>
//                       {console.log("###################", post.images)}
//                       {/* <td>{ post.images=== null ? ("null"):(post.images) }</td>   */}
//                       <td>
//                         <div className="post_action hover1" >
//                           <button className=" accept_btn  open_signup" onClick={approvePost(post._id)}>Accept</button>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="post_action hover1">
//                           <button className="reject_btn  open_signup" style={{ background: "red" }} onClick={rejectPost(post._id)}>Reject</button>
//                         </div>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </>
//               )))
//             ) : (<div>
//             </div>)}
//           <div>
//             <p>Number of users : {data[0]}</p>
//             <p>Number of posts : {data[1]}</p>
//             <p>Percentage Approval: {data[3]}%</p>
//             <p>Number of pending posts: {data[4]}</p>
//           </div>
//           <div className=" home_middle">
//             <div className="posts" style={{ marginTop: "100px" }}>
//             </div>
//           </div>
//         </div>)}
//     </div>
//   );
// }

