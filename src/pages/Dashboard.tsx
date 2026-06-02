import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { Store, Plus, Code, ExternalLink } from 'lucide-react';

interface StoreData {
    id: string;
    name: string;
    subdomain: string;
    plan: string;
    created_at: string;
}

export default function Dashboard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Create store form state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newStoreName, setNewStoreName] = useState('');
    const [newStoreSubdomain, setNewStoreSubdomain] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (user) {
            fetchStores();
        }
    }, [user]);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('stores')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            setStores(data || []);
        } catch (error: any) {
            console.error('Error fetching stores:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar tus tiendas.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStoreName || !newStoreSubdomain || !user) return;
        
        setCreating(true);
        try {
            const { data, error } = await supabase
                .from('stores')
                .insert([
                    {
                        user_id: user.id,
                        name: newStoreName,
                        subdomain: newStoreSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
                    }
                ])
                .select();
                
            if (error) {
                if (error.code === '23505') { // Unique violation
                    throw new Error('Ese subdominio ya está en uso. Por favor, elige otro.');
                }
                throw error;
            }
            
            toast({
                title: '¡Tienda creada!',
                description: `La tienda ${newStoreName} se ha creado exitosamente.`,
            });
            
            setIsCreateOpen(false);
            setNewStoreName('');
            setNewStoreSubdomain('');
            
            if (data) {
                setStores([data[0], ...stores]);
            }
        } catch (error: any) {
            console.error('Create store error:', error);
            toast({
                title: 'Error al crear tienda',
                description: error.message || 'Ocurrió un error inesperado.',
                variant: 'destructive'
            });
        } finally {
            setCreating(false);
        }
    };

    const getEmbedCode = (storeId: string) => {
        return `<script src="https://cdn.solarfluidity.com/embed.js" data-store="${storeId}"></script>\n<div class="solar-fluidity-configurator"></div>`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copiado',
            description: 'Código copiado al portapapeles.',
        });
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Mis Tiendas 3D
                </h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Crear Tienda
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleCreateStore}>
                            <DialogHeader>
                                <DialogTitle>Crear Nueva Tienda</DialogTitle>
                                <DialogDescription>
                                    Configura los detalles básicos de tu nueva tienda 3D.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">Nombre de la Tienda</label>
                                    <Input 
                                        id="name" 
                                        placeholder="Ej: Muebles del Bosque" 
                                        value={newStoreName}
                                        onChange={(e) => setNewStoreName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="subdomain" className="text-sm font-medium">Subdominio</label>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            id="subdomain" 
                                            placeholder="mueblesdelbosque" 
                                            value={newStoreSubdomain}
                                            onChange={(e) => setNewStoreSubdomain(e.target.value)}
                                            required
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">.solarfluidity.app</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Solo letras minúsculas, números y guiones.</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={creating}>
                                    {creating ? 'Creando...' : 'Crear Tienda'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : stores.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                        <Store className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No tienes tiendas</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Comienza creando tu primera tienda para configurar tus productos en 3D.
                        </p>
                        <div className="mt-6">
                            <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 mx-auto">
                                <Plus className="h-4 w-4" /> Crear mi primera tienda
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {stores.map((store) => (
                            <Card key={store.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <Store className="h-5 w-5 text-primary" />
                                                {store.name}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                <a 
                                                    href={`https://${store.subdomain}.solarfluidity.app`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                                >
                                                    {store.subdomain}.solarfluidity.app
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </CardDescription>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${store.plan === 'pro' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'}`}>
                                            {store.plan}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md border text-sm relative group">
                                        <div className="flex items-center gap-2 mb-2 text-slate-500 font-medium">
                                            <Code className="h-4 w-4" /> Código de Incrustación
                                        </div>
                                        <pre className="overflow-x-auto text-xs text-slate-700 dark:text-slate-300">
                                            <code>{getEmbedCode(store.id)}</code>
                                        </pre>
                                        <Button 
                                            size="sm" 
                                            variant="secondary" 
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => copyToClipboard(getEmbedCode(store.id))}
                                        >
                                            Copiar
                                        </Button>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-slate-50 dark:bg-slate-800 border-t flex justify-between rounded-b-lg">
                                    <Button variant="outline" size="sm">Gestionar Productos</Button>
                                    <Button variant="ghost" size="sm">Configurar</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
