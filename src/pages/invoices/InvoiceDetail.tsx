
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import type { Invoice } from '@/types';

const InvoiceDetail = () => {
    const { id } = useParams();
    const { toast } = useToast();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                // TODO: Replace with actual API call
                setInvoice({
                    id: id || '',
                    projectId: '1',
                    amount: 15000,
                    status: 'pending',
                    dueDate: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                setLoading(false);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to load invoice details',
                    variant: 'destructive',
                });
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id, toast]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!invoice) {
        return <div>Invoice not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">Amount</h2>
                        <p className="text-gray-600">${invoice.amount.toLocaleString()}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Status</h2>
                        <span className="capitalize">{invoice.status}</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Due Date</h2>
                        <span>{invoice.dueDate.toLocaleDateString()}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default InvoiceDetail;
