
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleSave = () => {
        toast({
            title: 'Settings saved',
            description: 'Your preferences have been updated successfully.',
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-6">Settings</h1>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="notifications">Notifications</Label>
                            <p className="text-sm text-gray-500">Receive email notifications</p>
                        </div>
                        <Switch
                            id="notifications"
                            checked={notifications}
                            onCheckedChange={setNotifications}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="darkMode">Dark Mode</Label>
                            <p className="text-sm text-gray-500">Use dark theme</p>
                        </div>
                        <Switch
                            id="darkMode"
                            checked={darkMode}
                            onCheckedChange={setDarkMode}
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

export default Settings;
