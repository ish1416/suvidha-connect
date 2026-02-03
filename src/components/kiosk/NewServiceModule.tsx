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
  const { language, citizen } = useAuth();
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
      estimatedTime: 'Estimated Processing Time: 7-10 working days'
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
      estimatedTime: 'अनुमानित प्रसंस्करण समय: 7-10 कार्य दिवस'
    }
  };

  const text = t[language];

  const services = [
    { id: 'new_electricity', icon: Zap, label: text.electricity, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'new_gas', icon: Flame, label: text.gas, color: 'bg-orange-100 text-orange-600' },
    { id: 'new_water', icon: Droplets, label: text.water, color: 'bg-blue-100 text-blue-600' }
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
      
      setReferenceNumber(refNum);
      toast.success(text.success);
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
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="border-2 border-accent shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-accent mb-2">{text.success}</h2>
            
            <div className="bg-muted p-6 rounded-lg my-6">
              <p className="text-sm text-muted-foreground mb-2">{text.refNumber}</p>
              <p className="text-2xl font-mono font-bold text-primary">{referenceNumber}</p>
            </div>

            <p className="text-muted-foreground mb-2">{text.trackNote}</p>
            <p className="text-sm text-secondary mb-8">{text.estimatedTime}</p>

            <div className="flex gap-4">
              <Button className="flex-1 h-14" variant="secondary" onClick={resetForm}>
                {text.newRequest}
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

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-8 space-y-6">
            {/* Service Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">{text.selectService} *</label>
              <div className="grid grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      serviceType === service.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setServiceType(service.id)}
                  >
                    <div className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mx-auto mb-3`}>
                      <service.icon className="w-8 h-8" />
                    </div>
                    <span className="font-medium text-sm">{service.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicant Name */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                {text.applicantName} *
              </label>
              <Input
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="h-14 text-base"
              />
            </div>

            {/* Address */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {text.address} *
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-14 text-base"
              />
            </div>

            {/* ID Proof Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {text.idProof} *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {idProofs.map((proof) => (
                  <div
                    key={proof.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      idProofType === proof.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setIdProofType(proof.id)}
                  >
                    <span className="text-sm font-medium">{proof.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload ID Proof */}
            {idProofType && (
              <div className="space-y-3">
                {!idUploaded ? (
                  <Button variant="outline" className="h-14 w-full" onClick={handleUpload}>
                    <Upload className="w-5 h-5 mr-2" />
                    {text.uploadId}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg text-accent">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{text.uploaded}</span>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              className="w-full h-16 text-xl"
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
