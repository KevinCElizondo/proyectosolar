
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import type { Project } from '@/types';

const ProjectDetail = () => {
    const { id } = useParams();
    const { toast } = useToast();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                // TODO: Replace with actual API call
                setProject({
                    id: id || '',
                    userId: '1',
                    name: 'Solar Installation Project',
                    description: 'Installation of solar panels for residential building',
                    status: 'in_progress',
                    startDate: new Date(),
                    budget: 15000,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                setLoading(false);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to load project details',
                    variant: 'destructive',
                });
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, toast]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">Description</h2>
                        <p className="text-gray-600">{project.description}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Status</h2>
                        <span className="capitalize">{project.status.replace('_', ' ')}</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Budget</h2>
                        <span>${project.budget?.toLocaleString()}</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Start Date</h2>
                        <span>{project.startDate?.toLocaleDateString()}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProjectDetail;
