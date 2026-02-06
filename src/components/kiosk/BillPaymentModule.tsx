import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useKiosk } from '@/context/KioskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, Flame, Droplets, ArrowLeft, CreditCard, 
  Smartphone, Building, CheckCircle, Loader2, Download,
  Calendar, Receipt, History
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';

interface BillPaymentModuleProps {
  onBack: () => void;
}

const BillPaymentModule: React.FC<BillPaymentModuleProps> = ({ onBack }) => {
  const { language, citizen } = useAuth();
  const { bills, payBill } = useKiosk();
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState<{
    transactionId: string;
    amount: number;
    timestamp: string;
  } | null>(null);

  const t = {
    en: {
      title: 'Bill Payment',
      subtitle: 'Pay your utility bills securely',
      electricity: 'Electricity',
      gas: 'Gas',
      water: 'Water',
      selectBill: 'Select Bill to Pay',
      noBills: 'No pending bills',
      amount: 'Amount Due',
      dueDate: 'Due Date',
      billDate: 'Bill Date',
      units: 'Units',
      viewHistory: 'Payment History',
      payNow: 'Pay Now',
      selectPayment: 'Select Payment Method',
      upi: 'UPI',
      card: 'Card',
      netbanking: 'Netbanking',
      processing: 'Processing Payment...',
      success: 'Payment Successful!',
      transactionId: 'Transaction ID',
      downloadReceipt: 'Download Receipt',
      printReceipt: 'Print Receipt',
      newPayment: 'Make Another Payment',
      backToHome: 'Back to Home',
      overdue: 'OVERDUE',
      previousPayments: 'Previous Payments'
    },
    hi: {
      title: 'बिल भुगतान',
      subtitle: 'अपने उपयोगिता बिलों का सुरक्षित भुगतान करें',
      electricity: 'बिजली',
      gas: 'गैस',
      water: 'पानी',
      selectBill: 'भुगतान के लिए बिल चुनें',
      noBills: 'कोई लंबित बिल नहीं',
      amount: 'देय राशि',
      dueDate: 'नियत तारीख',
      billDate: 'बिल तारीख',
      units: 'यूनिट',
      viewHistory: 'भुगतान इतिहास',
      payNow: 'अभी भुगतान करें',
      selectPayment: 'भुगतान विधि चुनें',
      upi: 'UPI',
      card: 'कार्ड',
      netbanking: 'नेटबैंकिंग',
      processing: 'भुगतान प्रोसेस हो रहा है...',
      success: 'भुगतान सफल!',
      transactionId: 'लेनदेन आईडी',
      downloadReceipt: 'रसीद डाउनलोड करें',
      printReceipt: 'रसीद प्रिंट करें',
      newPayment: 'एक और भुगतान करें',
      backToHome: 'होम पर वापस जाएं',
      overdue: 'अतिदेय',
      previousPayments: 'पिछले भुगतान'
    }
  };

  const text = t[language];

  const getIcon = (type: string) => {
    switch (type) {
      case 'electricity': return Zap;
      case 'gas': return Flame;
      case 'water': return Droplets;
      default: return Zap;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'electricity': return text.electricity;
      case 'gas': return text.gas;
      case 'water': return text.water;
      default: return type;
    }
  };

  const citizenBills = bills.filter(b => b.status !== 'paid');
  const selectedBillData = bills.find(b => b.id === selectedBill);

  const handlePayment = async () => {
    if (!selectedBill || !paymentMethod) return;
    
    setProcessing(true);
    const result = await payBill(selectedBill, paymentMethod);
    setProcessing(false);

    if (result.success) {
      setPaymentComplete({
        transactionId: result.transactionId,
        amount: result.amount,
        timestamp: result.timestamp
      });
      toast.success(text.success);
    } else {
      toast.error(language === 'en' ? 'Payment failed. Please try again.' : 'भुगतान विफल. कृपया पुनः प्रयास करें।');
    }
  };

  const resetPayment = () => {
    setSelectedBill(null);
    setPaymentMethod(null);
    setPaymentComplete(null);
  };

  const handleDownloadReceipt = () => {
    if (!paymentComplete || !selectedBillData) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('SUVIDHA PAYMENT RECEIPT', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Smart Urban Virtual Interactive Digital Helpdesk Assistant', 105, 28, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Transaction ID:`, 20, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(paymentComplete.transactionId, 80, 50);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Date & Time:`, 20, 60);
    doc.text(new Date(paymentComplete.timestamp).toLocaleString(), 80, 60);
    
    doc.text(`Service Type:`, 20, 70);
    doc.text(getTypeLabel(selectedBillData.type), 80, 70);
    
    doc.text(`Consumer ID:`, 20, 80);
    doc.text(selectedBillData.consumerId, 80, 80);
    
    // Amount Box
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 95, 170, 20, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Amount Paid:`, 30, 108);
    doc.setTextColor(0, 128, 0); // Green color
    doc.text(`INR ${paymentComplete.amount.toLocaleString('en-IN')}`, 180, 108, { align: 'right' });

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for using SUVIDHA Kiosk Services.', 105, 270, { align: 'center' });
    doc.text('This is a computer generated receipt.', 105, 280, { align: 'center' });
    
    doc.save(`receipt_${paymentComplete.transactionId}.pdf`);
    toast.success(language === 'en' ? 'Receipt downloaded successfully' : 'रसीद सफलतापूर्वक डाउनलोड की गई');
  };

  // Payment Complete Screen
  if (paymentComplete) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="border-2 border-accent shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-accent mb-2">{text.success}</h2>
            <p className="text-muted-foreground mb-6">
              ₹{paymentComplete.amount.toLocaleString('en-IN')}
            </p>

            <div className="bg-muted p-6 rounded-lg mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{text.transactionId}</span>
                <span className="font-mono font-bold">{paymentComplete.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time</span>
                <span>{new Date(paymentComplete.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span>{selectedBillData ? getTypeLabel(selectedBillData.type) : ''}</span>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-lg border shadow-sm">
                <QRCodeSVG 
                  value={JSON.stringify(paymentComplete)} 
                  size={180} 
                  level="H"
                  includeMargin={true}
                />
                <p className="text-xs text-center mt-2 text-black font-medium">Scan to Download Receipt</p>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <Button className="flex-1 h-14" variant="outline" onClick={handleDownloadReceipt}>
                <Download className="w-5 h-5 mr-2" />
                {text.downloadReceipt}
              </Button>
              <Button className="flex-1 h-14" variant="outline">
                <Receipt className="w-5 h-5 mr-2" />
                {text.printReceipt}
              </Button>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 h-14" variant="secondary" onClick={resetPayment}>
                {text.newPayment}
              </Button>
              <Button className="flex-1 h-14" onClick={onBack}>
                {text.backToHome}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-12 w-12">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{text.title}</h2>
          <p className="text-muted-foreground">{text.subtitle}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Bill Selection */}
        <Card>
          <CardHeader>
            <CardTitle>{text.selectBill}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {citizenBills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-accent" />
                <p>{text.noBills}</p>
              </div>
            ) : (
              citizenBills.map((bill) => {
                const Icon = getIcon(bill.type);
                const isOverdue = bill.status === 'overdue';
                return (
                  <div
                    key={bill.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedBill === bill.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    } ${isOverdue ? 'bg-destructive/5' : ''}`}
                    onClick={() => setSelectedBill(bill.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        bill.type === 'electricity' ? 'bg-yellow-100 text-yellow-600' :
                        bill.type === 'gas' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{getTypeLabel(bill.type)}</span>
                          {isOverdue && (
                            <span className="px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded">
                              {text.overdue}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {text.dueDate}: {new Date(bill.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{bill.amount.toLocaleString('en-IN')}</p>
                        <p className="text-sm text-muted-foreground">{bill.units} {text.units}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Payment Method & Summary */}
        <div className="space-y-6">
          {selectedBillData && (
            <>
              {/* Bill Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bill Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">{text.billDate}</span>
                    <span>{new Date(selectedBillData.billDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">{text.dueDate}</span>
                    <span>{new Date(selectedBillData.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">{text.units}</span>
                    <span>{selectedBillData.units}</span>
                  </div>
                  <div className="flex justify-between py-2 text-xl font-bold">
                    <span>{text.amount}</span>
                    <span>₹{selectedBillData.amount.toLocaleString('en-IN')}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{text.selectPayment}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { id: 'upi', label: text.upi, icon: Smartphone },
                    { id: 'card', label: text.card, icon: CreditCard },
                    { id: 'netbanking', label: text.netbanking, icon: Building }
                  ].map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4 ${
                        paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <method.icon className="w-6 h-6 text-primary" />
                      <span className="font-medium">{method.label}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pay Button */}
              <Button
                className="w-full h-16 text-xl"
                disabled={!paymentMethod || processing}
                onClick={handlePayment}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    {text.processing}
                  </>
                ) : (
                  <>
                    {text.payNow} - ₹{selectedBillData.amount.toLocaleString('en-IN')}
                  </>
                )}
              </Button>
            </>
          )}

          {/* Previous Payments */}
          {selectedBillData && selectedBillData.previousPayments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5" />
                  {text.previousPayments}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedBillData.previousPayments.slice(0, 3).map((payment, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-2 border-b last:border-0">
                      <span className="text-muted-foreground">{payment.date}</span>
                      <span className="font-mono">{payment.transactionId}</span>
                      <span className="font-medium">₹{payment.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillPaymentModule;
