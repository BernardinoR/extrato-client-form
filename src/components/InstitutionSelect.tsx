import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { InstitutionModal } from "./InstitutionModal";
import { supabase } from "@/integrations/supabase/client";

interface Institution {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface InstitutionSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export const InstitutionSelect = ({ value, onValueChange, error }: InstitutionSelectProps) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('name');

      if (error) throw error;
      setInstitutions(data || []);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    }
  };

  const handleInstitutionsUpdate = () => {
    fetchInstitutions();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="institution" className="text-sm font-medium text-foreground">
        Instituição <span className="text-primary">*</span>
      </Label>
      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {institutions.map((institution) => (
              <SelectItem key={institution.id} value={institution.name}>
                {institution.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setIsModalOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      
      <InstitutionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleInstitutionsUpdate}
      />
    </div>
  );
};