import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, Check, X } from "lucide-react";

interface InstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutions: string[];
  onUpdate: (institutions: string[]) => void;
}

export const InstitutionModal = ({ isOpen, onClose, institutions, onUpdate }: InstitutionModalProps) => {
  const [localInstitutions, setLocalInstitutions] = useState<string[]>(institutions);
  const [newInstitution, setNewInstitution] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const handleAdd = () => {
    if (newInstitution.trim() && !localInstitutions.includes(newInstitution.trim())) {
      setLocalInstitutions([...localInstitutions, newInstitution.trim()]);
      setNewInstitution("");
    }
  };

  const handleDelete = (index: number) => {
    setLocalInstitutions(localInstitutions.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(localInstitutions[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingValue.trim()) {
      const updated = [...localInstitutions];
      updated[editingIndex] = editingValue.trim();
      setLocalInstitutions(updated);
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleSave = () => {
    onUpdate(localInstitutions);
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
            {localInstitutions.map((institution, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                {editingIndex === index ? (
                  <>
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                    />
                    <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{institution}</span>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(index)}>
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