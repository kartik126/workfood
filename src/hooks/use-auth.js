import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        fetchData(authUser?.email, authUser);
        setIsFetching(false);
      } else {
        setUser(null);
        setIsFetching(false);
      }
    });
    const fetchData = async (email, authUser) => setUser(authUser);
    return () => listener();
  }, []);

  return { user, isFetching };
};

export default useAuth;
