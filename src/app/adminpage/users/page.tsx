"use client";
import AdminNav from "@/app/components/AdminNav";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { useEffect, useState } from "react";

type User = {
	id: number;
	username: string;
};

export default function Users() {
	const [users, setUsers] = useState<User[]>([]);

	const deleteUser = async (id: number) => {
		await fetch(`http://localhost:5000/user/${id}`, {
			method: "DELETE",
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setUsers(users.filter((user) => user.id !== id));
			});
	};

	useEffect(() => {
		fetch("http://localhost:5000/users")
			.then((res) => res.json())
			.then((data) => {
				console.log(data.users);
				setUsers(data.users);
			});
	}, []);

	return (
		<div className="flex">
			<AdminNav />
			<div className="flex-1 p-6">
				<div className="flex flex-col gap-3">
					<h1 className="font-bold">Users</h1>
					<div>
						<table className="w-full items-center border-2 border-gray-400">
							<thead className="border-2 border-gray-400 w-full">
								<tr>
									<td>Name</td>
									<td>Actions</td>
								</tr>
							</thead>
							{users.map((user) => (
								<tbody
									className="border-2 border-gray-400 w-full text-left"
									key={user.id}
								>
									<tr>
										<td>{user.username}</td>
										<td>
											<DeleteRoundedIcon className="cursor-pointer text-red-600" onClick={() => deleteUser(user.id)} />
										</td>
									</tr>
								</tbody>
							))}
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
