const router = [
    { type: "GET", endPoint: "/host", service: "/common/Host" },
    { type: "POST", endPoint: "/login", service: "/common/DoLogin" },
    { type: "POST", endPoint: "/logout", service: "/common/DoLogout" },
    { type: "GET", endPoint: "/version", service: "/common/Version" },
    { type: "GET", endPoint: "/user", service: "/common/GetUser" },
    { type: "GET", endPoint: "/user/count", service: "/common/CountUser" },
    { type: "POST", endPoint: "/user/create", service: "/common/AddUser" },
    { type: "PUT", endPoint: "/user/update", service: "/common/EditUser" },
    { type: "DELETE", endPoint: "/user/delete", service: "/common/DeleteUser" },
];

module.exports = router;