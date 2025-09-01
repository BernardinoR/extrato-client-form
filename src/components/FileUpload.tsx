import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  onFileChange: (files: FileList | null) => void;
  error?: string;
}

export const FileUpload = ({ onFileChange, error }: FileUploadProps) => {
  const [fileName, setFileName] = useState<string>("Nenhum arquivo escolhido");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onFileChange(files);
    
    if (files && files.length > 0) {
      if (files.length === 1) {
        setFileName(files[0].name);
      } else {
        setFileName(`${files.length} arquivos selecionados`);
      }
    } else {
      setFileName("Nenhum arquivo escolhido");
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload" className="text-sm font-medium text-foreground">
        data <span className="text-primary">*</span>
      </Label>
      <div className="flex items-center gap-4">
        <Input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => document.getElementById("file-upload")?.click()}
          className="border border-input"
        >
          Escolher arquivos
        </Button>
        <span className="text-muted-foreground text-sm">{fileName}</span>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};