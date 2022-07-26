import "./style.css";
import { ErrorMessage, useField } from "formik";

export function LogInInput({ placeholder, bottom, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="input_wrap">
      {meta.touched && meta.error && !bottom && (
        <div className="input_error" style={{ transform: "translateY(-10px)" }}>
          {meta.touched && meta.error && <ErrorMessage name={field.name} />}
          {meta.touched && meta.error && (<div className="error_arrow_top">
          </div>)}</div>
      )}
      <input
        className={meta.touched && meta.error ? "input_error_border" : ""}
        type={field.type}
        name={field.name}
        placeholder={placeholder}
        {...field}
        {...props}
      ></input>
      {meta.touched && meta.error && bottom && (
        <div className="input_error">{meta.touched && meta.error && <ErrorMessage name={field.name} />}
          {meta.touched && meta.error && (<div className="error_arrow_bottom">
          </div>)}</div>
      )}
      {/* meta.touched && meta.error && <i className="error_icon"></i> */}
    </div>
  );
}
