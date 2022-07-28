import { useRef, useState } from "react";
import "./style.css";
//import Picker from "emoji-picker-react";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import AddToYourPost from "./AddToYourPost";
import ImagePreview from "./ImagePreview";
import useClickOutside from "../../helpers/clickOutside";
import { createPost } from "../../functions/post";
import PulseLoader from "react-spinners/PulseLoader";
import PostError from "./PostError";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { uploadImages } from "../../functions/uploadImages";
//import { useSelector } from "react-redux";

export default function CreatePostPopup({ user, setVisible }) {

  const popup = useRef(null);
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState("");

  useClickOutside(popup, () => {
    setVisible(false);
  });

  const postSubmit = async () => {

    //for posts having background
    if (background) {
      setLoading(true);
      const response = await createPost(
        null,
        background,
        text,
        null,
        user.id,
        user.token
      );
      setLoading(false);

      //after submit
      if (response === "ok") {
        setBackground("");
        setText("");
        setVisible(false);
      } else {
        setError(response);
      }

      //post containing images
    } else if (images && images.length) {
      setLoading(true);
      const postImages = images.map((img) => {
        return dataURItoBlob(img);
      });

      const path = `${user.user}/post_images`;
      let formData = new FormData();
      formData.append("path", path);
      postImages.forEach((image) => {
        formData.append("file", image);
      });

      //The FormData interface provides a way to easily construct a set of key/value pairs representing form fields and their values, which can then be easily sent using the fetch() or XMLHttpRequest.send() method. 
      // formdata.append() Appends a new value onto an existing key inside a FormData object, or adds the key if it does not already exist.

      const response = await uploadImages(formData, user.token);

      //for posts without background
      const res = await createPost(
        null,
        null,
        text,
        response,
        user.id,
        user.token
      );
      setLoading(false);
      if (res === "ok") {
        setText("");
        setImages("");
        setVisible(false);
      } else {
        setError(res);
      }
    } else if (text) {
      setLoading(true);
      const response = await createPost(
        null,
        null,
        text,
        null,
        user.id,
        user.token
      );
      setLoading(false);
      if (response === "ok") {
        setBackground("");
        setText("");
        setVisible(false);
      } else {
        setError(response);
      }
    } else {
      console.log("nothing");
    }
  };
  return (
    <div className="blur">
      <div className="postBox" ref={popup}>
        {error && <PostError error={error} setError={setError} />}
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => {
              setVisible(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user.picture} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">
              {user.first_name} {user.last_name}
            </div>
            <div className="box_privacy">
              <img src="../../../icons/public.png" alt="" />
              <span>Public</span>
              <i className="arrowDown_icon"></i>
            </div>
          </div>
        </div>

        {!showPrev ? (
          <>
            <EmojiPickerBackgrounds
              text={text}
              user={user}
              setText={setText}
              showPrev={showPrev}
              setBackground={setBackground}
              background={background}
            />
          </>
        ) : (
          <ImagePreview
            text={text}
            user={user}
            setText={setText}
            showPrev={showPrev}
            images={images}
            setImages={setImages}
            setShowPrev={setShowPrev}
            setError={setError}
          />
        )}
        <AddToYourPost setShowPrev={setShowPrev} />
        <button
          className="post_submit"
          onClick={() => {
            postSubmit();
          }}
          disabled={loading}
        >
        {/* A disabled button is unusable and un-clickable.When present, it specifies that the button should be disabled. */}
          {loading ? <PulseLoader color="#fff" size={5} /> : "Post"}
        </button>
      </div>
    </div>
  );
}
