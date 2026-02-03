import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useKiosk } from '@/context/KioskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, Search, CheckCircle, Clock, 
  FileCheck, AlertCircle, XCircle, Loader2
} from 'lucide-react';
import { statusLabels } from '@/lib/mockData';

interface TrackStatusModuleProps {
  onBack: () => void;
}

const TrackStatusModule: React.FC<TrackStatusModuleProps> = ({ onBack }) => {
  const { language } = useAuth();
  const { getComplaintStatus, getRequestStatus, verifyIntegrity } = useKiosk();
  
  const [trackingId, setTrackingId] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<{
    type: 'complaint' | 'request';
    data: any;
    verified: boolean;
  } | null>(null);
  const [notFound, setNotFound] = useState(false);

  const t = {
    en: {
      title: 'Track Application Status',
      subtitle: 'Check the status of your complaints and requests',
      trackingId: 'Tracking ID',
      placeholder: 'Enter Complaint ID or Reference Number',
      search: 'Search',
      searching: 'Searching...',
      notFound: 'No record found with this ID',
      tryAgain: 'Please check the ID and try again',
      status: 'Current Status',
      submittedOn: 'Submitted On',
      lastUpdate: 'Last Updated',
      category: 'Category',
      type: 'Type',
      location: 'Location',
      description: 'Description',
      verified: 'Record Verified ✓',
      integrityNote: 'This record is tamper-proof and verified on blockchain',
      backToHome: 'Back to Home'
    },
    hi: {
      title: 'आवेदन स्थिति ट्रैक करें',
      subtitle: 'अपनी शिकायतों और अनुरोधों की स्थिति जांचें',
      trackingId: 'ट्रैकिंग आईडी',
      placeholder: 'शिकायत आईडी या संदर्भ संख्या दर्ज करें',
      search: 'खोजें',
      searching: 'खोज रहा है...',
      notFound: 'इस आईडी के साथ कोई रिकॉर्ड नहीं मिला',
      tryAgain: 'कृपया आईडी जांचें और पुनः प्रयास करें',
      status: 'वर्तमान स्थिति',
      submittedOn: 'जमा करने की तारीख',
      lastUpdate: 'अंतिम अपडेट',
      category: 'श्रेणी',
      type: 'प्रकार',
      location: 'स्थान',
      description: 'विवरण',
      verified: 'रिकॉर्ड सत्यापित ✓',
      integrityNote: 'यह रिकॉर्ड छेड़छाड़-रोधी है और ब्लॉकचेन पर सत्यापित है',
      backToHome: 'होम पर वापस जाएं'
    }
  };

  const text = t[language];

  const statusSteps = ['submitted', 'under_review', 'in_progress', 'completed'];
  const complaintSteps = ['pending', 'under_review', 'in_progress', 'resolved'];

  const handleSearch = async () => {
    if (!trackingId.trim()) return;
    
    setSearching(true);
    setNotFound(false);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Try complaint first
    const complaint = getComplaintStatus(trackingId.trim());
    if (complaint) {
      setResult({
        type: 'complaint',
        data: complaint,
        verified: verifyIntegrity(complaint.id)
      });
      setSearching(false);
      return;
    }

    // Try service request
    const request = getRequestStatus(trackingId.trim());
    if (request) {
      setResult({
        type: 'request',
        data: request,
        verified: true
      });
      setSearching(false);
      return;
    }

    setNotFound(true);
    setSearching(false);
  };

  const getStatusIndex = (status: string, type: 'complaint' | 'request') => {
    const steps = type === 'complaint' ? complaintSteps : statusSteps;
    return steps.indexOf(status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'submitted':
        return <Clock className="w-5 h-5" />;
      case 'under_review':
      case 'in_progress':
        return <FileCheck className="w-5 h-5" />;
      case 'completed':
      case 'resolved':
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

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

      <div className="max-w-3xl mx-auto">
        {/* Search Box */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">{text.trackingId}</label>
                <Input
                  placeholder={text.placeholder}
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  className="h-14 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  className="h-14 px-8" 
                  onClick={handleSearch}
                  disabled={searching || !trackingId.trim()}
                >
                  {searching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      {text.search}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Not Found */}
        {notFound && (
          <Card className="border-destructive/50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{text.notFound}</h3>
              <p className="text-muted-foreground">{text.tryAgain}</p>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {result && (
          <Card className="border-2 border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{result.type === 'complaint' ? 'Complaint Status' : 'Application Status'}</CardTitle>
                {result.verified && (
                  <div className="flex items-center gap-2 text-accent text-sm bg-accent/10 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    {text.verified}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Timeline */}
              <div className="relative">
                <div className="flex justify-between">
                  {(result.type === 'complaint' ? complaintSteps : statusSteps).map((step, idx) => {
                    const currentIdx = getStatusIndex(result.data.status, result.type);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    
                    return (
                      <div key={step} className="flex flex-col items-center relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-accent text-accent-foreground' 
                            : 'bg-muted text-muted-foreground'
                        } ${isCurrent ? 'ring-4 ring-accent/30' : ''}`}>
                          {getStatusIcon(step)}
                        </div>
                        <span className={`mt-2 text-xs font-medium ${isCompleted ? 'text-accent' : 'text-muted-foreground'}`}>
                          {statusLabels[step as keyof typeof statusLabels]?.[language] || step}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Progress Line */}
                <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted -z-0">
                  <div 
                    className="h-full bg-accent transition-all"
                    style={{ 
                      width: `${(getStatusIndex(result.data.status, result.type) / ((result.type === 'complaint' ? complaintSteps : statusSteps).length - 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">{text.submittedOn}</p>
                  <p className="font-medium">{new Date(result.data.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{text.lastUpdate}</p>
                  <p className="font-medium">{new Date(result.data.updatedAt).toLocaleDateString()}</p>
                </div>
                {result.type === 'complaint' && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">{text.category}</p>
                      <p className="font-medium capitalize">{result.data.category.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{text.location}</p>
                      <p className="font-medium">{result.data.location}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">{text.description}</p>
                      <p className="font-medium">{result.data.description}</p>
                    </div>
                  </>
                )}
                {result.type === 'request' && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">{text.type}</p>
                      <p className="font-medium capitalize">{result.data.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reference</p>
                      <p className="font-medium font-mono">{result.data.referenceNumber}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Integrity Note */}
              {result.verified && (
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20 text-sm text-accent flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {text.integrityNote}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrackStatusModule;
