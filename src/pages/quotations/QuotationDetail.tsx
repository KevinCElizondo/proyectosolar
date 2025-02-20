
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import type { Quotation } from '@/types';

const QuotationDetail = () => {
    const { id } = useParams();
    const { toast } = useToast();
    const [quotation, setQuotation] = useState<Quotation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                // TODO: Replace with actual API call
                setQuotation({
                    id: id || '',
                    projectId: '1',
                    totalAmount: 15000,
                    status: 'sent',
                    validUntil: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                setLoading(false);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to load quotation details',
                    variant: 'destructive',
                });
                setLoading(false);
            }
        };

        fetchQuotation();
    }, [id, toast]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!quotation) {
        return <div>Quotation not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-4">Quotation Details</h1>
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">Total Amount</h2>
                        <p className="text-gray-600">${quotation.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Status</h2>
                        <span className="capitalize">{quotation.status}</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Valid Until</h2>
                        <span>{quotation.validUntil.toLocaleDateString()}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default QuotationDetail;
