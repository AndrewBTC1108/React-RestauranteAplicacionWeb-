export default function Button({ type = 'submit', className, ...props }) {
    return (
        <button
            type={type}
            className={`${className} inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-800 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150`}
            {...props}
        />
    )
}
