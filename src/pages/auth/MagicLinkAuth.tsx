import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MagicLinkAuth() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { signInWithMagicLink, loading } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            toast({
                title: 'Error',
                description: 'Por favor, ingresa tu correo electrónico.',
                variant: 'destructive',
            });
            return;
        }

        const { error } = await signInWithMagicLink(email);

        if (error) {
            toast({
                title: 'Error de autenticación',
                description: error.message || 'No se pudo enviar el enlace mágico.',
                variant: 'destructive',
            });
        } else {
            setIsSubmitted(true);
            toast({
                title: '¡Enlace enviado!',
                description: 'Revisa tu bandeja de entrada para iniciar sesión.',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Solar Fluidity 3D</CardTitle>
                    <CardDescription>
                        Ingresa a tu panel de administración
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Correo electrónico
                                </label>
                                <Input 
                                    id="email"
                                    type="email" 
                                    placeholder="tu@empresa.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-2">Enviando...</span>
                                ) : (
                                    <span className="flex items-center gap-2">Enviar Enlace Mágico <ArrowRight className="h-4 w-4" /></span>
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center">
                            <div className="rounded-full bg-primary/10 p-4">
                                <Mail className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Revisa tu correo</h3>
                            <p className="text-muted-foreground text-sm">
                                Hemos enviado un enlace mágico a <strong>{email}</strong>. 
                                Haz clic en el enlace del correo para iniciar sesión instantáneamente.
                            </p>
                            <Button variant="outline" className="mt-4" onClick={() => setIsSubmitted(false)}>
                                Volver a intentar
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    <button onClick={() => navigate('/')} className="hover:underline">
                        Volver al inicio
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
}
