import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "./FileUpload";
import { InstitutionSelect } from "./InstitutionSelect";
import { CompetenceInput } from "./CompetenceInput";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  files: FileList | null;
  cliente: string;
  tipos: string[];
  instituicao: string;
  competencia: string;
}

interface FormErrors {
  files?: string;
  cliente?: string;
  tipos?: string;
  instituicao?: string;
}

export const ExtratosForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    files: null,
    cliente: "",
    tipos: [],
    instituicao: "",
    competencia: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientes, setClientes] = useState<string[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const { data, error } = await supabase.rpc('get_unique_clients');
        
        if (error) {
          console.error('Error fetching clients:', error);
          toast({
            title: "Erro",
            description: "Erro ao carregar clientes.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          const clienteNames = data.map((item: any) => item.Cliente).filter(Boolean);
          setClientes(clienteNames);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar clientes.",
          variant: "destructive",
        });
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, [toast]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.files || formData.files.length === 0) {
      newErrors.files = "Este campo é obrigatório";
    }

    if (!formData.cliente) {
      newErrors.cliente = "Este campo é obrigatório";
    }

    if (formData.tipos.length === 0) {
      newErrors.tipos = "Selecione pelo menos um tipo";
    }

    if (!formData.instituicao) {
      newErrors.instituicao = "This field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTipoChange = (tipo: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tipos: checked 
        ? [...prev.tipos, tipo]
        : prev.tipos.filter(t => t !== tipo)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add files
      if (formData.files) {
        console.log('Adding files to FormData:', formData.files.length, 'files');
        Array.from(formData.files).forEach((file, index) => {
          console.log(`Adding file ${index}:`, file.name, file.size, 'bytes');
          formDataToSend.append('data', file);
          formDataToSend.append(`filename_${index}`, file.name);
          formDataToSend.append(`mimetype_${index}`, file.type);
          formDataToSend.append(`size_${index}`, file.size.toString());
        });
      } else {
        console.log('No files to add');
      }

      // Add other form data
      formDataToSend.append('cliente', formData.cliente);
      formDataToSend.append('tipos', JSON.stringify(formData.tipos));
      formDataToSend.append('instituicao', formData.instituicao);
      formDataToSend.append('competencia', formData.competencia);
      
      console.log('Sending request to webhook...');

      const response = await fetch('https://workflows.snowealth.com.br/webhook-test/extrato', {
        method: 'POST',
        body: formDataToSend,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Formulário enviado com sucesso.",
        });
        
        // Reset form
        setFormData({
          files: null,
          cliente: "",
          tipos: [],
          instituicao: "",
          competencia: "",
        });
        setErrors({});
      } else {
        console.error('HTTP Error:', response.status, response.statusText);
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Fetch error details:', error);
      
      let errorMessage = "Erro ao enviar formulário. Tente novamente.";
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "Erro de conectividade. Verifique sua conexão com a internet ou tente novamente.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-foreground">
              Extrato Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <FileUpload
                onFileChange={(files) => setFormData(prev => ({ ...prev, files }))}
                error={errors.files}
              />

              {/* Cliente Select */}
              <div className="space-y-2">
                <Label htmlFor="cliente" className="text-sm font-medium text-foreground">
                  Clientes <span className="text-primary">*</span>
                </Label>
                <Select value={formData.cliente} onValueChange={(value) => setFormData(prev => ({ ...prev, cliente: value }))} disabled={loadingClientes}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingClientes ? "Carregando..." : "Select an option..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cliente && <p className="text-destructive text-sm">{errors.cliente}</p>}
              </div>

              {/* Tipo Checkboxes */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Tipo <span className="text-primary">*</span>
                </Label>
                <div className="space-y-3">
                  {["Rebalanceamento", "Batedor", "Performance"].map((tipo) => (
                    <div key={tipo} className="flex items-center space-x-2">
                      <Checkbox
                        id={tipo}
                        checked={formData.tipos.includes(tipo)}
                        onCheckedChange={(checked) => handleTipoChange(tipo, checked as boolean)}
                      />
                      <Label htmlFor={tipo} className="text-sm font-normal">
                        {tipo}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.tipos && <p className="text-destructive text-sm">{errors.tipos}</p>}
              </div>

              {/* Institution Select */}
              <InstitutionSelect
                value={formData.instituicao}
                onValueChange={(value) => setFormData(prev => ({ ...prev, instituicao: value }))}
                error={errors.instituicao}
              />

              {/* Competence Input */}
              <CompetenceInput
                value={formData.competencia}
                onChange={(value) => setFormData(prev => ({ ...prev, competencia: value }))}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};