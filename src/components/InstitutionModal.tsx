import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Institution {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface InstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const InstitutionModal = ({ isOpen, onClose, onUpdate }: InstitutionModalProps) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [newInstitution, setNewInstitution] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchInstitutions();
    }
  }, [isOpen]);

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
      toast({
        title: "Erro",
        description: "Não foi possível carregar as instituições.",
        variant: "destructive",
      });
    }
  };

  const handleAdd = async () => {
    if (!newInstitution.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('institutions')
        .insert([{ name: newInstitution.trim() }])
        .select()
        .single();

      if (error) throw error;
      
      setInstitutions([...institutions, data]);
      setNewInstitution("");
      toast({
        title: "Sucesso",
        description: "Instituição adicionada com sucesso!",
      });
    } catch (error: any) {
      console.error('Error adding institution:', error);
      toast({
        title: "Erro",
        description: error.message === 'duplicate key value violates unique constraint "institutions_name_key"' 
          ? "Esta instituição já existe." 
          : "Não foi possível adicionar a instituição.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('institutions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setInstitutions(institutions.filter(inst => inst.id !== id));
      toast({
        title: "Sucesso",
        description: "Instituição removida com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting institution:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a instituição.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (institution: Institution) => {
    setEditingId(institution.id);
    setEditingValue(institution.name);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingValue.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('institutions')
        .update({ name: editingValue.trim() })
        .eq('id', editingId)
        .select()
        .single();

      if (error) throw error;
      
      setInstitutions(institutions.map(inst => 
        inst.id === editingId ? data : inst
      ));
      setEditingId(null);
      setEditingValue("");
      toast({
        title: "Sucesso",
        description: "Instituição atualizada com sucesso!",
      });
    } catch (error: any) {
      console.error('Error updating institution:', error);
      toast({
        title: "Erro",
        description: error.message === 'duplicate key value violates unique constraint "institutions_name_key"' 
          ? "Já existe uma instituição com este nome." 
          : "Não foi possível atualizar a instituição.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleSave = () => {
    onUpdate();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Instituições</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Add new institution */}
          <div className="space-y-2">
            <Label htmlFor="new-institution">Adicionar Nova Instituição</Label>
            <div className="flex gap-2">
              <Input
                id="new-institution"
                value={newInstitution}
                onChange={(e) => setNewInstitution(e.target.value)}
                placeholder="Nome da instituição"
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              />
              <Button onClick={handleAdd} size="sm" disabled={!newInstitution.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* List of institutions */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <Label>Instituições Atuais</Label>
            {institutions.map((institution) => (
              <div key={institution.id} className="flex items-center gap-2 p-2 border rounded">
                {editingId === institution.id ? (
                  <>
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      disabled={loading}
                    />
                    <Button size="sm" variant="ghost" onClick={handleSaveEdit} disabled={loading}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit} disabled={loading}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{institution.name}</span>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(institution)} disabled={loading}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(institution.id)} disabled={loading}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};