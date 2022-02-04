import AuthForm from "../components/Auth/AuthForm";
import { useParams } from "react-router-dom";
export const AuthPage = () => {
  const params = useParams().auth;
  return <AuthForm params={params} />;
};

export default AuthPage;
