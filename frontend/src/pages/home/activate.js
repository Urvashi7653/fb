import { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useParams,useNavigate } from "react-router-dom";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import Stories from "../../components/home/stories";
import ActivateForm from "./ActivateForm";
import "./style.css";
import Cookies from "js-cookie";
import axios from "axios";

export default function Activate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((user) => ({ ...user }));
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  useEffect(() => {
    activateAccount();
  }, []);
  const activateAccount = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/activate/`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSuccess(data.message);
      Cookies.set("user", JSON.stringify({ ...user, verified: true }));
      dispatch({
        type: "VERIFY",
        payload: true,
      });

      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  };

  return (
    <div>
      <div className="home">
        {success && (
          <ActivateForm
            type="success"
            header="Account verification succeeded"
            text={success}
            loading={loading}
          />
        )}
        {error && (
          <ActivateForm
            type="error"
            header="Account verification failed"
            text={error}
            loading={loading}
          />
        )}
        <Header />
        <LeftHome user={user} />
        <div className="home_middle">
          <Stories />
          <CreatePost />
        </div>
      </div>
    </div>
  );
}
