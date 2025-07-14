import { Outlet, Link } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
      <footer className="w-full bg-neutral-900 text-white text-center py-6 mt-8 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="font-bold text-lg tracking-wide">ReWear &copy; {new Date().getFullYear()}</div>
          <nav className="flex gap-6 text-sm">
            <a href="/shop/home" className="hover:underline">Home</a>
            <Link to="/shop/about" className="hover:underline">About</Link>
            <Link to="/shop/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default ShoppingLayout;
