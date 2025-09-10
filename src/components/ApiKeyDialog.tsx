
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (apiKey: string) => void;
}

export const ApiKeyDialog = ({ open, onOpenChange, onSave }: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    if (apiKey) {
      onSave(apiKey);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Gemini API Key</DialogTitle>
          <DialogDescription>
            To use StoryWeaver AI, you need a Google Gemini API key. You can get one from{" "}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline text-primary">
              Google AI Studio
            </a>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
              type="password"
              placeholder="Enter your key..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!apiKey}>Save Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
