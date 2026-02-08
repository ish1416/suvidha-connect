import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trash2, ArrowLeft, Calendar, CreditCard, 
  CheckCircle, Loader2, Download, MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface WasteModuleProps {
  onBack: () => void;
}

const WasteModule: React.FC<WasteModuleProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { citizen, updateCitizen } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<{
    type: 'schedule' | 'payment';
    id: string;
    details: string;
  } | null>(null);

  const handleSchedule = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess({
        type: 'schedule',
        id: 'W-' + Math.floor(Math.random() * 10000),
        details: 'Pickup scheduled for tomorrow morning'
      });
      
      if (citizen && updateCitizen) {
        updateCitizen({ points: (citizen.points || 0) + 15 });
        toast.success(t('waste.schedule_success') + ' (+15 Points)' || 'Pickup Scheduled Successfully! (+15 Points)');
      } else {
        toast.success(t('waste.schedule_success') || 'Pickup Scheduled Successfully!');
      }
    }, 2000);
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess({
        type: 'payment',
        id: 'TXN-' + Math.floor(Math.random() * 100000),
        details: 'Monthly waste collection fee paid'
      });

      if (citizen && updateCitizen) {
        updateCitizen({ points: (citizen.points || 0) + 20 });
        toast.success(t('waste.payment_success') + ' (+20 Points)' || 'Payment Successful! (+20 Points)');
      } else {
        toast.success(t('waste.payment_success') || 'Payment Successful!');
      }
    }, 2000);
  };

  if (success) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center">{t('success') || 'Success!'}</h2>
        <p className="text-muted-foreground text-center mb-8 text-lg">
          {success.details}
        </p>
        
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border">
          <QRCodeSVG 
            value={JSON.stringify(success)} 
            size={200}
            level="H"
            includeMargin={true}
          />
          <p className="text-center text-xs text-gray-500 mt-2">Scan for Receipt</p>
        </div>

        <div className="bg-muted p-4 rounded-lg w-full max-w-md mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Reference ID</span>
            <span className="font-mono font-bold">{success.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" size="lg" onClick={() => setSuccess(null)}>
            {t('back') || 'Back'}
          </Button>
          <Button size="lg" onClick={onBack}>
            {t('home') || 'Home'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-12 w-12 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t('services.waste.title') || 'Waste Management'}</h1>
          <p className="text-muted-foreground">{t('services.waste.description') || 'Schedule pickups & pay fees'}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-16">
          <TabsTrigger value="schedule" className="text-lg h-full">
            <Calendar className="mr-2 w-5 h-5" />
            {t('waste.schedule') || 'Schedule Pickup'}
          </TabsTrigger>
          <TabsTrigger value="pay" className="text-lg h-full">
            <CreditCard className="mr-2 w-5 h-5" />
            {t('waste.pay_fee') || 'Pay Fees'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Waste Pickup</CardTitle>
              <CardDescription>Select a type of waste and preferred time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Household', 'E-Waste', 'Construction'].map((type) => (
                  <Button 
                    key={type} 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center gap-2 text-lg hover:border-primary hover:bg-primary/5"
                  >
                    <Trash2 className="w-8 h-8" />
                    {type}
                  </Button>
                ))}
              </div>
              
              <div className="bg-muted p-4 rounded-lg flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span>Pickup Location: <strong>Registered Home Address</strong></span>
              </div>

              <Button 
                size="lg" 
                className="w-full h-14 text-lg" 
                onClick={handleSchedule} 
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  'Confirm Pickup'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pay" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pay Waste Collection Fee</CardTitle>
              <CardDescription>Monthly municipal waste collection charges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Monthly Fee (Feb 2026)</span>
                  <span className="text-2xl font-bold">₹150.00</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Due Date</span>
                  <span>10 Feb 2026</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full h-14 text-lg" 
                onClick={handlePay}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WasteModule;
