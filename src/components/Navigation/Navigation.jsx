import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { LoginOutlined, LogoutOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/user.service";
import { toast } from "react-toastify";
const Navigation = (props) => {
    const navigate = useNavigate()
    const { authState, logout } = useContext(AuthContext)
    return (
        <div style={{
            height: 50,
            borderBottom: "1px solid black",
            display: "flex",
            justifyContent: "flex-end",
            padding: "0 20px",
            alignItems: "center"
        }}>
            {authState.isAuthenticated === true && (
                <div style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5
                }}>
                    <div style={{fontWeight: "bold", cursor: "pointer", display: authState.user.role === "admin"?"block":"none"}} onClick={()=>navigate("/product-management")}><p>Product Management</p></div>
                    <div style={{fontWeight: "bold", cursor: "pointer"}} onClick={() => navigate("/cart")}>
                        <p>Cart</p>
                    </div>
                    <div style={{fontWeight: "bold", cursor: "pointer"}} onClick={() => navigate("/order")}>
                        <p>Orders</p>
                    </div>
                    <p>
                        Welcome back,
                        <span>
                            {authState.user?.username}
                        </span>
                    </p>
                    <div onClick={async () => {
                        logout()
                        await logoutUser().then(() => {
                            toast.success("Logged out")
                            navigate("/login")
                        })
                    }}>
                        <LogoutOutlined />
                    </div>

                </div>
            )}
            {authState.isAuthenticated === false && (
                <div style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5
                }} onClick={() => {
                    navigate("/login")
                }}>
                    <LoginOutlined />
                    <p>Login</p>
                </div>
            )}

        </div>
    );
}

export default Navigation;