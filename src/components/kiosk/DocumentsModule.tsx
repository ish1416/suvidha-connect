import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useKiosk } from '@/context/KioskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, Download, Receipt, FileText, 
  Zap, Flame, Droplets, Calendar, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface DocumentsModuleProps {
  onBack: () => void;
}

const DocumentsModule: React.FC<DocumentsModuleProps> = ({ onBack }) => {
  const { language, citizen } = useAuth();
  const { bills } = useKiosk();

  const t = {
    en: {
      title: 'Download Documents',
      subtitle: 'Access your receipts and certificates',
      paymentReceipts: 'Payment Receipts',
      noReceipts: 'No receipts available',
      certificates: 'Certificates',
      serviceSummary: 'Service Summary',
      download: 'Download',
      print: 'Print',
      transactionId: 'Transaction ID',
      amount: 'Amount',
      date: 'Date',
      service: 'Service',
      connectionCertificate: 'Connection Certificate',
      complianceCertificate: 'Compliance Certificate',
      usageSummary: 'Annual Usage Summary',
      backToHome: 'Back to Home'
    },
    hi: {
      title: 'दस्तावेज़ डाउनलोड करें',
      subtitle: 'अपनी रसीदें और प्रमाण पत्र एक्सेस करें',
      paymentReceipts: 'भुगतान रसीदें',
      noReceipts: 'कोई रसीदें उपलब्ध नहीं',
      certificates: 'प्रमाण पत्र',
      serviceSummary: 'सेवा सारांश',
      download: 'डाउनलोड',
      print: 'प्रिंट',
      transactionId: 'लेनदेन आईडी',
      amount: 'राशि',
      date: 'तारीख',
      service: 'सेवा',
      connectionCertificate: 'कनेक्शन प्रमाण पत्र',
      complianceCertificate: 'अनुपालन प्रमाण पत्र',
      usageSummary: 'वार्षिक उपयोग सारांश',
      backToHome: 'होम पर वापस जाएं'
    }
  };

  const text = t[language];

  const getIcon = (type: string) => {
    switch (type) {
      case 'electricity': return Zap;
      case 'gas': return Flame;
      case 'water': return Droplets;
      default: return FileText;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'electricity': return language === 'en' ? 'Electricity' : 'बिजली';
      case 'gas': return language === 'en' ? 'Gas' : 'गैस';
      case 'water': return language === 'en' ? 'Water' : 'पानी';
      default: return type;
    }
  };

  // Get all payments from bills
  const allPayments = bills.flatMap(bill => 
    bill.previousPayments.map(payment => ({
      ...payment,
      type: bill.type
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDownload = (type: string, id?: string) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`SUVIDHA ${type.toUpperCase()}`, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Document ID: ${id || 'DOC-' + Math.floor(Math.random() * 10000)}`, 20, 40);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 50);
    doc.text('This is a certified document from the SUVIDHA Smart City Portal.', 20, 70);
    
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text('Generated via SUVIDHA Kiosk System', 105, 285, { align: 'center' });
    
    doc.save(`${type.replace(/\s+/g, '_')}.pdf`);
    toast.success(language === 'en' ? `Downloading ${type}...` : `${type} डाउनलोड हो रहा है...`);
  };

  const handlePrint = (type: string) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`SUVIDHA ${type.toUpperCase()}`, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('PRINT PREVIEW', 105, 30, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 50);
    doc.text('This is a certified document.', 20, 70);
    
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text('Generated via SUVIDHA Kiosk System', 105, 285, { align: 'center' });
    
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
    toast.success(language === 'en' ? `Opening Print Preview for ${type}...` : `${type} प्रिंट प्रीव्यू खुल रहा है...`);
  };

  const certificates = [
    { id: 'conn', title: text.connectionCertificate, icon: CheckCircle },
    { id: 'comp', title: text.complianceCertificate, icon: FileText },
    { id: 'usage', title: text.usageSummary, icon: Calendar }
  ];

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
        {/* Payment Receipts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              {text.paymentReceipts}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allPayments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{text.noReceipts}</p>
            ) : (
              allPayments.slice(0, 5).map((payment, idx) => {
                const Icon = getIcon(payment.type);
                return (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      payment.type === 'electricity' ? 'bg-yellow-100 text-yellow-600' :
                      payment.type === 'gas' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{getTypeLabel(payment.type)}</p>
                      <p className="text-xs text-muted-foreground font-mono">{payment.transactionId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{payment.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-muted-foreground">{payment.date}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => handleDownload('Receipt', payment.transactionId)}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Certificates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {text.certificates}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <cert.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{cert.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleDownload(cert.title)}>
                      <Download className="w-4 h-4 mr-1" />
                      {text.download}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handlePrint(cert.title)}>
                      {text.print}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* User Info Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">
                {language === 'en' ? 'Account Information' : 'खाता जानकारी'}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'en' ? 'Name' : 'नाम'}</span>
                  <span className="font-medium">{citizen?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'en' ? 'Consumer ID' : 'उपभोक्ता आईडी'}</span>
                  <span className="font-mono">{citizen?.consumerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'en' ? 'Address' : 'पता'}</span>
                  <span className="text-right max-w-48">{citizen?.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center mt-8">
        <Button variant="outline" size="lg" onClick={onBack}>
          {text.backToHome}
        </Button>
      </div>
    </div>
  );
};

export default DocumentsModule;
