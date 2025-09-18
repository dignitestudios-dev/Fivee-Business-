"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

interface AssetRow {
  id: string
  description: string
  marketValue: string
  loanBalance: string
}

interface DynamicAssetRowsProps {
  title: string
  assets: AssetRow[]
  onAddAsset: () => void
  onRemoveAsset: (id: string) => void
  onUpdateAsset: (id: string, field: keyof AssetRow, value: string) => void
}

export function DynamicAssetRows({ title, assets, onAddAsset, onRemoveAsset, onUpdateAsset }: DynamicAssetRowsProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">{title}</h4>

      {assets.map((asset, index) => (
        <div key={asset.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h5 className="font-medium text-gray-700">
              {title} {index + 1}
            </h5>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemoveAsset(asset.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`${asset.id}-description`}>Description</Label>
              <Input
                id={`${asset.id}-description`}
                value={asset.description}
                onChange={(e) => onUpdateAsset(asset.id, "description", e.target.value)}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor={`${asset.id}-marketValue`}>Market Value ($)</Label>
              <Input
                id={`${asset.id}-marketValue`}
                type="number"
                value={asset.marketValue}
                onChange={(e) => onUpdateAsset(asset.id, "marketValue", e.target.value)}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
            <div>
              <Label htmlFor={`${asset.id}-loanBalance`}>Loan Balance ($)</Label>
              <Input
                id={`${asset.id}-loanBalance`}
                type="number"
                value={asset.loanBalance}
                onChange={(e) => onUpdateAsset(asset.id, "loanBalance", e.target.value)}
                className="focus:ring-[#22b573] focus:border-[#22b573]"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={onAddAsset}
        className="w-full border-dashed border-[#22b573] text-[#22b573] hover:bg-[#22b573]/5 bg-transparent"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add {title}
      </Button>
    </div>
  )
}
