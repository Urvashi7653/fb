import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { LogInInput } from "../../components/inputs/logininput";
export default function AdminPassword({ visible, setVisible }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const adminLoginValidation = Yup.object({
         username: Yup.string()
          .required("Username is required"),
        password: Yup.string().required("Password is required"),
    });
    const validateAdmin = async () => {
        try {
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/validateAdmin`,
                { username,password }
            );
            setVisible(1);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    return (<>
        <div className="login_1">
             <img src="../../icons/facebook.svg" alt=""></img>
       </div>
        <div className="reset_wrap" style ={{marginTop:"-40px"}}>
            <div className="reset_form">
                <div className="reset_form_header" style ={{marginLeft:"100px",borderBottomColor:"#fff"}}>Welcome Admin !</div>
                <Formik
                    enableReinitialize
                    validationSchema={adminLoginValidation}
                    initialValues={{
                        username,password
                    }}
                    onSubmit={() => {
                        validateAdmin();
                    }}
                >

                    {(formik) => (
                        <Form>
                            <LogInInput
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                name="username"
                                placeholder="Username "
                            />
                            <LogInInput
                                type="password"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                            
                            {error && <div className="error_text">{error}</div>}
                            <div className="reset_form_btns">
                                <Link to="/login" className="gray_btn">
                                    Cancel
                                </Link>
                                <button type="submit" className="blue_btn">
                                    Continue
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <Link to="/" className = "HomePage">
              <b>Go to Home page</b>
            </Link>
            </div>
        </div></>
    );
}