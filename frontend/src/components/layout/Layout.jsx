import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
	return (
		<div className="min-h-screen bg-base-100">
			<Navbar />
			<main className="max-w-7xl mx-auto px-4 py-6">
				<Outlet /> {/* 👈 This is where pages like HomePage, NotificationsPage, etc. will render */}
			</main>
		</div>
	);
};

export default Layout;
