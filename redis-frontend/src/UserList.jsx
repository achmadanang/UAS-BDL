import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import DataTable from "react-data-table-component";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4040/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = async () => {
    // Generate a random ID using uuid
    const randomId = uuidv4();

    if (
      !newUser.first_name ||
      !newUser.last_name ||
      !newUser.email ||
      !newUser.phone
    ) {
      alert("All fields are required. Cannot add user.");
      return;
    }

    // Check if the first name already exists
    const isDuplicateName = users.some(
      (user) =>
        user.data.first_name.toLowerCase() ===
          newUser.first_name.toLowerCase() &&
        user.data.last_name.toLowerCase() === newUser.last_name.toLowerCase()
    );

    const isDuplicateEmail = users.some(
      (user) => user.data.email.toLowerCase() === newUser.email.toLowerCase()
    );

    const isDuplicatePhone = users.some(
      (user) => user.data.phone.toLowerCase() === newUser.phone.toLowerCase()
    );

    if (isDuplicateName) {
      alert("Duplicate name. Cannot add user.");
      return;
    }

    if (isDuplicateEmail) {
      alert("Duplicate email. Cannot add user.");
      return;
    }

    if (isDuplicatePhone) {
      alert("Duplicate Phone. Cannot add user.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:4040/user/add",
        { ...newUser, id: randomId } // Include the generated ID in the request
      );
      console.log("API Response:", response.data);
      fetchData();
      setNewUser({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });
      alert("Success Add Data");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = (user) => {
    setNewUser({
      id: user.id,
      first_name: user.data.first_name,
      last_name: user.data.last_name,
      email: user.data.email,
      phone: user.data.phone,
    });
  };

  const handleUpdateUser = async () => {
    if (
      !newUser.first_name ||
      !newUser.last_name ||
      !newUser.email ||
      !newUser.phone
    ) {
      alert("All fields are required. Cannot update user.");
      return;
    }
    const isDuplicateName = users.some(
      (user) =>
        user.data.first_name.toLowerCase() ===
          newUser.first_name.toLowerCase() &&
        user.data.last_name.toLowerCase() === newUser.last_name.toLowerCase()
    );

    const isDuplicateEmail = users.some(
      (user) => user.data.email.toLowerCase() === newUser.email.toLowerCase()
    );

    const isDuplicatePhone = users.some(
      (user) => user.data.phone.toLowerCase() === newUser.phone.toLowerCase()
    );

    if (isDuplicateName) {
      alert("Duplicate name. Cannot update user.");
      return;
    }

    if (isDuplicateEmail) {
      alert("Duplicate email. Cannot update user.");
      return;
    }

    if (isDuplicatePhone) {
      alert("Duplicate Phone. Cannot update user.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:4040/user/update/${newUser.id}`,
        newUser
      );
      console.log("API Response:", response.data);
      fetchData();
      setNewUser({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });
      alert("Success Updating Data");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4040/user/delete/${userId}`
      );
      console.log("API Response:", response.data);
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    {
      name: "Nama Depan",
      selector: (row) => row.data.first_name,
      sortable: true,
      sortFunction: (a, b) => {
        // Fungsi pengurutan berdasarkan huruf
        const nameA = a.data.first_name.toUpperCase();
        const nameB = b.data.first_name.toUpperCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      name: "Nama Belakang",
      selector: (row) => row.data.last_name,
      sortable: true,
      sortFunction: (a, b) => {
        const nameA = a.data.last_name.toUpperCase();
        const nameB = b.data.last_name.toUpperCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      name: "Email",
      selector: (row) => row.data.email,
      sortable: true,
      sortFunction: (a, b) => {
        const nameA = a.data.email.toUpperCase();
        const nameB = b.data.email.toUpperCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      name: "Nomor HP",
      selector: (row) => row.data.phone,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => handleEditUser(row)}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-900 ml-2"
            onClick={() => handleDeleteUser(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-20">
      <div className=" flex items-center justify-center text-4xl py-10 font-semibold">
        Data Mahasiswa Kelas Q
      </div>
      <form className=" border border-black w-96 px-5 py-3 rounded-lg">
        <h2 className="text-center font-bold">
          {newUser.id ? "Edit User" : "INPUT BIODATA"}
        </h2>
        <label className="flex flex-col">
          Nama Depan :
          <input
            type="text"
            name="first_name"
            value={newUser.first_name}
            onChange={handleInputChange}
            className="border border-black rounded px-1"
          />
        </label>
        <label className="flex flex-col">
          Nama Belakang:
          <input
            type="text"
            name="last_name"
            value={newUser.last_name}
            onChange={handleInputChange}
            className="border border-black rounded px-1"
          />
        </label>
        <label className="flex flex-col">
          Email:
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            className="border border-black rounded px-1"
          />
        </label>
        <label className="flex flex-col">
          Nomor HP:
          <input
            type="number"
            name="phone"
            value={newUser.phone}
            onChange={handleInputChange}
            className="border border-black rounded px-1"
          />
        </label>
        <div className=" flex pt-5 justify-center">
          <button
            type="button"
            onClick={newUser.id ? handleUpdateUser : handleAddUser}
            className="w-1/2 bg-black rounded-lg text-white font-medium h-6 text-sm"
          >
            {newUser.id ? "Update User" : "Add User"}
          </button>
        </div>
      </form>
      <h1 className="text-3xl py-5 font-medium text-center">List Mahasiswa</h1>
      <div>
        <div>
          <DataTable
            columns={columns}
            data={users}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 20, 50]}
          />
        </div>
      </div>
    </div>
  );
};

export default UserList;
