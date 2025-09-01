import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompetenceInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CompetenceInput = ({ value, onChange, error }: CompetenceInputProps) => {
  const formatCompetence = (input: string) => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, '');
    
    // Apply MM/AAAA format
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 6)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCompetence(e.target.value);
    onChange(formatted);
  };

  const isValidFormat = (input: string) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(input);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="competence" className="text-sm font-medium text-foreground">
        Competência
      </Label>
      <Input
        id="competence"
        value={value}
        onChange={handleChange}
        placeholder="MM/AAAA"
        maxLength={7}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      {value && !isValidFormat(value) && value.length >= 7 && (
        <p className="text-destructive text-sm">Formato inválido. Use MM/AAAA</p>
      )}
    </div>
  );
};