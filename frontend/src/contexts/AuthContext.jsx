import React, {useContext, useEffect, useState} from "react";
import { useAsync } from "../hooks/useAsync";
import { getAuthUserProfile } from "../services/user";
import PageLoading from "../components/PageLoading";

const AuthContext = React.createContext()
const AuthUpdateContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}
export function useAuthUpdate() {
    return useContext(AuthUpdateContext)
}
export function AuthProvider({children}) {
    const [loggedInUser, setLoggedInUser] = useState(null)
    console.log(loggedInUser)

    const {loading, value: user} = useAsync(getAuthUserProfile, [])

    useEffect(() => {
      if(user != null) {
        setLoggedInUser(user)
      } 
    }, [user])
    console.log(loggedInUser);

    function createLoggedInUser(user) {
      setLoggedInUser(user)
    }
    function removeLoggedInUser() {
      setLoggedInUser(null)
    }
    function updateLoggedInUser(updatedFields) {
      setLoggedInUser(prevUser => ({...prevUser, ...updatedFields}))
    }

    if(loading) {
      return <PageLoading/>
    }
    
  return (
    <AuthContext.Provider value={loggedInUser}>
      <AuthUpdateContext.Provider value={{createLoggedInUser, removeLoggedInUser, updateLoggedInUser}}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
}