import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaUserPlus } from "react-icons/fa";

type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
};

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
    });
    const [submitMessage, setSubmitMessage] = useState("");

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }));
    }

    async function handleRegisterSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const response = await fetch(
            "http://localhost:5203/api/auth/register",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }
        );

        if (!response.ok) {
            setSubmitMessage("Registration failed.");
            return;
        }

        setSubmitMessage(`Successfully registered ${formData.username}.`);
        navigate("/login");
    }

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col justify-center gap-6 py-6 sm:py-8">
            <div className="flex flex-col gap-3 text-center sm:text-left">
                <p className="text-sm font-semibold uppercase tracking-wider text-violet-700">Welcome to CineShare</p>
                <h1 className="page-title">Create your account</h1>
                <p className="page-title-subheading">
                    Join CineShare to post reviews, keep track of movies, and see what other film fans are watching.
                </p>
            </div>

            <form className="flex flex-col gap-5 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6" onSubmit={handleRegisterSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-neutral-950">First Name</span>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First name"
                            autoComplete="given-name"
                            required
                            className="h-12 rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 shadow-sm placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-neutral-950">Last Name</span>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last name"
                            autoComplete="family-name"
                            required
                            className="h-12 rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 shadow-sm placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950"
                        />
                    </label>
                </div>

                <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-neutral-950">Email</span>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="h-12 rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 shadow-sm placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950"
                    />
                </label>

                <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-neutral-950">Username</span>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Choose a username"
                        autoComplete="username"
                        required
                        minLength={3}
                        className="h-12 rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 shadow-sm placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950"
                    />
                </label>

                <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-neutral-950">Password</span>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        className="h-12 rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 shadow-sm placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950"
                    />
                </label>

                {submitMessage && (
                    <p className="text-sm font-semibold text-green-700">{submitMessage}</p>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-violet-700 px-6 text-base font-semibold text-white shadow-md hover:bg-violet-800 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-violet-950 sm:w-auto"
                    >
                        <FaUserPlus className="h-4 w-4" />
                        Register
                    </button>
                </div>
            </form>

            <p className="text-center text-sm text-neutral-700">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-violet-700 hover:text-violet-900"
                >
                    Log in
                </Link>
            </p>
        </div>
    );
}
