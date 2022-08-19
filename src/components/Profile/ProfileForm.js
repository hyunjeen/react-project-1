import classes from "./ProfileForm.module.css";
import { useContext, useRef } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const inputPasswordRef = useRef();
  const history = useHistory();

  const changePasswordHandler = (e) => {
    e.preventDefault();
    const password = inputPasswordRef.current.value;
    const token = authCtx.token;
    const changepasswordApi = async () => {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({
            idToken: token,
            password: password,
            returnSecureToken: true,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        console.log("success=>", data);
        alert("비밀번호가 성공적으로 변경되었습니다");
        authCtx.logout();
        history.replace("/");
      } else {
        alert(data.error.message);
      }
    };
    changepasswordApi();
  };

  return (
    <form className={classes.form} onSubmit={changePasswordHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={inputPasswordRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
