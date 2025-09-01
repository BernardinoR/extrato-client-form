import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { InstitutionModal } from "./InstitutionModal";

interface InstitutionSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

const defaultInstitutions = [
  "XP",
  "BTG", 
  "Santander",
  "Itau",
  "BB",
  "Smart",
  "Warren",
  "C6",
  "XP Performance",
  "IB"
];

export const InstitutionSelect = ({ value, onValueChange, error }: InstitutionSelectProps) => {
  const [institutions, setInstitutions] = useState<string[]>(defaultInstitutions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInstitutionsUpdate = (newInstitutions: string[]) => {
    setInstitutions(newInstitutions);
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
              <SelectItem key={institution} value={institution}>
                {institution}
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
        institutions={institutions}
        onUpdate={handleInstitutionsUpdate}
      />
    </div>
  );
};