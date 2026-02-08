import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useKiosk } from '@/context/KioskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, Zap, Flame, Droplets, Trash2, 
  MapPin, Upload, CheckCircle, Loader2, Shield, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { complaintCategories } from '@/lib/mockData';

interface ComplaintModuleProps {
  onBack: () => void;
}

const ComplaintModule: React.FC<ComplaintModuleProps> = ({ onBack }) => {
  const { language, citizen, updateCitizen } = useAuth();
  const { submitComplaint } = useKiosk();
  
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [complaintId, setComplaintId] = useState<string | null>(null);

  const t = {
    en: {
      title: 'Register Complaint',
      subtitle: 'Report issues with civic utilities',
      category: 'Complaint Category',
      selectCategory: 'Select a category',
      power: 'Power Outage',
      gas: 'Gas Leakage',
      water: 'Water Supply Issue',
      waste: 'Waste Management',
      description: 'Description',
      descriptionPlaceholder: 'Describe the issue in detail...',
      location: 'Location / Zone',
      locationPlaceholder: 'Enter your area, sector, or zone',
      attachments: 'Attachments (Optional)',
      uploadPhoto: 'Upload Photo/Document',
      submit: 'Submit Complaint',
      submitting: 'Submitting...',
      success: 'Complaint Registered Successfully!',
      complaintId: 'Complaint ID',
      trackNote: 'Use this ID to track your complaint status',
      newComplaint: 'Register Another Complaint',
      backToHome: 'Back to Home',
      securityNote: 'Your complaint is encrypted and tamper-proof',
      integrityHash: 'Integrity Hash',
      fraudPrevention: 'Anti-spam protection active'
    },
    hi: {
      title: 'शिकायत दर्ज करें',
      subtitle: 'नागरिक उपयोगिताओं के साथ समस्याओं की रिपोर्ट करें',
      category: 'शिकायत श्रेणी',
      selectCategory: 'एक श्रेणी चुनें',
      power: 'बिजली गुल',
      gas: 'गैस रिसाव',
      water: 'जल आपूर्ति समस्या',
      waste: 'अपशिष्ट प्रबंधन',
      description: 'विवरण',
      descriptionPlaceholder: 'समस्या का विस्तार से वर्णन करें...',
      location: 'स्थान / ज़ोन',
      locationPlaceholder: 'अपना क्षेत्र, सेक्टर या ज़ोन दर्ज करें',
      attachments: 'अनुलग्नक (वैकल्पिक)',
      uploadPhoto: 'फोटो/दस्तावेज़ अपलोड करें',
      submit: 'शिकायत दर्ज करें',
      submitting: 'जमा हो रहा है...',
      success: 'शिकायत सफलतापूर्वक दर्ज!',
      complaintId: 'शिकायत आईडी',
      trackNote: 'अपनी शिकायत की स्थिति ट्रैक करने के लिए इस आईडी का उपयोग करें',
      newComplaint: 'एक और शिकायत दर्ज करें',
      backToHome: 'होम पर वापस जाएं',
      securityNote: 'आपकी शिकायत एन्क्रिप्टेड और छेड़छाड़-रोधी है',
      integrityHash: 'अखंडता हैश',
      fraudPrevention: 'एंटी-स्पैम सुरक्षा सक्रिय'
    }
  };

  const text = t[language];

  const categoryIcons: Record<string, React.ElementType> = {
    power_outage: Zap,
    gas_leakage: Flame,
    water_supply: Droplets,
    waste_management: Trash2
  };

  const handleFileUpload = () => {
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setAttachments([...attachments, `attachment_${Date.now()}.jpg`]);
      setUploading(false);
      toast.success(language === 'en' ? 'File uploaded' : 'फ़ाइल अपलोड की गई');
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!category || !description || !location) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }

    if (description.length < 20) {
      toast.error(language === 'en' ? 'Please provide a more detailed description' : 'कृपया अधिक विस्तृत विवरण प्रदान करें');
      return;
    }

    setSubmitting(true);
    
    try {
      const id = await submitComplaint({
        citizenId: citizen?.id || 'CIT001',
        category: category as 'power_outage' | 'gas_leakage' | 'water_supply' | 'waste_management',
        description,
        location,
        status: 'pending',
        attachments
      });
      
      setComplaintId(id);
      
      // Award Suvidha Points for civic engagement
      if (citizen && updateCitizen) {
        updateCitizen({ points: (citizen.points || 0) + 30 });
        toast.success(`${text.success} (+30 Points)`);
      } else {
        toast.success(text.success);
      }
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to submit complaint' : 'शिकायत दर्ज करने में विफल');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCategory('');
    setDescription('');
    setLocation('');
    setAttachments([]);
    setComplaintId(null);
  };

  // Success Screen
  if (complaintId) {
    return (
      <div className="p-8 max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
        <Card className="border border-blue-100 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6 border border-blue-100">
              <CheckCircle className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{text.success}</h2>
            
            <div className="bg-slate-50 p-6 rounded-lg my-6 border border-slate-200">
              <p className="text-sm text-slate-500 mb-2">{text.complaintId}</p>
              <p className="text-3xl font-mono font-bold text-blue-700">{complaintId}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6 bg-blue-50/50 p-2 rounded-full w-fit mx-auto px-4">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>{text.securityNote}</span>
            </div>

            <p className="text-slate-600 mb-8">{text.trackNote}</p>

            <div className="flex gap-4">
              <Button className="flex-1 h-14 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50" variant="secondary" onClick={resetForm}>
                {text.newComplaint}
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
        <Button variant="ghost" size="icon" onClick={onBack} className="h-12 w-12 rounded-full hover:bg-blue-50 text-blue-600">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{text.title}</h2>
          <p className="text-slate-500">{text.subtitle}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-8 space-y-6">
            {/* Category Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">{text.category} *</label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(complaintCategories).map(([key, labels]) => {
                  const Icon = categoryIcons[key];
                  const isSelected = category === key;
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                      onClick={() => setCategory(key)}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-white text-blue-600 shadow-sm' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{labels[language]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">{text.description} *</label>
              <Textarea
                placeholder={text.descriptionPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-32 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500">{description.length}/500 characters</p>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                {text.location} *
              </label>
              <Input
                placeholder={text.locationPlaceholder}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-14 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Attachments */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">{text.attachments}</label>
              <div className="flex flex-wrap gap-3">
                {attachments.map((file, idx) => (
                  <div key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    {file}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleFileUpload}
                  disabled={uploading}
                  className="h-12 border-slate-300 hover:bg-slate-50 text-slate-700"
                >
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-5 h-5 mr-2" />
                  )}
                  {text.uploadPhoto}
                </Button>
              </div>
            </div>

            {/* Fraud Prevention Notice */}
            <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-slate-600">
              <AlertTriangle className="w-4 h-4 text-blue-500" />
              {text.fraudPrevention}
            </div>

            {/* Submit Button */}
            <Button
              className="w-full h-16 text-xl bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
              disabled={!category || !description || !location || submitting}
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

export default ComplaintModule;
