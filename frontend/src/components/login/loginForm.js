import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";
import { LogInInput } from "../../components/inputs/logininput";
import DotLoader from "react-spinners/DotLoader";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ setVisible }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginInfos = {
    email: "",
    password: "",
  };
  const [login, setLogin] = useState({ loginInfos });
  const { email, password } = login;
  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required")
      .email("Must be a valid email"),
    password: Yup.string().required("Password is required"),
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const loginSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          email,
          password,
        }
      );

      dispatch({ type: "LOGIN", payload: data });
      Cookies.set("user", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };
  return (
    <div className="login">
      <div className="login_wrapper">
        <div className="login_wrap">
          <div className="login_1">
            <img src="../../icons/facebook.svg" alt=""></img>
            <span>
              {" "}
              Facebook allows to you to connect and share with people in your
              life.
            </span>
          </div>
          <div className="login_2">
            <div className="login_2_wrap">
              <Formik
                enableReinitialize
                initialValues={{ email, password }}
                validationSchema={loginValidation}
                onSubmit={() => {
                  loginSubmit();
                }}
              >
                {(formik) => (
                  <Form>
                    <LogInInput
                      onChange={handleLoginChange}
                      type="text"
                      name="email"
                      placeholder="Email address or phone number"
                    />
                    <LogInInput
                      onChange={handleLoginChange}
                      type="password"
                      name="password"
                      placeholder="Password"
                      bottom
                    />
                    <button type="submit" className="blue_btn">
                      {" "}
                      Log In
                    </button>
                  </Form>
                )}
              </Formik>
              <Link to="/forgot" className="forgot_password">
                Forgotton password?
              </Link>
              <DotLoader color="#1876f2" loading={loading} size={30} />
              {error && <div className="error_text">{error}</div>}
              <div className="sign_splitter"></div>
              <button
                className="blue_btn open_signup"
                onClick={() => setVisible(true)}
              >
                {" "}
                Create Account
              </button>
            </div>
            <Link to="/" className="sign_extra">
              <b>Create a page</b> for a celebrity,brand or business.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
