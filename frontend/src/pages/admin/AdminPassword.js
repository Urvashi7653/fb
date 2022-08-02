import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { LogInInput } from "../../components/inputs/logininput";
export default function AdminPassword({visible, setVisible}) {
    const [password,setPassword] =useState("");
    const [error, setError] = useState("");

    const validateAdmin = async () => {
        try {
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/validateAdmin`,
                { password }
            );
            setVisible(1);
        } catch (error) {
            setError(error);
        }
    };

    return (
        <div className = "reset_wrap">
        <div className="reset_form">
            <div className="reset_form_header">Welcome !</div>
            <div className="reset_form_text">
                Enter admin password
            </div>
            <Formik
                enableReinitialize
                initialValues={{
                    password
                  }}
                onSubmit={() => {
                    validateAdmin();
                }}
            >
                {(formik) => (
                    <Form>
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
        </div>
        </div>
    );
}