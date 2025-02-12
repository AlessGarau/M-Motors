function ErrorPage() {
    return (
        <>
            <div className="flex flex-col pl-6 gap-16 items-center w-screen h-screen justify-center">
                <img src="/assets/error404.png" alt="Image erreur 404" />
                <a
                    className="text-2xl font-bold rounded-lg text-white bg-primary px-6 py-4"
                    href="/dashboard"
                >
                    Retour
                </a>
            </div>
        </>
    );
}

export default ErrorPage;
