"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

type DecodedToken = {
    user: string,
    exp?: number
}

type Order = {
    id: number,
    name: string,
    price: number,
    quantity: number
}

export default function Orders() {
	const [user, setUser] = useState<string | null>(null);
	const [orders, setOrders] = useState<Order[]>([]);

	const editOrder = async (id: number, quantity: number) => {
		await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/order/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ quantity }),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			})
			.catch((err) => console.error("Error updating order:", err));
	};

	const deleteOrder = async (id: number) => {
		await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/order/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				// Remove deleted order from state
				setOrders(orders.filter((order) => order.id !== id));
			})
			.catch((err) => console.error("Error deleting order:", err));
	};

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token) {
			const decodedToken = jwtDecode<DecodedToken>(token);
			setUser(decodedToken.user);

			fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${decodedToken.user}/orders`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data.orders);
					setOrders(data.orders);
				})
				.catch((error) => console.error("Error fetching orders:", error));
		}
	}, [user]);

	return (
		<div className="flex flex-col items-center p-6 gap-4">
			<h1 className="text-2xl font-semibold">Orders</h1>
			<table className="w-full items-center border-collapse text-left">
				<thead className="border-b-2 border-gray-400">
					<tr>
						<th className="p-2">Name</th>
						<th className="p-2">Price</th>
						<th className="p-2">Quantity</th>
						<th className="p-2">Actions</th> {/* Added Actions column */}
					</tr>
				</thead>
				<tbody className="border-b-2 border-gray-400">
					{orders.length > 0 ? (
						orders.map((order, index) => (
							<tr key={index}>
								<td className="p-2">{order.name}</td>
								<td className="p-2">{order.price}</td>
								<td className="p-2">
									<input
										type="number"
										value={order.quantity}
										step={1}
										min={0}
										max={10}
										onChange={(e) => {
											const newQuantity = parseInt(e.target.value);
											setOrders((prevOrders) =>
												prevOrders.map((o) =>
													o.id === order.id
														? { ...o, quantity: newQuantity }
														: o
												)
											);
										}}
									/>
								</td>
								<td className="p-2">
									<div className="flex flex-row gap-2">
										<EditRoundedIcon
											className="cursor-pointer text-blue-500"
											onClick={() => editOrder(order.id, order.quantity)} // Fixed issue
										/>
										<DeleteRoundedIcon
											className="cursor-pointer text-red-500"
											onClick={() => deleteOrder(order.id)} // Fixed issue
										/>
									</div>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td className="p-2 border text-center col-span-4">
								No orders found
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
