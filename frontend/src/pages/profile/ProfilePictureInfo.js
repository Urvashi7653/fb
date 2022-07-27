export default function ProfilePictureInfos({profile}){
    return(
        <div className="profile_img_wrap">
            <div className="profile_w_left">
                <div className="profile_w_img">
                    <div className="profile_w_bg"
                    style={{
                        backgroundSize:"cover",
                        backgroundImage:`url(${profile.picture})`,
                    }}>
                        <div className="profile_w_col">
                            <div className="profile_name">
                                {profile.first_name}
                            </div>
                            <div className="profile_friend_count"></div>
                            <div className="profile_friend_imgs"></div>
                        </div>
                    </div>
                    <div className="profile_w_right">
                        <div className="blue_btn profile_blue_btn">
                            <img src = "../../../icons/plus.png" alt="" className="invert"/>
                            <span>Add to Story</span>
                        </div>
                        <div className="gray_btn profile_gray_btn ">
                            <i className="edit_icon"></i>
                            <span>Edit profile</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}