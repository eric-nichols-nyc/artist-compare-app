import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileJson } from 'lucide-react'

interface JsonInputDialogProps {
  onSubmit: (data: any) => void
  title: string
}

export function JsonInputDialog({ onSubmit, title }: JsonInputDialogProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      onSubmit(parsed)
      setJsonInput('')
      setError(null)
    } catch (e) {
      setError('Invalid JSON format')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileJson className="w-4 h-4 mr-2" />
          Import JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="min-h-[200px] font-mono"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleSubmit}>Import</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 