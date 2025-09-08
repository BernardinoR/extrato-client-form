import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const SubmissionResult = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const message = searchParams.get('message') || '';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {success ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {success ? 'Sucesso!' : 'Erro!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {success 
              ? message || 'Formulário enviado com sucesso!'
              : message || 'Ocorreu um erro ao enviar o formulário.'
            }
          </p>
          <Button asChild className="w-full">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Formulário
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionResult;