import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Settings, AlertTriangle } from 'lucide-react';

const AIModelConfig = () => {
  const [models, setModels] = useState([
    {
      id: 1,
      name: "GPT-4",
      status: "active",
      maxTokens: 8000,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      costPerToken: 0.00003,
      isEnabled: true,
    },
    {
      id: 2,
      name: "GPT-3.5-Turbo",
      status: "active",
      maxTokens: 4000,
      temperature: 0.8,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      costPerToken: 0.00001,
      isEnabled: true,
    }
  ]);

  const [selectedModel, setSelectedModel] = useState(null);

  const handleModelSelect = (modelId) => {
    const model = models.find(m => m.id === parseInt(modelId));
    setSelectedModel(model);
  };

  const handleModelUpdate = (field, value) => {
    if (!selectedModel) return;

    const updatedModels = models.map(model => 
      model.id === selectedModel.id 
        ? { ...model, [field]: value }
        : model
    );

    setModels(updatedModels);
    setSelectedModel({ ...selectedModel, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Model Configuration</h1>
          <p className="text-muted-foreground">
            Configure and manage AI model parameters and settings
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Models</CardTitle>
            <CardDescription>Select a model to configure its settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {models.map(model => (
              <div
                key={model.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedModel?.id === model.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
                onClick={() => handleModelSelect(model.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">{model.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Max tokens: {model.maxTokens}
                      </p>
                    </div>
                  </div>
                  <Badge variant={model.isEnabled ? "default" : "secondary"}>
                    {model.isEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {selectedModel && (
          <Card>
            <CardHeader>
              <CardTitle>Model Settings</CardTitle>
              <CardDescription>
                Configure parameters for {selectedModel.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Model Status</Label>
                  <Switch
                    checked={selectedModel.isEnabled}
                    onCheckedChange={(checked) => handleModelUpdate('isEnabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Temperature</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[selectedModel.temperature]}
                      max={2}
                      step={0.1}
                      onValueChange={([value]) => handleModelUpdate('temperature', value)}
                    />
                    <span className="w-12 text-sm">{selectedModel.temperature}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Controls randomness: Lower values are more focused, higher values more creative
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Max Tokens</Label>
                  <Input
                    type="number"
                    value={selectedModel.maxTokens}
                    onChange={(e) => handleModelUpdate('maxTokens', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Top P</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[selectedModel.topP]}
                      max={1}
                      step={0.05}
                      onValueChange={([value]) => handleModelUpdate('topP', value)}
                    />
                    <span className="w-12 text-sm">{selectedModel.topP}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Frequency Penalty</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[selectedModel.frequencyPenalty]}
                        max={2}
                        step={0.1}
                        onValueChange={([value]) => handleModelUpdate('frequencyPenalty', value)}
                      />
                      <span className="w-12 text-sm">{selectedModel.frequencyPenalty}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Presence Penalty</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[selectedModel.presencePenalty]}
                        max={2}
                        step={0.1}
                        onValueChange={([value]) => handleModelUpdate('presencePenalty', value)}
                      />
                      <span className="w-12 text-sm">{selectedModel.presencePenalty}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full">
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIModelConfig; 