import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useKiosk } from '@/context/KioskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, Zap, Flame, Droplets, 
  User, MapPin, Upload, CheckCircle, Loader2, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { serviceTypes } from '@/lib/mockData';

interface NewServiceModuleProps {
  onBack: () => void;
}

const NewServiceModule: React.FC<NewServiceModuleProps> = ({ onBack }) => {
  const { language, citizen, updateCitizen } = useAuth();
  const { submitServiceRequest } = useKiosk();
  
  const [serviceType, setServiceType] = useState<string>('');
  const [applicantName, setApplicantName] = useState(citizen?.name || '');
  const [address, setAddress] = useState(citizen?.address || '');
  const [idProofType, setIdProofType] = useState('');
  const [idUploaded, setIdUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  const t = {
    en: {
      title: 'New Service Request',
      subtitle: 'Apply for new utility connections',
      selectService: 'Select Service Type',
      electricity: 'New Electricity Connection',
      gas: 'New Gas Connection',
      water: 'New Water Pipeline',
      applicantName: 'Applicant Name',
      address: 'Installation Address',
      idProof: 'ID Proof Type',
      selectIdProof: 'Select ID Proof',
      aadhaar: 'Aadhaar Card',
      pan: 'PAN Card',
      voter: 'Voter ID',
      passport: 'Passport',
      uploadId: 'Upload ID Proof',
      uploaded: 'Document Uploaded',
      submit: 'Submit Application',
      submitting: 'Submitting...',
      success: 'Application Submitted Successfully!',
      refNumber: 'Reference Number',
      trackNote: 'Use this reference number to track your application',
      newRequest: 'Submit Another Request',
      backToHome: 'Back to Home',
      estimatedTime: 'Estimated Processing Time: 7-10 working days',
      pointsAwarded: '+10 Suvidha Points awarded'
    },
    hi: {
      title: 'नई सेवा अनुरोध',
      subtitle: 'नए उपयोगिता कनेक्शन के लिए आवेदन करें',
      selectService: 'सेवा प्रकार चुनें',
      electricity: 'नया बिजली कनेक्शन',
      gas: 'नया गैस कनेक्शन',
      water: 'नया पानी पाइपलाइन',
      applicantName: 'आवेदक का नाम',
      address: 'स्थापना पता',
      idProof: 'पहचान प्रमाण प्रकार',
      selectIdProof: 'पहचान प्रमाण चुनें',
      aadhaar: 'आधार कार्ड',
      pan: 'पैन कार्ड',
      voter: 'मतदाता पहचान पत्र',
      passport: 'पासपोर्ट',
      uploadId: 'पहचान प्रमाण अपलोड करें',
      uploaded: 'दस्तावेज़ अपलोड किया गया',
      submit: 'आवेदन जमा करें',
      submitting: 'जमा हो रहा है...',
      success: 'आवेदन सफलतापूर्वक जमा!',
      refNumber: 'संदर्भ संख्या',
      trackNote: 'अपने आवेदन को ट्रैक करने के लिए इस संदर्भ संख्या का उपयोग करें',
      newRequest: 'एक और अनुरोध जमा करें',
      backToHome: 'होम पर वापस जाएं',
      estimatedTime: 'अनुमानित प्रसंस्करण समय: 7-10 कार्य दिवस',
      pointsAwarded: '+10 सुविधा अंक मिले'
    }
  };

  const text = t[language];

  const services = [
    { id: 'new_electricity', icon: Zap, label: text.electricity },
    { id: 'new_gas', icon: Flame, label: text.gas },
    { id: 'new_water', icon: Droplets, label: text.water }
  ];

  const idProofs = [
    { id: 'aadhaar', label: text.aadhaar },
    { id: 'pan', label: text.pan },
    { id: 'voter', label: text.voter },
    { id: 'passport', label: text.passport }
  ];

  const handleUpload = () => {
    setTimeout(() => {
      setIdUploaded(true);
      toast.success(language === 'en' ? 'Document uploaded successfully' : 'दस्तावेज़ सफलतापूर्वक अपलोड किया गया');
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!serviceType || !applicantName || !address || !idProofType) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }

    setSubmitting(true);
    
    try {
      const refNum = await submitServiceRequest({
        citizenId: citizen?.id || 'CIT001',
        type: serviceType as 'new_electricity' | 'new_gas' | 'new_water',
        applicantName,
        address,
        idProofType
      });
      
      if (updateCitizen) {
        updateCitizen({ points: (citizen?.points || 0) + 10 });
        toast.success(text.pointsAwarded);
      }

      setReferenceNumber(refNum);
      // toast.success(text.success); // Shown in UI instead
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to submit request' : 'अनुरोध जमा करने में विफल');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setServiceType('');
    setApplicantName(citizen?.name || '');
    setAddress(citizen?.address || '');
    setIdProofType('');
    setIdUploaded(false);
    setReferenceNumber(null);
  };

  // Success Screen
  if (referenceNumber) {
    return (
      <div className="p-8 max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
        <Card className="border border-blue-100 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6 border border-blue-100">
              <CheckCircle className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{text.success}</h2>
            
            <div className="bg-slate-50 p-6 rounded-lg my-6 border border-slate-200">
              <p className="text-sm text-slate-500 mb-2">{text.refNumber}</p>
              <p className="text-3xl font-mono font-bold text-blue-700">{referenceNumber}</p>
            </div>

            <p className="text-slate-600 mb-2">{text.trackNote}</p>
            <p className="text-sm text-blue-600 mb-8 font-medium bg-blue-50 py-2 px-4 rounded-full inline-block">
              {text.estimatedTime}
            </p>

            <div className="flex gap-4">
              <Button className="flex-1 h-14 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50" variant="secondary" onClick={resetForm}>
                {text.newRequest}
              </Button>
              <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white" onClick={onBack}>
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
        <Button variant="ghost" size="icon" onClick={onBack} className="h-12 w-12 hover:bg-blue-50 hover:text-blue-600">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{text.title}</h2>
          <p className="text-slate-500">{text.subtitle}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="border-slate-200 shadow-lg">
          <CardContent className="p-8 space-y-8">
            {/* Service Type Selection */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{text.selectService} *</label>
              <div className="grid grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all text-center group ${
                      serviceType === service.id
                        ? 'border-blue-600 bg-blue-50/50 shadow-md'
                        : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                    }`}
                    onClick={() => setServiceType(service.id)}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                      serviceType === service.id 
                        ? 'bg-blue-100 text-blue-600' 
                        : service.id === 'new_electricity' ? 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100'
                        : service.id === 'new_gas' ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-100'
                        : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                    }`}>
                      <service.icon className="w-8 h-8" />
                    </div>
                    <span className={`font-medium text-sm ${serviceType === service.id ? 'text-blue-700' : 'text-slate-600'}`}>
                      {service.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicant Name */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                {text.applicantName} *
              </label>
              <Input
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="h-14 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                placeholder="Enter full name"
              />
            </div>

            {/* Address */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                {text.address} *
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-14 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                placeholder="Enter installation address"
              />
            </div>

            {/* ID Proof Selection */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                {text.idProof} *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {idProofs.map((proof) => (
                  <div
                    key={proof.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      idProofType === proof.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                        : 'border-slate-100 hover:border-blue-200 text-slate-600'
                    }`}
                    onClick={() => setIdProofType(proof.id)}
                  >
                    <span className="text-sm">{proof.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload ID Proof */}
            {idProofType && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                {!idUploaded ? (
                  <Button variant="outline" className="h-16 w-full border-dashed border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-600" onClick={handleUpload}>
                    <Upload className="w-5 h-5 mr-2" />
                    {text.uploadId}
                  </Button>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-700">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">{text.uploaded}</span>
                    <Button variant="ghost" size="sm" className="ml-auto text-blue-600 hover:bg-blue-100" onClick={() => setIdUploaded(false)}>
                      Change
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              className="w-full h-16 text-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 mt-4"
              disabled={!serviceType || !applicantName || !address || !idProofType || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  {text.submitting}
                </>
              ) : (
                text.submit
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewServiceModule;
