import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { RegisterInput } from "../inputs/registerinput";
import DotLoader from "react-spinners/DotLoader";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({setVisible}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfos = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    bYear: new Date().getFullYear(),
    bMonth: new Date().getMonth()+1,
    bDay: new Date().getDate(),
    gender: "",
  };
  const [user, setUser] = useState(userInfos);
  const {
    first_name,
    last_name,
    email,
    password,
    bYear,
    bMonth,
    bDay,
    gender,
  } = user;

  const tempYear = new Date().getFullYear();

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    console.log("********************e.target is **********************",e.target)
    setUser({ ...user, [name]: value });
    console.log("*******************USER IS ************************",user);
  };

  const years = Array.from(new Array(108), (val, index) => tempYear - index);
  const months = Array.from(new Array(12), (val, index) => 1 + index);
  const getDays = () => {
    return new Date(bYear, bMonth, 0).getDate();
    //THIS WILL RETURN NO OF DAYS IN A MONTH
  };
  const days = Array.from(new Array(getDays()), (val, index) => 1 + index);

  const registerValidation = Yup.object({
    first_name: Yup.string()
      .required("What is your first name?")
      .min(2, "First name should be between 2 and 16 characters")
      .max(16, "First name should be between 2 and 16 characters")
      .matches(
        /^[aA-zZ\s]+$/,
        "Numbers and special characters are not allowed"
      ),
    last_name: Yup.string()
      .required("What is your last name?")
      .min(2, "Last name should be between 2 and 16 characters")
      .max(16, "Last name should be between 2 and 16 characters")
      .matches(
        /^[aA-zZ\s]+$/,
        "Numbers and special characters are not allowed"
      ),
    email: Yup.string()
      .required("This will be required everytime you want to login")
      .email("Enter a valid email"),
    password: Yup.string()
      .required(
        "Enter a password of atleast 6 numbers,letters or punctuation marks"
      )
      .min(6, "Password must have atleast 6 characters")
      .max(30, "Maximum characters can be 30"),
  });

  const [dateError, setDateError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const registerSubmit = async () => {
    try {
        const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register`,
        {
          first_name,
          last_name,
          email,
          password,
          bYear,
          bMonth,
          bDay,
          gender,
        }
      );
      setError("");
      setSuccess(data.message);
      const { message, ...rest } = data;
      setTimeout(() => {
        dispatch({ type: "LOGIN", payload: rest });
        Cookies.set("user", JSON.stringify(rest));
        navigate("/");
      }, 3000);
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error.response.data.message);
    }
  };

  return (
    <div className="blur">
      <div className="register">
        <div className="register_header">
          <i className="exit_icon" onClick={()=>setVisible(false)}></i>
          <span>Sign up</span>
          <span>It's quick and easy.</span>
          <Formik
            enableReinitialize
            initialValues={{
              first_name,
              last_name,
              email,
              password,
              bYear,
              bMonth,
              bDay,
              gender,
            }}
            validationSchema={registerValidation}
            onSubmit={() => {
              let current_date = new Date();
              let picked_date = new Date(bYear, bMonth - 1, bDay);
              let atleast14 = new Date(1970 + 14, 0, 1);
              let noMoreThan70 = new Date(1970 + 70, 0, 1);
              if (current_date - picked_date < atleast14) {
                setDateError("You are underage for using facebook.");
                setGenderError("");
              } else if (current_date - picked_date > noMoreThan70) {
                setDateError("You are overage for using facebook.");
                setGenderError("");
              } else if (gender === "") {
                setDateError("");
                setGenderError("Please choose gender.");
              } else {
                setDateError("");
                setGenderError("");
                registerSubmit();
              }
            }}
          >
            {(formik) => (
              <Form className="register_form">
                <div className="reg_line">
                  <RegisterInput
                    type="text"
                    placeholder="First_name"
                    name="first_name"
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="reg_line">
                  <RegisterInput
                    type="text"
                    placeholder="Surname"
                    name="last_name"
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="reg_line">
                  <RegisterInput
                    type="text"
                    placeholder="Email address"
                    name="email"
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="reg_line">
                  <RegisterInput
                    type="password"
                    placeholder="New password"
                    name="password"
                    onChange={handleRegisterChange}
                  />

                  {/* Date of Birth */}
                </div>
                <div className="reg_col">
                  <div className="reg_line_header">
                    Date of birth <i className="info_icon"></i>
                  </div>
                  <div className="reg_grid">
                    <select
                      name="bDay"
                      value={bDay}
                      onChange={handleRegisterChange}
                    >
                      {days.map((day, i) => (
                        <option value={day} key={i}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <select
                      name="bMonth"
                      value={bMonth}
                      onChange={handleRegisterChange}
                    >
                      {months.map((month, i) => (
                        <option value={month} key={i}>
                          {month}
                        </option>
                      ))}
                    </select>

                    <select
                      name="bYear"
                      value={bYear}
                      onChange={handleRegisterChange}
                    >
                      {years.map((year, i) => (
                        <option value={year} key={i}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {dateError && (
                      <div className="input_error">
                        <div className="error_arrow_bottom"></div>
                        {dateError}
                      </div>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div className="reg_col">
                  <div className="reg_line_header">
                    Gender <i className="info_icon"></i>
                  </div>
                  <div className="reg_grid">
                    <label htmlFor="Male">
                      Male
                      <input
                        type="radio"
                        name="gender"
                        id="male"
                        value="male"
                        onChange={handleRegisterChange}
                      />
                    </label>
                    <label htmlFor="Female">
                      Female
                      <input
                        type="radio"
                        name="gender"
                        id="female"
                        value="female"
                        onChange={handleRegisterChange}
                      />
                    </label>
                    <label htmlFor="Custom">
                      Custom
                      <input
                        type="radio"
                        name="gender"
                        id="custom"
                        value="custom"
                        onChange={handleRegisterChange}
                      />
                    </label>
                    {genderError && (
                      <div className="input_error">
                        <div className="error_arrow_bottom"></div>
                        {genderError}
                      </div>
                    )}
                  </div>
                </div>
                <div className="reg_btn_wrapper">
                  <button className=" blue_btn open_signup">Sign up</button>
                </div>
                <DotLoader color="#1876f2" loading={loading} size={30} />
                {error && <div className="error_text">{error}</div>}
                {success && <div className="success_text">{success}</div>}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
