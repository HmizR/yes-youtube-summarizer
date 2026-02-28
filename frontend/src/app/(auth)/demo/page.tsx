"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function DemoPage() {
    const router = useRouter();

    const handleDemoLogin = async () => {
        try {
        // API call to login
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            email: "demo.acc@kubela.id",
            password: "admin1234"
            }),
            credentials: 'include' // For cookies if using JWT in cookies
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store token if returned
        if (data.token) {
            localStorage.setItem('token', data.token);
        }

        // Store user data
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Redirect to dashboard
        router.push('/dashboard');
        
        } catch (err) {
        // setError(err.message || 'Invalid email or password');
        } finally {
        // setIsLoading(false);
        }
    };

    useEffect(() => {
        handleDemoLogin();
    }, []);

    return (<></>);
}