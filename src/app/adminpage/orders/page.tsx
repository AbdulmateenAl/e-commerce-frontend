"use client";
import AdminNav from "@/app/components/AdminNav";
import SearchIcon from "@mui/icons-material/Search";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

type DecodedToken = {
	user: string;
	exp?: number;
};

type Order = {
	id: number;
	userId: number;
	name: string;
	user: string;
    cart: {
        name: string,
        quantity: number,
        price: number,
    }[],
	quantity: number;
	totalAmount: number;
	status: "pending" | "shipped" | "delivered";
	created_at: string;
};

export default function Orders() {
	const router = useRouter();

	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [error, setError] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	// const filteredOrders = orders.filter(order => {
	//     const matchesSearch = order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
	//         order.id.toString().includes(searchTerm);
	//     const matchesStatus = statusFilter === "all" || order.status === statusFilter;
	//     return matchesSearch && matchesStatus;
	// });

	const filteredOrders =
		statusFilter === "all"
			? orders
			: orders.filter((item) => item.status === statusFilter);

	const deleteOrder = async(orderId: number) => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/order/${orderId}`, {
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
			}
		});
		const result = await response.json();
		if (response.ok) {
			setOrders(orders.filter((order) => order.id !== orderId))
		} else {
			console.log(result.message);
		}
	}

	const updateOrderStatus = async (
		orderId: number,
		newStatus: Order["status"]
	) => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/order/${orderId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: newStatus }),
			});
			const data = await response.json();

			if (response.ok) {
				setOrders(
					orders.map((order) =>
						order.id === orderId ? { ...order, status: newStatus } : order
					)
				);
			} else {
				setError(data.message || "Error updating order status");
			}
		} catch (err) {
			setError(`Failed to update order status. Please try again. ${err}`);
		}
	};

	useEffect(() => {
		setLoading(true);
		const token = localStorage.getItem("token");
		if (token) {
			const decodedToken = jwtDecode<DecodedToken>(token);

			if (
				decodedToken.exp &&
				decodedToken.exp < Math.floor(Date.now() / 1000)
			) {
				localStorage.removeItem("token");
				window.location.href = "/login";
				return;
			}

			fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${decodedToken.user}/orders`)
				.then((res) => res.json())
				.then((data) => {
					setOrders(data.orders);
					console.log(data.orders);
					setLoading(false);
				})
				.catch((err) => {
					console.error("Error fetching orders:", err);
					setError("Failed to load orders");
					setLoading(false);
				});
		} else {
			router.push("/login");
		}
	}, [router]);

	const getStatusIcon = (status: Order["status"]) => {
		switch (status) {
			case "pending":
				return <PendingIcon className="text-yellow-500" />;
			case "shipped":
				return <LocalShippingIcon className="text-blue-500" />;
			case "delivered":
				return <CheckCircleIcon className="text-green-500" />;
		}
	};

	const getStatusBadgeColor = (status: Order["status"]) => {
		switch (status) {
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "shipped":
				return "bg-blue-100 text-blue-800";
			case "delivered":
				return "bg-green-100 text-green-800";
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<AdminNav>
				<div className="container mx-auto px-4 py-8">
					{/* Header */}
					<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Orders</h1>
							<p className="text-gray-600 mt-1">Manage customer orders</p>
						</div>
					</div>

					{/* Filters */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						{/* Search Bar */}
						<div className="relative">
							<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Search orders..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						<div className="flex gap-2">
							{["all", "pending", "shipped", "delivered"].map((status) => (
								<button
									key={status}
									onClick={() => setStatusFilter(status)}
									className={`px-4 py-2 rounded-lg capitalize ${
										statusFilter === status
											? "bg-blue-100 text-blue-700 font-medium"
											: "bg-white text-gray-600 hover:bg-gray-50"
									}`}
								>
									{status}
								</button>
							))}
						</div>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-6 bg-red-50 text-red-500 px-4 py-3 rounded-lg">
							{error}
						</div>
					)}

					{/* Orders Table */}
					<div className="bg-white rounded-xl shadow-sm overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Order ID
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Customer
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Product
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Total
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Date
										</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{loading ? (
										<tr>
											<td
												colSpan={7}
												className="px-6 py-4 text-center text-gray-500"
											>
												Loading orders...
											</td>
										</tr>
									) : filteredOrders.length === 0 ? (
										<tr>
											<td
												colSpan={7}
												className="px-6 py-4 text-center text-gray-500"
											>
												No orders found
											</td>
										</tr>
									) : (
										filteredOrders.map((order) => (
											<tr key={order.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 text-sm text-gray-900">
													#{order.id}
												</td>
												<td className="px-6 py-4">
													<div className="text-sm font-medium text-gray-900">
														{order.user}
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-sm text-gray-900">
															{order.cart.map((product, index) => (
																<div key={index}>
																	{product.name}x{product.quantity}
																</div>
															))}
													</div>
												</td>
												<td className="px-6 py-4 text-sm text-gray-900">
													₦{order.totalAmount.toFixed(2)}
												</td>
												<td className="px-6 py-4">
													<span
														className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
															order.status
														)}`}
													>
														{getStatusIcon(order.status)}
														<span className="ml-1 capitalize">
															{order.status}
														</span>
													</span>
												</td>
												<td className="px-6 py-4 text-sm text-gray-500">
													{new Date(order.created_at).toLocaleDateString()}
												</td>
												<td className="px-6 py-4 text-right text-sm font-medium items-center">
													<select
														value={order.status}
														onChange={(e) =>
															updateOrderStatus(
																order.id,
																e.target.value as Order["status"]
															)
														}
														className="rounded-lg border-gray-300 text-gray-700 text-sm"
													>
														<option value="pending">Pending</option>
														<option value="shipped">Shipped</option>
														<option value="delivered">Delivered</option>
													</select>
													<button className="text-red-600 hover:text-red-800 transition-colors cursor-pointer" onClick={() => deleteOrder(order.id)} >
														<DeleteRoundedIcon />
													</button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</AdminNav>
		</div>
	);
}
