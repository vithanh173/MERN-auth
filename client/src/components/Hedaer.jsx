import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Hedaer() {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div className="bg-neutral-300">
      <div className="flex justify-between items-center py-2 px-4 ">
        <h1 className="text-3xl">Auth App</h1>
        <ul className="flex gap-5 text-xl">
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/about">
            <li>About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.profile}
                alt="avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <li>Login</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Hedaer;
