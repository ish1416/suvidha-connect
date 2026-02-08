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
import { toast } from 'sonner';

interface TrackStatusModuleProps {
  onBack: () => void;
}

const TrackStatusModule: React.FC<TrackStatusModuleProps> = ({ onBack }) => {
  const { language, citizen, updateCitizen } = useAuth();
  const { getComplaintStatus, getRequestStatus, verifyIntegrity } = useKiosk();
  
  const [trackingId, setTrackingId] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<{
    type: 'complaint' | 'request';
    data: any;
    verified: boolean;
  } | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);

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

  const getStepIndex = (status: string, type: 'complaint' | 'request') => {
    const steps = type === 'complaint' ? complaintSteps : statusSteps;
    return steps.indexOf(status);
  };

  const getStepLabel = (step: string) => {
    return step.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

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
      
      // Award points for engagement if not already awarded in this session
      if (!pointsAwarded && updateCitizen && citizen) {
        updateCitizen({ points: (citizen.points || 0) + 5 });
        toast.success(language === 'en' ? 'Points Earned: +5 for tracking status' : 'अंक अर्जित: +5 स्थिति ट्रैक करने के लिए');
        setPointsAwarded(true);
      }
      return;
    }

    // Try service request
    const request = getRequestStatus(trackingId.trim());
    if (request) {
      setResult({
        type: 'request',
        data: request,
        verified: verifyIntegrity(request.id)
      });
      setSearching(false);

      // Award points for engagement if not already awarded in this session
      if (!pointsAwarded && updateCitizen && citizen) {
        updateCitizen({ points: (citizen.points || 0) + 5 });
        toast.success(language === 'en' ? 'Points Earned: +5 for tracking status' : 'अंक अर्जित: +5 स्थिति ट्रैक करने के लिए');
        setPointsAwarded(true);
      }
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
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'under_review':
      case 'in_progress':
        return <FileCheck className="w-5 h-5 text-blue-600" />;
      case 'completed':
      case 'resolved':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStepColor = (index: number, currentIndex: number, status: string) => {
    if (status === 'rejected') return index <= currentIndex ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400';
    if (index < currentIndex) return 'bg-green-600 text-white';
    if (index === currentIndex) return 'bg-blue-600 text-white animate-pulse';
    return 'bg-slate-100 text-slate-400';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-12 w-12 hover:bg-blue-50 hover:text-blue-600">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{text.title}</h2>
          <p className="text-slate-500">{text.subtitle}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Search Box */}
        <Card className="mb-8 border-slate-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-700 mb-2 block uppercase tracking-wider">{text.trackingId}</label>
                <Input
                  placeholder={text.placeholder}
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  className="h-14 text-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200" 
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
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">{text.notFound}</h3>
              <p className="text-slate-600">{text.tryAgain}</p>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {result && (
          <Card className="border border-blue-100 shadow-xl animate-in fade-in slide-in-from-bottom-4">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900">{result.type === 'complaint' ? 'Complaint Status' : 'Application Status'}</CardTitle>
                {result.verified && (
                  <div className="flex items-center gap-2 text-blue-700 text-sm bg-blue-50 border border-blue-200 px-3 py-1 rounded-full shadow-sm">
                    <CheckCircle className="w-4 h-4" />
                    {text.verified}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              {/* Status Timeline */}
              <div className="relative px-4">
                <div className="flex justify-between">
                  {(result.type === 'complaint' ? complaintSteps : statusSteps).map((step, idx) => {
                    const currentIdx = getStatusIndex(result.data.status, result.type);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    
                    return (
                      <div key={step} className="flex flex-col items-center relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
                          isCompleted 
                            ? 'bg-blue-600 text-white shadow-blue-200' 
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        } ${isCurrent ? 'ring-4 ring-blue-100 scale-110' : ''}`}>
                          {getStatusIcon(step)}
                        </div>
                        <span className={`mt-3 text-xs font-bold uppercase tracking-wide ${isCompleted ? 'text-blue-700' : 'text-slate-400'}`}>
                          {statusLabels[step as keyof typeof statusLabels]?.[language] || step}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Progress Line */}
                <div className="absolute top-6 left-10 right-10 h-1 bg-slate-100 -z-0 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(getStatusIndex(result.data.status, result.type) / ((result.type === 'complaint' ? complaintSteps : statusSteps).length - 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">{text.submittedOn}</p>
                  <p className="font-semibold text-slate-900">{new Date(result.data.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">{text.lastUpdate}</p>
                  <p className="font-semibold text-slate-900">{new Date(result.data.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600 mb-1 font-medium">Estimated Completion</p>
                  <p className="font-semibold flex items-center gap-2 text-blue-800">
                    <Clock className="w-4 h-4" />
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
                {result.type === 'complaint' && (
                  <>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500 mb-1">{text.category}</p>
                      <p className="font-semibold text-slate-900 capitalize">{result.data.category.replace('_', ' ')}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500 mb-1">{text.location}</p>
                      <p className="font-semibold text-slate-900">{result.data.location}</p>
                    </div>
                    <div className="col-span-2 p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500 mb-1">{text.description}</p>
                      <p className="font-semibold text-slate-900">{result.data.description}</p>
                    </div>
                  </>
                )}
                {result.type === 'request' && (
                  <>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500 mb-1">{text.type}</p>
                      <p className="font-semibold text-slate-900 capitalize">{result.data.type.replace('_', ' ')}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500 mb-1">Reference</p>
                      <p className="font-mono font-semibold text-slate-900">{result.data.referenceNumber}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Integrity Note */}
              {result.verified && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700 flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium">{text.integrityNote}</span>
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
