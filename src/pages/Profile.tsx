
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
    const { toast } = useToast();
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john@example.com');
    const [company, setCompany] = useState('Solar Corp');

    const handleSave = () => {
        toast({
            title: 'Profile updated',
            description: 'Your profile has been updated successfully.',
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-6">Profile</h1>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <Button onClick={handleSave} className="w-full">
                        Save Changes
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
