import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Toaster } from "react-hot-toast";
import "./AdminSidebar.css";

function AdminDashboard() {
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  useEffect(() => {
    async function getUserList() {
      const response = await axios.get(
        "http://localhost:8000/api/class-userlist/"
      );
      setUserList(response.data);
    }
    getUserList();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8000/api/user-delete/${id}/`)
          .then(() => {
            const updatedUserList = userList.filter((user) => user.id !== id);
            setUserList(updatedUserList);
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            Swal.fire(
              "Error",
              "An error occurred while deleting the user.",
              "error"
            );
          });
      }
    });
  };

  async function searchUser(keyword) {
    const response = await axios.get(
      `http://localhost:8000/api/class-userlist/?search=${keyword}`
    );
    setUserList(response.data);
    if (response.data.length === 0) {
      toast.error("No users found");
    }
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = userList.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-div">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="header-div">
        <h1>Dashboard</h1>
        <input
          className="user-search"
          type="text"
          placeholder="Search User"
          onChange={(e) => searchUser(e.target.value)}
        />
      </div>
      <div className="table-div">
        <h1>User List</h1>
        <table id="customers">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th className="action-col">Actions</th>
          </tr>
          {currentRecords.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td className="action-col" style={{ display: "flex" }}>
                <Link className="action-text" to={`/update-user/${user.id}`}>
                  <p className="edit">
                    <FaEdit /> Edit
                  </p>
                </Link>
                <p className="delete" onClick={() => handleDelete(user.id)}>
                  <MdDeleteForever /> Delete
                </p>
              </td>
            </tr>
          ))}
        </table>
        {/* Pagination */}
        <div className="pagination">
          {Array.from({
            length: Math.ceil(userList.length / recordsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              className={`pagination-btn ${
                index + 1 === currentPage ? "active" : ""
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
