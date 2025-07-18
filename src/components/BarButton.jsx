export default function BarButton({ children, onClick, type }) {
    return (
        <button
            onClick={onClick}
            type="button"
            className="cursor-pointer border border-gray-500 px-2 transition-colors duration-200 hover:bg-red-400 hover:text-white"
        >
            {children}
        </button>
    );
}
