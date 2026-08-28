import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";

type RegisterFormData = {
    email: string;
    username: string;
    password: string;
};

export default function Register() {
    const [formData, setFormData] = useState<RegisterFormData>({
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
            "https://localhost:7000/api/auth/register",
            {
                method: "POST",
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

        setSubmitMessage(
            `Successfully registered ${formData.username}.`
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 py-6 sm:py-8">
            <div className="flex flex-col gap-2">
                <h1 className="page-title">Register</h1>
                <p className="page-title-subheading">Create your CineShare account.</p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleRegisterSubmit}>
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
        </div>
    );
}
