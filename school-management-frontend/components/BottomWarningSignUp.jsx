import { Link } from "react-router-dom";

export function BottomWarningSignUp({ label, buttonText, to }) {
  return (
    <div className="py-2 text-sm flex justify-center">
      <div>{label}</div>
      <Link className="pointer underline pl-1 cursor-pointer" to={"/signin"}>
        {buttonText}
      </Link>
    </div>
  );
}
