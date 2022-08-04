import { useParams } from "react-router-dom"
import "./style.css"
import { useSelector } from "react-redux";
import axios from "axios";
import { profileReducer } from "../../functions/reducers";
import { useEffect, useReducer, useRef } from "react";
import Header from "../../components/header";
import CreatePostPopup from "../../components/createPostPopup";
import ProfileMenu from "./ProfileMenu";
import ProfilePictureInfos from "./ProfilePictureInfo";
import Post from "../../components/post";
import CreatePost from "../../components/createPost";
import Cover from "./Cover";
export default function Profile({ setVisible, visible }) {
    const profileTop = useRef(null);
    const { user } = useSelector((state) => ({ ...state }));
    const { username } = useParams();
    const userName = username === undefined ? user.user : username;
    const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
        loading: false,
        profile: {},
        error: "",
    });

    useEffect(() => {
        getProfile();
    }, [userName]);

    const visitor = userName === user.user ? false : true;
    const getProfile = async () => {
        try {
            dispatch({
                type: "PROFILE_REQUEST",
            });
            const { data } = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/getProfile/${userName}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            dispatch({
                type: "PROFILE_SUCCESS",
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: "PROFILE_ERROR",
                payload: error.response.data.message,
            });
        }
    };

    return (
        <div className="profile">
            {visible && (<CreatePostPopup
                user={user}
                setVisible={setVisible}
                posts={profile?.posts}
                dispatch={dispatch}
                profile
            />
            )}
            <Header page="profile" />
            <div className="profile_top" ref={profileTop}>
                <div className="profile_container">
                    <Cover cover={profile.cover} visitor={visitor} />
                    <ProfilePictureInfos profile={profile} visitor={visitor} />
                    <ProfileMenu />
                </div>
            </div>
            <div className="profile_bottom">
                <div className="profile_container">
                    <div className="bottom_container">
                        <div className="profile_grid">
                            <div className="profile_left"></div>
                            <div className="profile_right">
                                {!visitor && <CreatePost user={user} setVisible={setVisible} />}
                                <div className="posts">
                                    {profile.posts && profile.posts.length? (
                                        profile.posts.map((post) => (
                                            <Post post={post} user={user} key={post._id} profile />
                                        ))
                                    ) : (
                                        <div className="no_posts">No posts available</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
































    //     return (
    //         <div className="profile">
    //             {visible && (
    //                 <CreatePostPopup
    //                     user={user}
    //                     setVisible={setVisible}
    //                     posts={profile?.posts}
    //                     dispatch={dispatch}
    //                     profile
    //                 />
    //             )}
    //             <Header page="profile"/>
    //             {/* <Header page="profile" getAllPosts={getAllPosts} /> */}
    //             <div className="profile_top" ref={profileTop}>
    //                 <div className="profile_container">
    //                     <Cover
    //                         cover={profile.cover}
    //                         // visitor={visitor}
    //                         // photos={photos.resources}
    //                     />
    //                     {<ProfilePictureInfos
    //                         profile={profile}
    //                         // visitor={visitor}
    //                         // photos={photos.resources}
    //                         // othername={othername}
    //                     /> }
    //                     <ProfileMenu />
    //                 </div>
    //             </div>
    //             <div className="profile_bottom">
    //                 <div className="profile_container">
    //                     <div className="bottom_container">
    //                         {/* <PplYouMayKnow /> */}
    //                         <div
    //                             className="profile_grid"
    //                         //      ${scrollHeight >= height && leftHeight > 1000
    //                         //             ? "scrollFixed showLess"
    //                         //             : check &&
    //                         //             scrollHeight >= height &&
    //                         //             leftHeight < 1000 &&
    //                         //             "scrollFixed showMore"
    //                         //         }`}
    //                          >
    //                             <div className="profile_left">
    //                             {/* <div className="profile_left" ref={leftSide}> */}
    //                                 {/* <Intro
    //                                     detailss={profile.details}
    //                                     visitor={visitor}
    //                                     setOthername={setOthername}
    //                                 />
    //                                 <Photos
    //                                     username={userName}
    //                                     token={user.token}
    //                                     photos={photos}
    //                                 />
    //                                 <Friends friends={profile.friends} /> */}
    //                                 <div className="relative_fb_copyright">
    //                                     <Link to="/">Privacy </Link>
    //                                     <span>. </span>
    //                                     <Link to="/">Terms </Link>
    //                                     <span>. </span>
    //                                     <Link to="/">Advertising </Link>
    //                                     <span>. </span>
    //                                     <Link to="/">
    //                                         Ad Choices <i className="ad_choices_icon"></i>{" "}
    //                                     </Link>
    //                                     <span>. </span>
    //                                     <Link to="/"></Link>Cookies <span>. </span>
    //                                     <Link to="/">More </Link>
    //                                     <span>. </span> <br />
    //                                     Meta © 2022
    //                                 </div>
    //                             </div>
    //                             <div className="profile_right">
    //                                 {/* {!visitor && (
    //                                     <CreatePost user={user} profile setVisible={setVisible} />
    //                                 )} */}
    //                                 {/* <GridPosts /> */}
    //                                 <div className="posts">
    //                                     {profile.posts && profile.posts.length ? (
    //                                         profile.posts.map((post) => (
    //                                             <Post post={post} user={user} key={post._id} profile />
    //                                         ))
    //                                     ) : (
    //                                         <div className="no_posts">No posts available</div>
    //                                     )}
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
}