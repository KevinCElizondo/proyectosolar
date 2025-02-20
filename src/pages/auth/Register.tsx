
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { register } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(email, password, name);
            toast({
                title: "Registration successful",
                description: "Welcome to SolarFluidity!",
            });
        } catch (error) {
            toast({
                title: "Registration failed",
                description: "Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark p-4">
            <div className="w-full max-w-md space-y-8 bg-dark-lighter p-6 rounded-lg border border-white/10">
                <div>
                    <h2 className="text-3xl font-bold text-center">Create Account</h2>
                    <p className="mt-2 text-center text-gray-400">Join SolarFluidity today</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1"
                                placeholder="********"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Register
                    </Button>

                    <p className="text-center text-sm">
                        Already have an account?{' '}
                        <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
