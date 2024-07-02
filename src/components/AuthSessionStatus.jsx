export default function AuthSessionStatus({ status, className, ...props }) {
    return (
        <>
            {status && (
                <div
                    className={`${className} text-center my-2 bg-green-600 text-white font-bold p-3 uppercase`}
                    {...props}
                >
                    {status}
                </div>
            )}
        </>
    );
}
